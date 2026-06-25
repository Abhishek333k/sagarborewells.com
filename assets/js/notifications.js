/**
 * FILENAME: assets/js/notifications.js
 * PURPOSE: Centralized templates for Telegram alerts.
 */

const NOTIFY_TEMPLATES = {

    // 1. BOOKING CONFIRMATION
    booking: (data) => {
        return `
✅ *NEW BOOKING CONFIRMED!*
🆔 *Ref ID:* \`${data.id}\`
👤 *Name:* ${data.name}
📱 *Mobile:* \`${data.mobile}\`
📍 *Location:* ${data.loc}
📏 *Depth:* ${data.depth} ft
💰 *Grand Total:* ₹${parseInt(data.total).toLocaleString('en-IN')}

📝 *COST BREAKDOWN:*
${data.summary}
`.trim();
    },

    // 2. NEW LEAD (Unregistered)
    silent_lead: (data) => {
        return `
🔔 *NEW LEAD DETECTED*
📱 *Mobile:* \`${data.mobile}\`
📍 *Source:* ${data.source}
⚠️ *Status:* Unregistered / Exploring
`.trim();
    },

    // 3. EXISTING CLIENT LOGIN (Registered)
    client_return: (data) => {
        return `
👤 *CLIENT LOGGED IN*
📱 *Mobile:* \`${data.mobile}\`
📂 *Account Type:* Existing Customer
📍 *Action:* Accessed Dashboard
`.trim();
    },

    // 🟢 4. PRICE CHECK (The Missing Link)
    price_check: (data) => {
        return `
👀 *PRICE CHECKED*
🆔 *Ref:* \`${data.id}\`
👤 *Name:* ${data.name}
📱 *Mobile:* \`${data.mobile}\`
📏 *Depth:* ${data.depth} ft
💰 *Shown:* ₹${parseInt(data.total).toLocaleString('en-IN')}
⚠️ *Status:* Viewing Estimate (Not Booked)
`.trim();
    }

};

/**
 * 🚀 EDGE FUNCTION DISPATCHER
 * Securely triggers the Supabase Edge Function to send Telegram alerts.
 * @param {string} message - The formatted markdown/HTML message to send.
 */
async function sendEdgeNotification(message) {
    try {
        const response = await fetch('https://ixfjpphlxpkkikvkfcki.supabase.co/functions/v1/telegram-notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) {
            console.error('Edge Function Error:', await response.text());
        }
    } catch (error) {
        console.error('Failed to trigger Edge Notification:', error);
    }
}
