// FILENAME: assets/js/config.js

// 🟢 ARCHITECTURAL FIX: Use 'var' or window check to prevent re-declaration crashes
if (typeof window.CONTACT_INFO === 'undefined') {
    window.CONTACT_INFO = {
        // 🛠️ OPS IDENTITY
        whatsapp_api: "916304094177",
        phone_display: "+91 63040-94177",
        email: "support@sagarborewells.com",

        // 📍 LOCATION DATA
        address_line1: "Gowtham Buddha Rd, beside UCO Bank",
        address_line2: "Mangalagiri, Andhra Pradesh, India - 522503",
        
        // 🚨 CRITICAL FIX: Added missing map key. 
        // RESTRICT THIS KEY in Google Cloud Console to your domain (sagarborewells.com)
        google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 

        social: {
            instagram: "https://www.instagram.com/sagar_bore_wells/",
            youtube: "https://www.youtube.com/@Sagar_Bore_Wells"
        },

        // 🔥 FIREBASE CONFIG (Ensure Firestore Rules are set to 'allow read/write: if request.auth != null')
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
}

// 🟢 SAFE INITIALIZATION
// Checks if Firebase SDK is loaded AND if an app hasn't been initialized yet
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    try {
        firebase.initializeApp(window.CONTACT_INFO.firebase_config);
    } catch(e) {
        console.error("OpsCode Critical: Firebase Init Failed", e);
    }
}

// ---------------------------------------------------------
// 🔐 SECURE VAULT ACCESSORS
// ---------------------------------------------------------

async function getGeminiKey() {
    if (typeof firebase === 'undefined') return null;
    try {
        // Optimization: Cache key in session storage to save DB reads?
        // For now, keep direct fetch for security.
        const doc = await firebase.firestore().collection('system_config').doc('api_keys').get();
        return doc.exists ? doc.data().gemini_flash : null;
    } catch (e) { console.warn("Vault Access Denied"); return null; }
}

async function getInventoryConfig() {
    if (typeof firebase === 'undefined') return null;
    try {
        const doc = await firebase.firestore().collection('system_config').doc('inventory').get();
        return doc.exists ? doc.data() : null;
    } catch (e) { return null; }
}

// ---------------------------------------------------------
// 🛠️ UI HYDRATION (Safe)
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const info = window.CONTACT_INFO;
    
    // Helper to safely update elements only if they exist
    const safeSet = (selector, callback) => {
        const els = document.querySelectorAll(selector);
        if(els.length > 0) els.forEach(callback);
    };

    safeSet('.dynamic-phone', el => {
        el.innerText = info.phone_display;
        if(el.tagName === 'A') el.href = `tel:+${info.whatsapp_api}`;
    });

    safeSet('.dynamic-email', el => {
        el.innerText = info.email;
        if(el.tagName === 'A') el.href = `mailto:${info.email}`;
    });

    safeSet('.dynamic-address', el => {
        el.innerHTML = `${info.address_line1}<br>${info.address_line2}`;
    });
});
