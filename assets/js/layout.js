// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. HEAD INJECTION (Self-Healing Assets) ---
    const head = document.head;

    // 🟢 FIX: Auto-Inject RemixIcon if missing (Fixes invisible Mobile Menu & Social Icons)
    if (!document.querySelector("link[href*='remixicon']")) {
        const ri = document.createElement('link');
        ri.rel = 'stylesheet';
        ri.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
        head.appendChild(ri);
    }

    // Auto-Inject Favicon
    if (!document.querySelector("link[rel*='icon']")) {
        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = '/assets/img/favicon.png'; // ROOT-RELATIVE
        head.appendChild(link);
    }

    // Google Analytics 4 (Standard)
    const gaId = 'G-LRKE2HG1RN'; 
    if (!document.querySelector(`script[src*='${gaId}']`)) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
    }

    // Microsoft Clarity (Heatmaps)
    if (!window.clarity) {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "vatt3qahek");
    }


    // --- 2. DYNAMIC NAVBAR ---
    const headerMount = document.getElementById('navbar-mount');
    if (headerMount) {
        headerMount.innerHTML = `
        <nav class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-20">
                    
                    <div class="flex items-center">
                        <a href="/index.html" class="flex items-center gap-2 group">
                            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition">S</div>
                            <div>
                                <span class="block text-xl font-extrabold text-slate-900 leading-none">SAGAR</span>
                                <span class="block text-xs font-bold text-blue-600 tracking-widest">BOREWELLS</span>
                            </div>
                        </a>
                    </div>

                    <div class="hidden md:flex items-center gap-8">
                        <a href="/index.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Home</a>
                        <a href="/f/blog.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Blog</a>
                        <a href="/contact.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                        <a href="/about.html" class="font-bold text-slate-600 hover:text-blue-600 transition">About</a>
                        <a href="/f/pump-advisor.html" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1">
                            Pump Advisor <span class="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">AI</span>
                        </a>
                        <a href="/dashboard.html" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
                            <i class="ri-user-line"></i> Account
                        </a>
                        <a href="/quote.html" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-200 flex items-center gap-2">
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
                <a href="/index.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">Home</a>
                <a href="/dashboard.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">My Account</a>
                <a href="/contact.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600">Contact</a>
                <a href="/f/pump-advisor.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50 hover:text-blue-600 flex items-center justify-between">
                    Pump Advisor <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">AI</span>
                </a>
                <a href="/quote.html" class="block py-3 mt-4 text-center bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700">Get Quote</a>
            </div>
        </nav>`;

        // Re-attach listener because we just overwrote the HTML
        setTimeout(() => {
            const btn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            if(btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('hidden');
                    // Toggle Icon
                    const icon = btn.querySelector('i');
                    if(menu.classList.contains('hidden')) {
                        icon.className = 'ri-menu-line';
                    } else {
                        icon.className = 'ri-close-line';
                    }
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!menu.contains(e.target) && !btn.contains(e.target)) {
                        menu.classList.add('hidden');
                        btn.querySelector('i').className = 'ri-menu-line';
                    }
                });
            }
        }, 100);
    }

    // --- 3. DYNAMIC FOOTER ---
    const footerMount = document.getElementById('footer-mount');
    if (footerMount && typeof CONTACT_INFO !== 'undefined') {
        const { whatsapp_api, social, address_line1, address_line2, phone_display, email } = CONTACT_INFO;
        
        // Safety check for social links
        const igLink = social && social.instagram ? social.instagram : "#";
        const ytLink = social && social.youtube ? social.youtube : "#";
        const waLink = whatsapp_api ? `https://wa.me/${whatsapp_api}` : "#";

        footerMount.innerHTML = `
        <footer class="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800 text-slate-400 font-sans mt-auto">
            <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                
                <div class="col-span-1 md:col-span-1">
                    <a href="/index.html" class="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
                        SAGAR <span class="text-blue-500">BOREWELLS</span>
                    </a>
                    <p class="text-xs leading-relaxed mb-6">
                        Advanced geological sensor drilling. Delivering precision water solutions since 1985.
                    </p>
                    <div class="flex gap-4">
                        <a href="${waLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition"><i class="ri-whatsapp-line"></i></a>
                        <a href="${igLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"><i class="ri-instagram-line"></i></a>
                        <a href="${ytLink}" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition"><i class="ri-youtube-fill"></i></a>
                    </div>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Quick Access</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/index.html" class="hover:text-blue-400 transition">Home</a></li>
                        <li><a href="/quote.html" class="hover:text-blue-400 transition">Get Estimate</a></li>
                        <li><a href="/dashboard.html" class="hover:text-blue-400 transition">Account Login</a></li>
                        <li><a href="/f/blog.html" class="hover:text-blue-400 transition">Blog</a></li>
                        <li><a href="/f/s.html" class="hover:text-blue-400 transition">Engineering Hub</a></li>
                        <li><a href="/f/pump-advisor.html" class="hover:text-blue-400 transition flex items-center gap-2">
                            Pump Advisor <span class="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">AI</span>
                        </a></li>
                        <li><a href="/f/finance.html" class="hover:text-blue-400 transition">Financial Assist</a></li>
                        <li><a href="/about.html" class="hover:text-blue-400 transition">About Us</a></li>
                        <li><a href="/contact.html" class="hover:text-blue-400 transition">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/policy/terms.html" class="hover:text-blue-400 transition">Terms of Service</a></li>
                        <li><a href="/policy/privacy.html" class="hover:text-blue-400 transition">Privacy Policy</a></li>
                        <li><a href="/policy/refund.html" class="hover:text-blue-400 transition">Refund Policy</a></li>
                    </ul>
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
                        <li class="flex items-center gap-3">
                            <i class="ri-mail-line text-blue-500"></i> 
                            <a href="mailto:${email}" class="hover:text-white">${email}</a>
                        </li>
                    </ul>
                </div>

            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-xs">
                <p>© ${new Date().getFullYear()} Sagar Borewells. All rights reserved.</p>
            </div>
        </footer>`;
    }

    // ================================================================
    // 🟢 UNIVERSAL SEO INJECTION (Auto-applied to every page)
    // Dynamically sets <title>, meta descriptions, OpenGraph,
    // Twitter Cards, and LocalBusiness JSON-LD schema.
    // ================================================================
    (function injectSEO() {
        // --- Page-specific titles & descriptions ---
        const path = window.location.pathname;
        const pageMap = {
            '/':              { t: 'Sagar Borewells — Precision Drilling & Zone-Based Pricing | Mangalagiri', d: 'Andhra Pradesh\'s most trusted borewell drilling company. GPS-powered estimates, geological zone analysis, and instant PDF quotes. 7500+ projects completed since 1985.', k: 'borewell drilling, water drilling AP, Mangalagiri borewells, groundwater analysis, borewell cost calculator' },
            '/index.html':    { t: 'Sagar Borewells — Precision Drilling & Zone-Based Pricing | Mangalagiri', d: 'Andhra Pradesh\'s most trusted borewell drilling company. GPS-powered estimates, geological zone analysis, and instant PDF quotes. 7500+ projects completed since 1985.', k: 'borewell drilling, water drilling AP, Mangalagiri borewells, groundwater analysis, borewell cost calculator' },
            '/quote.html':    { t: 'Instant Borewell Quotation — Sagar Borewells', d: 'Get an instant drilling cost estimate for your borewell. GPS location, depth slider, tiered pricing, and downloadable PDF quote.', k: 'borewell price, drilling cost calculator, water well estimate, Sagar Borewells quote' },
            '/quote':         { t: 'Instant Borewell Quotation — Sagar Borewells', d: 'Get an instant drilling cost estimate for your borewell. GPS location, depth slider, tiered pricing, and downloadable PDF quote.', k: 'borewell price, drilling cost calculator, water well estimate, Sagar Borewells quote' },
            '/login.html':    { t: 'Client Login — Sagar Borewells', d: 'Access your borewell project dashboard, track rig status, download BWBC certificates and estimates.', k: 'client login, borewell dashboard, project tracking' },
            '/login':         { t: 'Client Login — Sagar Borewells', d: 'Access your borewell project dashboard, track rig status, download BWBC certificates and estimates.', k: 'client login, borewell dashboard, project tracking' },
            '/dashboard.html':{ t: 'Mission Control Dashboard — Sagar Borewells', d: 'Track your active borewell project in real-time. View estimates, download certificates, and manage your drilling history.', k: 'borewell tracking, project management, drilling dashboard' },
            '/dashboard':     { t: 'Mission Control Dashboard — Sagar Borewells', d: 'Track your active borewell project in real-time. View estimates, download certificates, and manage your drilling history.', k: 'borewell tracking, project management, drilling dashboard' },
            '/about.html':    { t: 'About Us — 41+ Years of Drilling Excellence | Sagar Borewells', d: 'Learn about Sagar Borewells — trusted by L&T Construction, Amaravati Developers. 7500+ borewells, 96% success rate.', k: 'about sagar borewells, history of drilling, expert borewell drillers Mangalagiri' },
            '/about':         { t: 'About Us — 41+ Years of Drilling Excellence | Sagar Borewells', d: 'Learn about Sagar Borewells — trusted by L&T Construction, Amaravati Developers. 7500+ borewells, 96% success rate.', k: 'about sagar borewells, history of drilling, expert borewell drillers Mangalagiri' },
            '/contact.html':  { t: 'Contact Sagar Borewells — Phone, WhatsApp, Office', d: 'Reach Sagar Borewells in Mangalagiri, AP. Call +91 63040-94177, WhatsApp us, or visit our office on Gowtham Buddha Road.', k: 'contact borewell company, mangalagiri borewells phone, sagar borewells whatsapp' },
            '/contact':       { t: 'Contact Sagar Borewells — Phone, WhatsApp, Office', d: 'Reach Sagar Borewells in Mangalagiri, AP. Call +91 63040-94177, WhatsApp us, or visit our office on Gowtham Buddha Road.', k: 'contact borewell company, mangalagiri borewells phone, sagar borewells whatsapp' },
            '/f/blog.html':   { t: 'News Room — Borewell Tips & Updates | Sagar Borewells', d: 'Latest news, borewell drilling tips, groundwater updates, and success stories from Sagar Borewells.', k: 'borewell tips, groundwater news, water well maintenance, drilling updates' },
            '/f/blog':        { t: 'News Room — Borewell Tips & Updates | Sagar Borewells', d: 'Latest news, borewell drilling tips, groundwater updates, and success stories from Sagar Borewells.', k: 'borewell tips, groundwater news, water well maintenance, drilling updates' },
            '/f/s.html':      { t: 'Engineering Hub — Pro Hydraulic Calculators | Sagar Borewells', d: 'Professional borewell engineering calculators: Yield, Gravel Volume, Cable Sizing, and Tank Fill Estimator.', k: 'borewell engineering, cable sizer, gravel calculator, hydraulic tools' },
            '/f/s':           { t: 'Engineering Hub — Pro Hydraulic Calculators | Sagar Borewells', d: 'Professional borewell engineering calculators: Yield, Gravel Volume, Cable Sizing, and Tank Fill Estimator.', k: 'borewell engineering, cable sizer, gravel calculator, hydraulic tools' },
            '/f/pump-advisor.html': { t: 'Smart Pump Advisor — AI Recommendation | Sagar Borewells', d: 'Calculate Total Dynamic Head (TDH) and get AI-powered pump recommendations using GPS data and live inventory.', k: 'pump calculator, TDH calculation, AI pump recommendation, water pump selection' },
            '/f/pump-advisor':{ t: 'Smart Pump Advisor — AI Recommendation | Sagar Borewells', d: 'Calculate Total Dynamic Head (TDH) and get AI-powered pump recommendations using GPS data and live inventory.', k: 'pump calculator, TDH calculation, AI pump recommendation, water pump selection' },
        };

        const currentPage = pageMap[path] || { t: 'Sagar Borewells — Precision Drilling Company | Mangalagiri, AP', d: 'Expert borewell drilling services in Andhra Pradesh. GPS estimates, groundwater science, AI pump recommendations, and digital certificates. Since 1985.', k: 'borewell drilling, water well, mangalagiri, andhra pradesh, drilling services' };

        // --- 1. Basic Meta Tags ---
        if (currentPage.t) document.title = currentPage.t;

        const metaTags = [
            { name: 'description', content: currentPage.d },
            { name: 'keywords', content: currentPage.k },
            { name: 'author', content: 'Sagar Borewells' },
            { name: 'robots', content: 'index, follow' },
            { name: 'theme-color', content: '#2563eb' }
        ];

        metaTags.forEach(tag => {
            if (tag.content && !document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });

        // --- 2. OpenGraph Tags (Facebook / WhatsApp / iMessage) ---
        const ogTags = [
            { property: 'og:title', content: currentPage.t },
            { property: 'og:description', content: currentPage.d },
            { property: 'og:image', content: 'https://sagarborewells.com/assets/img/favicon.png' }, // Fallback to favicon if OG image missing
            { property: 'og:url', content: window.location.href },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Sagar Borewells' },
            { property: 'og:locale', content: 'en_IN' }
        ];

        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });

        // --- 3. Twitter Card Tags ---
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: currentPage.t },
            { name: 'twitter:description', content: currentPage.d },
            { name: 'twitter:image', content: 'https://sagarborewells.com/assets/img/favicon.png' }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });

        // --- 4. Canonical URL ---
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('?')[0];
            document.head.appendChild(canonical);
        }

        // --- 5. JSON-LD Schema ---
        if (!document.querySelector('script[type="application/ld+json"]')) {
            const schema = document.createElement('script');
            schema.type = 'application/ld+json';
            schema.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Sagar Borewells",
                "image": "https://sagarborewells.com/assets/img/favicon.png",
                "url": "https://sagarborewells.com",
                "telephone": "+916304094177",
                "email": "support@sagarborewells.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Gowtham Buddha Rd, beside UCO Bank",
                    "addressLocality": "Mangalagiri",
                    "addressRegion": "Andhra Pradesh",
                    "postalCode": "522503",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 16.4410,
                    "longitude": 80.5658
                }
            });
            document.head.appendChild(schema);
        }
    })();
});
