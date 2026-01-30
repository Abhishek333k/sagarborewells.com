// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. HEADER
    const headerHTML = `
    <nav class="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <a href="index.html" class="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-droplet text-blue-600"></i> SAGAR <span class="text-blue-600">BOREWELLS</span>
            </a>
            
            <div class="flex items-center gap-4">
                <a href="index.html" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Home</a>
                <a href="contact.html" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Contact</a>
                <a href="quote.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg transition flex items-center gap-2">
                    <i class="fa-solid fa-calculator"></i> <span class="hidden md:inline">Get Quote</span>
                </a>
            </div>
        </div>
    </nav>
    `;

    // 2. FOOTER (Cleaned Up)
    const footerHTML = `
    <footer class="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800 text-slate-400 font-sans mt-auto">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div class="col-span-1 md:col-span-1">
                <a href="index.html" class="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
                    SAGAR <span class="text-blue-500">OPS</span>
                </a>
                <p class="text-xs leading-relaxed mb-6">
                    Advanced geological sensor drilling. Delivering precision water solutions since 2010.
                </p>
                
                <div class="flex gap-3">
                    <a href="https://wa.me/${CONTACT_INFO.whatsapp_api}" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition" title="WhatsApp">
                        <i class="fa-brands fa-whatsapp text-lg"></i>
                    </a>
                    <a href="${CONTACT_INFO.social_instagram}" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition" title="Instagram">
                        <i class="fa-brands fa-instagram text-lg"></i>
                    </a>
                    <a href="${CONTACT_INFO.social_youtube}" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition" title="YouTube">
                        <i class="fa-brands fa-youtube text-lg"></i>
                    </a>
                </div>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Quick Access</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="index.html" class="hover:text-blue-400 transition">Home</a></li>
                    <li><a href="quote.html" class="hover:text-blue-400 transition">Get Estimate</a></li>
                    <li><a href="contact.html" class="hover:text-blue-400 transition">Contact & Support</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Policies</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="terms.html" class="hover:text-blue-400 transition">Terms & Conditions</a></li>
                    <li><a href="privacy.html" class="hover:text-blue-400 transition">Privacy Policy</a></li>
                    <li><a href="refund.html" class="hover:text-blue-400 transition">Refund Policy</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Contact</h4>
                <ul class="space-y-3 text-sm">
                    <li class="flex items-start gap-3">
                        <i class="fa-solid fa-location-dot mt-1 text-blue-500"></i>
                        <span class="dynamic-address">Loading...</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fa-solid fa-phone text-blue-500"></i>
                        <a href="#" class="hover:text-white dynamic-phone">Loading...</a>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fa-solid fa-envelope text-blue-500"></i>
                        <a href="#" class="hover:text-white dynamic-email">Loading...</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-slate-800 pt-8 text-center text-xs">
            <p>&copy; 2026 Sagar Borewells. All rights reserved.</p>
        </div>
    </footer>
    `;

    // Inject
    const headerMount = document.getElementById('navbar-mount');
    const footerMount = document.getElementById('footer-mount');

    if(headerMount) headerMount.innerHTML = headerHTML;
    if(footerMount) footerMount.innerHTML = footerHTML;
});
