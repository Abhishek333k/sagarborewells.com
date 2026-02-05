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

    // --- FIREBASE CONFIG (Public/Safe to expose) ---
    firebase_config: {
        apiKey: "AIzaSyAp3D__eHpiOaPoQmO2eXL25C2evR0yqfQ",
        authDomain: "sbw-ops-956b1.firebaseapp.com",
        projectId: "sbw-ops-956b1",
        storageBucket: "sbw-ops-956b1.firebasestorage.app",
        messagingSenderId: "958364659529",
        appId: "1:958364659529:web:bb3387a1ded9374ed0f498",
        measurementId: "G-XLMWW4MMTL"
    }
};

// 🟢 INITIALIZE FIREBASE
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
} else if (typeof firebase === 'undefined') {
    console.error("🔥 CRITICAL: Firebase SDK not loaded.");
}

// ---------------------------------------------------------
// 🔐 SECURE VAULT (Fetch Sensitive Data from DB)
// ---------------------------------------------------------

// 1. Google Maps Key (Cached)
let _cachedMapsKey = null;
async function getGoogleMapsKey() {
    if (_cachedMapsKey) return _cachedMapsKey;
    try {
        if (typeof firebase === 'undefined') return null;
        const doc = await firebase.firestore().collection('system_config').doc('api_keys').get();
        if (doc.exists) {
            _cachedMapsKey = doc.data().google_maps;
            return _cachedMapsKey;
        }
        return null;
    } catch (e) { console.error("Maps Key Error", e); return null; }
}

// 2. Inventory Databases (KSB, Kirloskar, etc.)
// Returns an object: { ksb_db_url: "...", kirloskar_db_url: "...", ai_agent_url: "..." }
let _cachedInventoryConfig = null;
async function getInventoryConfig() {
    if (_cachedInventoryConfig) return _cachedInventoryConfig;
    try {
        if (typeof firebase === 'undefined') return null;
        const doc = await firebase.firestore().collection('system_config').doc('inventory').get();
        if (doc.exists) {
            _cachedInventoryConfig = doc.data();
            return _cachedInventoryConfig;
        }
        console.error("🔥 Inventory Config Missing in DB");
        return null;
    } catch (e) { console.error("DB Config Error", e); return null; }
}

// 3. Telegram Credentials
async function getTelegramCredentials() {
    try {
        if (typeof firebase === 'undefined') return null;
        const doc = await firebase.firestore().collection('system_config').doc('telegram').get();
        return doc.exists ? doc.data() : null;
    } catch (e) { return null; }
}

// ---------------------------------------------------------
// 🛠️ UI HELPERS
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
