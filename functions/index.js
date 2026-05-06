const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin privileges
admin.initializeApp();

// ============================================================================
// HELPER: SECURE TELEGRAM SENDER
// ============================================================================
async function sendTelegramAlert(message, leadId) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Missing Telegram credentials. Check your .env file.");
        return null;
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
// TRIGGER 1: CONFIRMED BOOKINGS (Watches 'leads' collection)
// ============================================================================
exports.notifyNewLead = functions.firestore
    .document("leads/{leadId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        
        const message = `✅ *NEW BOOKING CONFIRMED!*\n` +
            `🆔 *Ref ID:* \`${data.id || context.params.leadId}\`\n` +
            `👤 *Name:* ${data.name || 'N/A'}\n` +
            `📱 *Mobile:* \`${data.mobile || 'N/A'}\`\n` +
            `📍 *Location:* ${data.loc || 'N/A'}\n` +
            `📏 *Depth:* ${data.depth || 'N/A'} ft\n` +
            `💰 *Grand Total:* ₹${(data.total || 0).toLocaleString('en-IN')}\n\n` +
            `📝 *COST BREAKDOWN:*\n${data.summary || 'N/A'}`;

        await sendTelegramAlert(message, context.params.leadId);
        return null;
    });

// ============================================================================
// TRIGGER 2: PRICE CHECKS (Watches 'silent_leads' collection)
// ============================================================================
exports.notifyPriceCheck = functions.firestore
    .document("silent_leads/{leadId}")
    .onWrite(async (change, context) => {
        if (!change.after.exists) return null; // Do nothing if document was deleted
        
        const data = change.after.data();
        const isUpdate = change.before.exists;
        
        const header = isUpdate ? `🔄 *PRICE CHECK UPDATED*` : `👀 *PRICE CHECKED*`;
        
        const message = `${header}\n` +
            `🆔 *Ref:* \`${data.id || context.params.leadId}\`\n` +
            `👤 *Name:* ${data.name || 'N/A'}\n` +
            `📱 *Mobile:* \`${data.mobile || 'N/A'}\`\n` +
            `📍 *Location:* ${data.loc || 'N/A'}\n` +
            `📏 *Depth:* ${data.depth || 'N/A'} ft\n` +
            `💰 *Shown:* ₹${(data.total || 0).toLocaleString('en-IN')}\n` +
            `⚠️ *Status:* ${isUpdate ? 'Recalculated Estimate' : 'Viewing Estimate (Not Booked)'}`;

        await sendTelegramAlert(message, context.params.leadId);
        return null;
    });