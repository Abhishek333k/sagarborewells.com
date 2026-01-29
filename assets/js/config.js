// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // The Master Phone Number (Format: CountryCode + Number)
    whatsapp_api: "916304094177", 
    
    // Display format for the screen
    phone_display: "+91 98765-43210", 
    
    // Support Email
    email: "support@sagarborewells.com",
    
    // Office Address
    address: "Mangalagiri, Andhra Pradesh",
    
    // Google Maps API Key (Optional: Centralize your key here if you want)
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus" 

    database_url: "https://script.google.com/macros/s/AKfycbx.../exec"
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
