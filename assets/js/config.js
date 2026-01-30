// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    // The Master Phone Number
    whatsapp_api: "916304094177", 
    
    // Display format for the screen
    phone_display: "+91 63040-94177", 
    
    // Support Email
    email: "support@sagarborewells.com",
    
    // Office Address
    address: "Mangalagiri, Andhra Pradesh",
    
    // Google Maps API Key
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", // <--- I ADDED THE COMMA HERE

    // Your Database URL
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

// Function to inject details into HTML
function loadContactDetails() {
    const phoneElements = document.querySelectorAll('.dynamic-phone');
    phoneElements.forEach(el => {
        el.innerText = CONTACT_INFO.phone_display;
        if(el.tagName === 'A') el.href = `tel:+${CONTACT_INFO.whatsapp_api}`;
    });

    const emailElements = document.querySelectorAll('.dynamic-email');
    emailElements.forEach(el => el.innerText = CONTACT_INFO.email);
}

document.addEventListener("DOMContentLoaded", loadContactDetails);
