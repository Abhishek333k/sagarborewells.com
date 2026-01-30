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
    
    // 🟢 NEW: Your Google Maps Business Link (For Directions)
    // Go to your business on Google Maps -> Share -> Copy Link -> Paste here
    map_link: "https://maps.app.goo.gl/VGqQCjRQCx729Qmd6",

    // 🟢 2. FOR EMBED MAP VIEW (The Iframe Src)
    // I put a working code for Mangalagiri here. 
    // To change it: Go to Google Maps > Share > Embed a map > Copy ONLY the part inside src="..."
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.664669677336!2d80.56233321486333!3d16.44185798865166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a0d0a0a1%3A0x0!2sMangalagiri!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
    
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
