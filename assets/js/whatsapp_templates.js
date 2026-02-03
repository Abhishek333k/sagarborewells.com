/**
 * FILENAME: assets/js/whatsapp_templates.js
 * PURPOSE: Centralized WhatsApp Message Generators
 * PSYCHOLOGY: Uses 'Commitment & Consistency' principles. 
 * By sending a formal text, the user subconsciously commits to the project.
 */

const WA_MSG = {

    // 1. GENERAL SUPPORT (The "Gatekeeper")
    // Psychology: Sets boundaries. "Priority" makes them feel special but "Ticket" implies a queue.
    support: () => {
        return `Greetings Sagar Team,\n\nI require assistance with a borewell inquiry.\n\nType: [New / Existing]\nPriority: Standard\n\nPlease connect me with a representative.`.trim();
    },

    // 2. DEEP DRILLING ALERT (>600ft) (The "Specialist")
    // Psychology: Uses "Geological Assessment" instead of "looking". Implies expertise is needed.
    deep_drill: (depth) => {
        return `⚠️ *CRITICAL: HIGH DEPTH INQUIRY*\n\nI am planning a borewell exceeding ${depth} ft.\nI require a senior geological assessment regarding pressure zones and casing stability.\n\nPlease assign a technical expert.`.trim();
    },

    // 3. EXPERT CONSULTATION (The "VIP")
    // Psychology: "Feasibility" and "Hydrology" frame the user as an educated buyer, not a window shopper.
    expert_call: () => {
        return `REQUEST FOR CONSULTATION\n\nI would like to schedule a technical call regarding site feasibility and hydrology.\n\nProject Scope: [Domestic / Industrial]\nPreferred Time: [Morning / Evening]`.trim();
    },

    // 4. FINANCE / LOAN (The "applicant")
    // Psychology: "Eligibility" implies scarcity. It makes them want to qualify.
    finance_inquiry: (amount) => {
        return `FINANCE APPLICATION INQUIRY\n\nI am interested in the Borewell Finance Program.\nEstimated Amount: ₹${amount}\n\nPlease provide eligibility criteria and EMI structures.`.trim();
    },

    // 5. BOOKING CONFIRMATION (The "Receipt")
    // Legal: Re-states the agreement to create a paper trail.
    booking_share: (data) => {
        return `CONFIRMED ESTIMATE: ${data.id}\n\nLocation: ${data.loc}\nDepth: ${data.depth} ft\nTotal: ₹${parseInt(data.total).toLocaleString('en-IN')}\n\nI am ready to proceed with the site inspection formalities.`.trim();
    },

    // 6. CHAT SUPPORT (The "Helpdesk")
    chat_support: () => {
        return `[TICKET OPEN]\n\nI have a query regarding ongoing services/pricing.\nPlease respond at your earliest convenience.`.trim();
    },

    // --- HELPER FUNCTION ---
    link: (phone, text) => {
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }
};
