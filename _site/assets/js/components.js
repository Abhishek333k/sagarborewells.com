// FILENAME: assets/js/components.js

// Ensure config.js is loaded BEFORE this file in your HTML
document.addEventListener("DOMContentLoaded", function() {
    
    const headerHTML = `
    <nav class="bg-[#0f172a] border-b border-slate-800 p-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold tracking-tight text-white">SAGAR <span class="text-blue-500">OPS</span></a>
            
            <a href="tel:+${CONTACT_INFO.whatsapp_api}" class="text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-2">
                <i class="fa-solid fa-phone"></i> 
                <span class="dynamic-phone">${CONTACT_INFO.phone_display}</span>
            </a>
        </div>
    </nav>
    `;

    const mountPoint = document.getElementById('header-mount');
    if (mountPoint) { // Only inject if the mount point exists
        mountPoint.innerHTML = headerHTML;
    }
});
