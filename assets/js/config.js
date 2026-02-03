// FILENAME: assets/js/config.js

// --- 🔔 NOTIFICATION SYSTEM CONFIG ---
const TELEGRAM_BOT_TOKEN = "8101404237:AAGvl3yqhK66t8KZMyg3Pn8x4hW2SnAp8cI"; // Get this from @BotFather
const TELEGRAM_CHAT_ID = "1056358465";     // Get this from @userinfobot

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

    // --- OFFICE LOCATION ---
    address_line1: "Gowtham Buddha Rd, beside UCO Bank, opp. Tenali Road",
    address_line2: "Mangalagiri, Andhra Pradesh, India - 522503",
    
    // Maps Links
    map_link: "https://maps.app.goo.gl/VGqQCjRQCx729Qmd6", 
    // Just the link inside quotes. No HTML tags here.
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.917849365705!2d80.56584199999999!3d16.428998099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f1606165d7b7%3A0xc31ff66a47bd70ce!2sSAGAR%20BOREWELLS!5e0!3m2!1sen!2sin!4v1769782593951!5m2!1sen!2sin",

    // Socials
    social_instagram: "https://www.instagram.com/sagar_bore_wells/",
    social_youtube: "https://www.youtube.com/@Sagar_Bore_Wells",

    // --- FIREBASE CONFIG (CORRECT FORMAT) ---
    // Note: It is "key: value", NOT "const key = value"
    firebase_config: {
        apiKey: "AIzaSyAp3D__eHpiOaPoQmO2eXL25C2evR0yqfQ",
        authDomain: "sbw-ops-956b1.firebaseapp.com",
        projectId: "sbw-ops-956b1",
        storageBucket: "sbw-ops-956b1.firebasestorage.app",
        messagingSenderId: "958364659529",
        appId: "1:958364659529:web:bb3387a1ded9374ed0f498",
        measurementId: "G-XLMWW4MMTL"
    },

    // Tech Keys
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

// HELPER: Injects details
function loadContactDetails() {
    document.querySelectorAll('.dynamic-phone').forEach(el => {
        el.innerText = CONTACT_INFO.phone_display;
        if(el.tagName === 'A') el.href = `tel:+${CONTACT_INFO.whatsapp_api}`;
    });
    document.querySelectorAll('.dynamic-email').forEach(el => {
        el.innerText = CONTACT_INFO.email;
        if(el.tagName === 'A') el.href = `mailto:${CONTACT_INFO.email}`;
    });
    document.querySelectorAll('.dynamic-address').forEach(el => {
        el.innerHTML = `${CONTACT_INFO.address_line1}<br>${CONTACT_INFO.address_line2}`;
    });
}
document.addEventListener("DOMContentLoaded", loadContactDetails);
