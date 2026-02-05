// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // --- MAIN CONTACT ---
    whatsapp_api: "916304094177", 
    phone_display: "+91 63040-94177", 
    email: "support@sagarborewells.com",
    
    // --- OFFICE LOCATION ---
    address_line1: "Gowtham Buddha Rd, beside UCO Bank",
    address_line2: "Mangalagiri, Andhra Pradesh, India - 522503",
    
    // --- SOCIAL MEDIA ---
    social: {
        instagram: "https://www.instagram.com/sagar_bore_wells/",
        youtube: "https://www.youtube.com/@Sagar_Bore_Wells"
    },

    // --- FIREBASE CONFIG ---
    firebase_config: {
        apiKey: "AIzaSyAp3D__eHpiOaPoQmO2eXL25C2evR0yqfQ",
        authDomain: "sbw-ops-956b1.firebaseapp.com",
        projectId: "sbw-ops-956b1",
        storageBucket: "sbw-ops-956b1.firebasestorage.app",
        messagingSenderId: "958364659529",
        appId: "1:958364659529:web:bb3387a1ded9374ed0f498",
        measurementId: "G-XLMWW4MMTL"
    },

    // --- API KEYS ---
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus"
};

// 🟢 INITIALIZE FIREBASE (Singleton Pattern)
// Ensures Firebase is only loaded once per page load
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}

// ---------------------------------------------------------
// 🔐 SECURE CREDENTIAL FETCHERS (THE VAULT)
// ---------------------------------------------------------

/**
 * 1. TELEGRAM BOT CREDENTIALS
 * Fetches token for booking notifications.
 */
async function getTelegramCredentials() {
    try {
        if (!firebase.apps.length) return null;
        const db = firebase.firestore();
        const doc = await db.collection('system_config').doc('telegram').get();
        
        if (doc.exists) return doc.data(); 
        console.error("Telegram Config Not Found in Firebase");
        return null;
    } catch (error) {
        console.error("Error fetching credentials:", error);
        return null;
    }
}

/**
 * 2. AI INVENTORY AGENT URL (With Caching)
 * Fetches the Google Apps Script Web App URL.
 * Uses a memory cache to prevent spamming Firestore on repeated clicks.
 */
let _cachedAgentUrl = null;

async function getInventoryAgentUrl() {
    // Return from memory if already fetched this session
    if (_cachedAgentUrl) return _cachedAgentUrl;

    try {
        if (!firebase.apps.length) return null;
        const db = firebase.firestore();
        
        // Fetch from 'system_config' -> 'inventory' -> field: 'ai_agent_url'
        const doc = await db.collection('system_config').doc('inventory').get();
        
        if (doc.exists && doc.data().ai_agent_url) {
            _cachedAgentUrl = doc.data().ai_agent_url;
            return _cachedAgentUrl;
        } else {
            console.error("🔥 CRITICAL: 'ai_agent_url' not found in Firestore.");
            return null;
        }
    } catch (error) {
        console.error("🔥 CONFIG ERROR: Could not fetch Agent URL.", error);
        return null;
    }
}

// ---------------------------------------------------------
// 🛠️ UI HELPERS (Auto-Inject Contact Info)
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const setTxt = (sel, val) => document.querySelectorAll(sel).forEach(el => el.innerText = val);
    const setHref = (sel, pre, val) => document.querySelectorAll(sel).forEach(el => { if(el.tagName==='A') el.href = pre + val; });

    setTxt('.dynamic-phone', CONTACT_INFO.phone_display);
    setHref('.dynamic-phone', 'tel:+', CONTACT_INFO.whatsapp_api);
    
    setTxt('.dynamic-email', CONTACT_INFO.email);
    setHref('.dynamic-email', 'mailto:', CONTACT_INFO.email);
    
    document.querySelectorAll('.dynamic-address').forEach(el => {
        el.innerHTML = `${CONTACT_INFO.address_line1}<br>${CONTACT_INFO.address_line2}`;
    });
});
