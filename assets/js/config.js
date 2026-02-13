// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // --- MAIN CONTACT ---
    whatsapp_api: "916304094177", 
    phone_display: "+91 63040-94177", 
    email: "support@sagarborewells.com",


     // --- ADDITIONAL NUMBERS ---
    extra_phones: [
        { label: "Emergency", number: "+91 93470-08871" },
        { label: "Proprietor", number: "+91 96522-46869" }
    ],

     // Tech Keys
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 

    
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
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

/**
 * 🔐 SECURE CREDENTIAL FETCHER
 * Retrieves Telegram tokens from Firestore 'config' collection.
 * This ensures tokens are never hardcoded in the JS file.
 */
async function getTelegramCredentials() {
    try {
        if (!firebase.apps.length) return null;
        const db = firebase.firestore();
        
        // Fetching from a secure collection 'system_config' document 'telegram'
        const doc = await db.collection('system_config').doc('telegram').get();
        
        if (doc.exists) {
            return doc.data(); // Returns { bot_token: "...", chat_id: "..." }
        } else {
            console.error("Telegram Config Not Found in Firebase");
            return null;
        }
    } catch (error) {
        console.error("Error fetching credentials:", error);
        return null;
    }
}

// HELPER: Injects details automatically on load
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

async function getMasterListUrl() {
    try {
        if (!firebase.apps.length) return null;
        const db = firebase.firestore();
        const doc = await db.collection('system_config').doc('inventory').get();
        if (doc.exists) return doc.data().master_sheet_url;
        return null;
    } catch (error) {
        console.error("Config Error:", error);
        return null;
    }
}
