const { onDocumentCreated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// Set global options (e.g., region)
setGlobalOptions({ region: "us-central1" });

// ============================================================================
// HELPER: SECURE TELEGRAM SENDER
// ============================================================================
async function sendTelegramAlert(message, leadId) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Missing Telegram credentials. Check your .env file.");
        return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        if (!response.ok) {
            console.error("Telegram API Error:", await response.text());
        } else {
            console.log(`✅ Notification successfully sent for lead: ${leadId}`);
        }
    } catch (error) {
        console.error("Network error sending Telegram message:", error);
    }
}

// ============================================================================
// TRIGGER 1: CONFIRMED BOOKINGS (v2 Syntax)
// ============================================================================
exports.notifynewlead = onDocumentCreated("leads/{leadId}", async (event) => {
    const data = event.data.data();
    const leadId = event.params.leadId;
    
    const message = `✅ *NEW BOOKING CONFIRMED!*\n` +
        `🆔 *Ref ID:* \`${data.id || leadId}\`\n` +
        `👤 *Name:* ${data.name || 'N/A'}\n` +
        `📱 *Mobile:* \`${data.mobile || 'N/A'}\`\n` +
        `📍 *Location:* ${data.loc || 'N/A'}\n` +
        `📏 *Depth:* ${data.depth || 'N/A'} ft\n` +
        `💰 *Grand Total:* ₹${(data.total || 0).toLocaleString('en-IN')}\n\n` +
        `📝 *COST BREAKDOWN:*\n${data.summary || 'N/A'}`;

    await sendTelegramAlert(message, leadId);
});

// ============================================================================
// TRIGGER 2: PRICE CHECKS (v2 Syntax)
// ============================================================================
exports.notifypricecheck = onDocumentWritten("silent_leads/{leadId}", async (event) => {
    // Check if document was deleted
    if (!event.data.after.exists) return;
    
    const data = event.data.after.data();
    const isUpdate = event.data.before.exists;
    const leadId = event.params.leadId;
    
    const header = isUpdate ? `🔄 *PRICE CHECK UPDATED*` : `👀 *PRICE CHECKED*`;
    
    const message = `${header}\n` +
        `🆔 *Ref:* \`${data.id || leadId}\`\n` +
        `👤 *Name:* ${data.name || 'N/A'}\n` +
        `📱 *Mobile:* \`${data.mobile || 'N/A'}\`\n` +
        `📍 *Location:* ${data.loc || 'N/A'}\n` +
        `📏 *Depth:* ${data.depth || 'N/A'} ft\n` +
        `💰 *Shown:* ₹${(data.total || 0).toLocaleString('en-IN')}\n` +
        `⚠️ *Status:* ${isUpdate ? 'Recalculated Estimate' : 'Viewing Estimate (Not Booked)'}`;

    await sendTelegramAlert(message, leadId);
});