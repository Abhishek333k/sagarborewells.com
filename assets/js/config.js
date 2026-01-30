// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // --- BASIC CONTACT ---
    // The Master Phone Number (Format: CountryCode + Number) used for WhatsApp links
    whatsapp_api: "916304094177", 
    
    // How the phone number looks to humans
    phone_display: "+91 63040-94177", 
    
    // Support Email
    email: "support@sagarborewells.com",
    
    // --- OFFICE LOCATION ---
    // The text address shown on screen
    address_line1: "Gowtham Buddha Rd, beside UCO Bank, opp. Tenali Road, Mangalagiri, Andhra Pradesh 522503",
    address_line2: "India - 522503",
    
    // The GPS coordinates for the Office Map (Change this to move the pin)
    office_lat: 16.4428, 
    office_lng: 80.5645,

    // --- SOCIAL LINKS ---
    social_instagram: "https://www.instagram.com/sagar_bore_wells/",
    social_youtube: "https://www.youtube.com/@Sagar_Bore_Wells",

    // --- TECH KEYS ---
    // Google Maps API Key
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", 

    // Your Database URL (Google App Script)
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

// HELPER: Injects these details into any page that loads this script
function loadContactDetails() {
    // 1. Fill Phone Numbers
    document.querySelectorAll('.dynamic-phone').forEach(el => {
        el.innerText = CONTACT_INFO.phone_display;
        if(el.tagName === 'A') el.href = `tel:+${CONTACT_INFO.whatsapp_api}`;
    });

    // 2. Fill Emails
    document.querySelectorAll('.dynamic-email').forEach(el => {
        el.innerText = CONTACT_INFO.email;
        if(el.tagName === 'A') el.href = `mailto:${CONTACT_INFO.email}`;
    });

    // 3. Fill Address
    document.querySelectorAll('.dynamic-address').forEach(el => {
        el.innerHTML = `${CONTACT_INFO.address_line1}<br>${CONTACT_INFO.address_line2}`;
    });
}

document.addEventListener("DOMContentLoaded", loadContactDetails);
