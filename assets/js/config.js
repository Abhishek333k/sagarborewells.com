// FILENAME: assets/js/config.js

const CONTACT_INFO = {
    whatsapp_api: "916304094177", 
    phone_display: "+91 63040-94177", 
    email: "support@sagarborewells.com",
    address: "Mangalagiri, Andhra Pradesh",
    google_maps_key: "AIzaSyDkHaU8FfYd2vQWHiU02yjA_7DrsOWHYus", // Comma Fixed
    database_url: "https://script.google.com/macros/s/AKfycbwMJ16yDE-PsghDqyBa6mS4J-QXrMn10OYSEthKZEMRhv9uw6N1NpBN3_FgNX7PsmeSig/exec"
};

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
