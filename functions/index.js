const { onDocumentCreated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
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


// 🤖 Nvidia NIM CORS Proxy
exports.getPumpAdvice = onCall({
    timeoutSeconds: 180,
    memory: "512MiB",
    cors: true
}, async (request) => {
    const prompt = request.data.prompt;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!nvidiaKey) {
        console.error("NVIDIA_API_KEY is missing in environment variables.");
        throw new HttpsError("internal", "Nvidia API Key is missing.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 160000); // 160s internal timeout

    try {
        console.log("Calling Nvidia NIM API...");
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${nvidiaKey}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct",
                messages: [{ "role": "user", "content": prompt }],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Nvidia API Rejected Request. Status: ${response.status}`, errorText);
            throw new HttpsError("unavailable", `Nvidia API Error: ${response.status}`);
        }

        const json = await response.json();
        if (!json.choices || !json.choices[0]) {
            console.error("Invalid Nvidia API response format:", json);
            throw new HttpsError("internal", "Invalid response from AI engine.");
        }

        console.log("AI Response received successfully.");
        return { result: json.choices[0].message.content };

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error("Nvidia API call timed out after 90s.");
            throw new HttpsError("deadline-exceeded", "The AI engine took too long to respond.");
        }
        console.error("Cloud Function Error:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError("internal", error.message || "An unexpected error occurred.");
    }
}); 