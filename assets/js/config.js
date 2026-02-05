// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    whatsapp_api: "916304094177", 
    phone_display: "+91 63040-94177", 
    email: "support@sagarborewells.com",
    
    address_line1: "Gowtham Buddha Rd, beside UCO Bank",
    address_line2: "Mangalagiri, Andhra Pradesh, India - 522503",
    
    social: {
        instagram: "https://www.instagram.com/sagar_bore_wells/",
        youtube: "https://www.youtube.com/@Sagar_Bore_Wells"
    },

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
}

// ---------------------------------------------------------
// 🔐 SECURE VAULT (Fetch Keys from DB)
// ---------------------------------------------------------

// 1. Get Gemini API Key
async function getGeminiKey() {
    try {
        if (typeof firebase === 'undefined') return null;
        const doc = await firebase.firestore().collection('system_config').doc('api_keys').get();
        return doc.exists ? doc.data().gemini_flash : null;
    } catch (e) { return null; }
}

// 2. Get Inventory URLs (KSB Sheet API)
async function getInventoryConfig() {
    try {
        if (typeof firebase === 'undefined') return null;
        const doc = await firebase.firestore().collection('system_config').doc('inventory').get();
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
