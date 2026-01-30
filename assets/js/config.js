// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // The Master Phone Number (Format: CountryCode + Number)
    whatsapp_api: "916304094177", 
    
    // Display format for the screen (I updated this to match your real number)
    phone_display: "+91 63040-94177", 
    
    // Support Email
    email: "support@sagarborewells.com",
    
    // Office Address
    address: "Mangalagiri, Andhra Pradesh",
    
    // Google Maps API Key
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", // <--- COMMA WAS MISSING HERE!

    // Your Database URL
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

// This function finds elements with specific IDs and fills them text
function loadContactDetails() {
    // Fill Phone Numbers on screen
    const phoneElements = document.querySelectorAll('.dynamic-phone');
    phoneElements.forEach(el => {
        el.innerText = CONTACT_INFO.phone_display;
        if(el.tagName === 'A') {
            el.href = `tel:+${CONTACT_INFO.whatsapp_api}`;
        }
    });

    // Fill Emails
    const emailElements = document.querySelectorAll('.dynamic-email');
    emailElements.forEach(el => el.innerText = CONTACT_INFO.email);
}

// Run this when page loads
document.addEventListener("DOMContentLoaded", loadContactDetails);
