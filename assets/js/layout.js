// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DYNAMIC HEADER
    const headerHTML = `
    <nav class="bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <a href="index.html" class="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-droplet text-blue-600"></i> SAGAR <span class="text-blue-600">BOREWELLS</span>
            </a>
            
            <div class="flex items-center gap-4">
                <a href="index.html" class="hidden md:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition">Home</a>
                <a href="quote.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg transition flex items-center gap-2">
                    <i class="fa-solid fa-calculator"></i> <span class="hidden md:inline">Get Quote</span>
                </a>
            </div>
        </div>
    </nav>
    `;

    // 2. DYNAMIC FOOTER (Updated with Socials & SEO)
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
                    <a href="https://wa.me/${CONTACT_INFO.whatsapp_api}" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition transform hover:-translate-y-1" title="Chat on WhatsApp">
                        <i class="fa-brands fa-whatsapp text-lg"></i>
                    </a>
                    
                    <a href="https://www.instagram.com/sagar_bore_wells/" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition transform hover:-translate-y-1" title="Follow on Instagram">
                        <i class="fa-brands fa-instagram text-lg"></i>
                    </a>
                    
                    <a href="https://www.youtube.com/@Sagar_Bore_Wells" target="_blank" class="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition transform hover:-translate-y-1" title="Watch on YouTube">
                        <i class="fa-brands fa-youtube text-lg"></i>
                    </a>
                </div>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Quick Access</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="index.html" class="hover:text-blue-400 transition">Home</a></li>
                    <li><a href="quote.html" class="hover:text-blue-400 transition">Get Estimate</a></li>
                    <li><a href="#" class="hover:text-blue-400 transition">Our Fleet</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Policies</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="terms.html" class="hover:text-blue-400 transition">Terms & Conditions</a></li>
                    <li><a href="privacy.html" class="hover:text-blue-400 transition">Privacy Policy</a></li>
                    <li><a href="refund.html" class="hover:text-blue-400 transition">Refund Policy</a></li>
                    <li><a href="disclaimer.html" class="hover:text-blue-400 transition">Disclaimer</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Contact</h4>
                <ul class="space-y-3 text-sm">
                    <li class="flex items-start gap-3">
                        <i class="fa-solid fa-location-dot mt-1 text-blue-500"></i>
                        <span>Mangalagiri, Andhra Pradesh<br>India - 522503</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fa-solid fa-phone text-blue-500"></i>
                        <a href="tel:+${CONTACT_INFO.whatsapp_api}" class="hover:text-white dynamic-phone">${CONTACT_INFO.phone_display}</a>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="fa-solid fa-envelope text-blue-500"></i>
                        <a href="mailto:${CONTACT_INFO.email}" class="hover:text-white dynamic-email">${CONTACT_INFO.email}</a>
                    </li>
                </ul>
                
                <div class="mt-6 pt-6 border-t border-slate-800">
                    <p class="text-[10px] text-slate-500 uppercase font-bold mb-1">Serving Areas</p>
                    <p class="text-xs text-slate-400">Vijayawada • Guntur • Amaravati • Mangalagiri</p>
                    <div class="mt-3 flex gap-2 text-slate-500 text-lg">
                        <i class="fa-solid fa-money-bill-wave" title="Cash Accepted"></i>
                        <i class="fa-brands fa-google-pay" title="UPI Accepted"></i>
                        <span class="text-[10px] bg-slate-800 px-2 py-1 rounded flex items-center gap-1"><i class="fa-solid fa-clock"></i> 24/7</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-slate-800 pt-8 text-center text-xs">
            <p>&copy; 2026 Sagar Borewells. All rights reserved.</p>
        </div>
    </footer>
    `;

    // Inject Content
    const headerMount = document.getElementById('navbar-mount');
    const footerMount = document.getElementById('footer-mount');

    if(headerMount) headerMount.innerHTML = headerHTML;
    if(footerMount) footerMount.innerHTML = footerHTML;
});
