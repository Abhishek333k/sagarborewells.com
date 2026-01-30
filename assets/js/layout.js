// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. DYNAMIC HEADER (NAVIGATION)
    const headerHTML = `
    <nav class="bg-[#0f172a] border-b border-slate-800 p-4 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <a href="index.html" class="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <i class="fa-solid fa-droplet text-blue-500"></i> SAGAR <span class="text-blue-500">BOREWELLS</span>
            </a>
            <div class="flex gap-4 items-center">
                <a href="tel:+${CONTACT_INFO.whatsapp_api}" class="bg-white text-blue-900 px-4 py-2 rounded-full text-xs md:text-sm font-bold shadow-lg hover:bg-blue-50 transition flex items-center gap-2">
                    <i class="fa-solid fa-phone"></i> <span class="hidden md:inline">Call Expert</span>
                </a>
            </div>
        </div>
    </nav>
    `;

    // 2. DYNAMIC FOOTER (Professional & Consolidated)
    const footerHTML = `
    <footer class="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800 text-slate-400 font-sans mt-auto">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            <div>
                <a href="index.html" class="text-lg font-extrabold text-white flex items-center gap-2 mb-4">
                    SAGAR <span class="text-blue-500">OPS</span>
                </a>
                <p class="text-xs leading-relaxed mb-4">
                    Advanced geological sensor drilling. Delivering water solutions with transparency and precision.
                </p>
                <div class="flex gap-4">
                    <a href="https://wa.me/${CONTACT_INFO.whatsapp_api}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition"><i class="fa-brands fa-whatsapp"></i></a>
                </div>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Company</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="index.html" class="hover:text-blue-400 transition">Home</a></li>
                    <li><a href="quote.html" class="hover:text-blue-400 transition">Get Estimate</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Legal & Policies</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="terms.html" class="hover:text-blue-400 transition">Terms & Conditions</a> <span class="text-[10px] text-slate-600">(Inc. Guidelines)</span></li>
                    <li><a href="privacy.html" class="hover:text-blue-400 transition">Privacy Policy</a></li>
                    <li><a href="refund.html" class="hover:text-blue-400 transition">Refund Policy</a></li>
                </ul>
            </div>
        </div>

        <div class="border-t border-slate-800 pt-8 text-center text-xs">
            <p>&copy; 2026 Sagar Borewells. All rights reserved.</p>
        </div>
    </footer>
    `;

    // Inject Content
    const headerPlaceholder = document.getElementById('navbar-mount');
    const footerPlaceholder = document.getElementById('footer-mount');

    if(headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if(footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
});
