// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // --- MAIN CONTACT (Used for WhatsApp & Header/Footer) ---
    whatsapp_api: "916304094177", 
    phone_display: "+91 63040-94177", 
    email: "support@sagarborewells.com",
    
    // --- 🟢 NEW: ADDITIONAL NUMBERS ---
    // Add as many as you need. Leave [] empty if none.
    extra_phones: [
        //{ label: "Site Supervisor", number: "+91 98765-43210" },
        { label: "Emergency", number: "+91 93470-08871" } ,
        { label: "Prop", number: "+91 96522-46869" }
    ],

    // --- OFFICE LOCATION ---
    address_line1: "Gowtham Buddha Rd, beside UCO Bank, opp. Tenali Road, Mangalagiri, Andhra Pradesh",
    address_line2: "India - 522503",
    
    // Maps Links
    map_link: "https://maps.app.goo.gl/VGqQCjRQCx729Qmd6", 
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1913.4575977272486!2d80.56475752220372!3d16.42913285143291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f1606165d7b7%3A0xc31ff66a47bd70ce!2sSAGAR%20BOREWELLS!5e0!3m2!1sen!2sin!4v1769771546158!5m2!1sen!2sin",

    // Socials
    social_instagram: "https://www.instagram.com/sagar_bore_wells/",
    social_youtube: "https://www.youtube.com/@Sagar_Bore_Wells",

    // FIREBASE CONFIG (You get this from Firebase Console) ---
    const firebaseConfig = {
    apiKey: "AIzaSyAp3D__eHpiOaPoQmO2eXL25C2evR0yqfQ",
    authDomain: "sbw-ops-956b1.firebaseapp.com",
    projectId: "sbw-ops-956b1",
    storageBucket: "sbw-ops-956b1.firebasestorage.app",
    messagingSenderId: "958364659529",
    appId: "1:958364659529:web:bb3387a1ded9374ed0f498",
    measurementId: "G-XLMWW4MMTL"
  };
    // Tech Keys
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

// HELPER: Injects details (Updated to ignore extra phones for basic slots)
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
