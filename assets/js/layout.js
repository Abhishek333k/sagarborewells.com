// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. HEAD INJECTION (Self-Healing) ---
    const head = document.head;

    // Helper for Asset Injection
    const injectAsset = (tag, attribs) => {
        // Prevent duplicate injection by checking specific attribute
        const checkAttr = attribs.href || attribs.src;
        const lookup = attribs.href ? `href*='${checkAttr}'` : `src*='${checkAttr}'`;
        
        if (!document.querySelector(`${tag}[${lookup}]`)) {
            const el = document.createElement(tag);
            Object.keys(attribs).forEach(key => el.setAttribute(key, attribs[key]));
            if(tag === 'script') el.async = true;
            head.appendChild(el);
        }
    };

    injectAsset('link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css' });
    injectAsset('link', { rel: 'shortcut icon', type: 'image/png', href: 'assets/img/favicon.png' });
    
    // Analytics
    const gaId = 'G-LRKE2HG1RN';
    injectAsset('script', { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}` });
    
    // Inline GA Config (Needs separate execution)
    if (typeof window.dataLayer === 'undefined') {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
    }

    // --- 2. DYNAMIC NAVBAR (Event Delegation Fix) ---
    const headerMount = document.getElementById('navbar-mount');
    
    if (headerMount) {
        headerMount.innerHTML = `
        <nav class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-20">
                    <div class="flex items-center">
                        <a href="index" class="flex items-center gap-2 group">
                            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition">S</div>
                            <div>
                                <span class="block text-xl font-extrabold text-slate-900 leading-none">SAGAR</span>
                                <span class="block text-xs font-bold text-blue-600 tracking-widest">BOREWELLS</span>
                            </div>
                        </a>
                    </div>

                    <div class="hidden md:flex items-center gap-8">
                        <a href="index" class="font-bold text-slate-600 hover:text-blue-600 transition">Home</a>
                        <a href="blog" class="font-bold text-slate-600 hover:text-blue-600 transition">Blog</a>
                        <a href="contact" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                        <a href="dashboard" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-2"><i class="ri-user-line"></i> Account</a>
                        <a href="quote" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-200 flex items-center gap-2">
                            <i class="ri-calculator-line"></i> Get Quote
                        </a>
                    </div>

                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-btn" class="text-slate-600 text-2xl p-2 rounded hover:bg-slate-100 transition">
                            <i class="ri-menu-line"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg left-0 top-20 z-40">
                <a href="index" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">Home</a>
                <a href="dashboard" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">My Account</a>
                <a href="contact" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">Contact</a>
                <a href="quote" class="block py-3 mt-4 text-center bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">Get Quote</a>
            </div>
        </nav>`;

        // 🟢 FIX: Use Event Delegation on the Mount Point
        // This avoids the setTimeout race condition completely.
        headerMount.addEventListener('click', (e) => {
            const btn = e.target.closest('#mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            
            if (btn && menu) {
                e.stopPropagation();
                menu.classList.toggle('hidden');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = menu.classList.contains('hidden') ? 'ri-menu-line' : 'ri-close-line';
                }
            } else if (menu && !menu.classList.contains('hidden') && !e.target.closest('#mobile-menu')) {
                // Close when clicking outside (on nav bar but not menu)
                menu.classList.add('hidden');
                const icon = document.querySelector('#mobile-menu-btn i');
                if(icon) icon.className = 'ri-menu-line';
            }
        });
    }

    // --- 3. DYNAMIC FOOTER ---
    const footerMount = document.getElementById('footer-mount');
    // Ensure CONTACT_INFO exists before trying to destructure
    if (footerMount && typeof window.CONTACT_INFO !== 'undefined') {
        const { whatsapp_api, social, address_line1, address_line2, phone_display, email } = window.CONTACT_INFO;
        const waLink = whatsapp_api ? `https://wa.me/${whatsapp_api}` : "#";
        const igLink = social?.instagram || "#";
        const ytLink = social?.youtube || "#";

        footerMount.innerHTML = `
        <footer class="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800 text-slate-400 font-sans mt-auto">
            <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div class="col-span-1 md:col-span-1">
                    <a href="index" class="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
                        SAGAR <span class="text-blue-500">BOREWELLS</span>
                    </a>
                    <p class="text-xs leading-relaxed mb-6">Advanced geological sensor drilling.</p>
                    <div class="flex gap-4">
                        <a href="${waLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition"><i class="ri-whatsapp-line"></i></a>
                        <a href="${igLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"><i class="ri-instagram-line"></i></a>
                        <a href="${ytLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition"><i class="ri-youtube-fill"></i></a>
                    </div>
                </div>
                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Contact Us</h4>
                    <ul class="space-y-4 text-sm">
                        <li class="flex items-start gap-3">
                            <i class="ri-map-pin-line text-blue-500 mt-1"></i>
                            <span class="leading-tight">${address_line1},<br>${address_line2}</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="ri-phone-line text-blue-500"></i> 
                            <a href="tel:${phone_display}" class="hover:text-white">${phone_display}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-xs">
                <p>© ${new Date().getFullYear()} Sagar Borewells. All rights reserved.</p>
            </div>
        </footer>`;
    }
});
