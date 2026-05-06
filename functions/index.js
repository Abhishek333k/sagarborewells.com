const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin privileges
admin.initializeApp();

exports.notifyNewLead = functions.firestore
    .document("leads/{leadId}")
    .onCreate(async (snap, context) => {
        // 1. Get the newly created booking data
        const data = snap.data();

        // 2. Securely grab the Telegram tokens from the .env file
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error("Missing Telegram credentials. Check your .env file.");
            return null;
        }

        // 3. Format the Notification Message
        const message = `🚨 *NEW CONFIRMED BOOKING* 🚨\n\n` +
            `*Ref ID:* ${data.id || context.params.leadId}\n` +
            `*Customer:* ${data.name || 'N/A'}\n` +
            `*Mobile:* ${data.mobile || 'N/A'}\n` +
            `*Location:* ${data.loc || 'N/A'}\n` +
            `*Depth Req:* ${data.depth || 'N/A'} ft\n` +
            `*Total Value:* ₹${(data.total || 0).toLocaleString()}\n\n` +
            `[Log in to Dashboard](https://sagarborewells.com/dashboard.html)`;

        // 4. Send the API request to Telegram from Google's secure servers
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
                console.log(`✅ Notification successfully sent for lead: ${context.params.leadId}`);
            }
        } catch (error) {
            console.error("Network error sending Telegram message:", error);
        }

        return null;
    });