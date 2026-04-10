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
        link.href = 'assets/img/favicon.png';
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
                        <a href="f/blog" class="font-bold text-slate-600 hover:text-blue-600 transition">Blog</a>
                        <a href="contact" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                        <a href="about" class="font-bold text-slate-600 hover:text-blue-600 transition">About</a>
                        <a href="dashboard" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
                            <i class="ri-user-line"></i> Account
                        </a>
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
                    <a href="index" class="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
                        SAGAR <span class="text-blue-500">BOREWELLS</span>
                    </a>
                    <p class="text-xs leading-relaxed mb-6">
                        Advanced geological sensor drilling. Delivering precision water solutions since 2010.
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
                        <li><a href="index" class="hover:text-blue-400 transition">Home</a></li>
                        <li><a href="quote" class="hover:text-blue-400 transition">Get Estimate</a></li>
                        <li><a href="dashboard" class="hover:text-blue-400 transition">Account Login</a></li>
                        <li><a href="f/blog" class="hover:text-blue-400 transition">Blog</a></li>
                        <li><a href="f/science" class="hover:text-blue-400 transition">Science Portal</a></li>
                        <li><a href="f/motors" class="hover:text-blue-400 transition">Motor Recommendations</a></li>
                        <li><a href="f/finance" class="hover:text-blue-400 transition">Financial Assist</a></li>
                        <li><a href="about" class="hover:text-blue-400 transition">About Us</a></li>
                        <li><a href="contact" class="hover:text-blue-400 transition">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="policy/terms" class="hover:text-blue-400 transition">Terms of Service</a></li>
                        <li><a href="policy/privacy" class="hover:text-blue-400 transition">Privacy Policy</a></li>
                        <li><a href="policy/refund" class="hover:text-blue-400 transition">Refund Policy</a></li>
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
            '/':              { t: 'Sagar Borewells — Precision Drilling & Zone-Based Pricing | Mangalagiri', d: 'Andhra Pradesh\'s most trusted borewell drilling company. GPS-powered estimates, geological zone analysis, and instant PDF quotes. 7500+ projects completed since 2010.' },
            '/index.html':    { t: 'Sagar Borewells — Precision Drilling & Zone-Based Pricing | Mangalagiri', d: 'Andhra Pradesh\'s most trusted borewell drilling company. GPS-powered estimates, geological zone analysis, and instant PDF quotes. 7500+ projects completed since 2010.' },
            '/quote.html':    { t: 'Instant Borewell Quotation — Sagar Borewells', d: 'Get an instant drilling cost estimate for your borewell. GPS location, depth slider, tiered pricing, and downloadable PDF quote.' },
            '/quote':         { t: 'Instant Borewell Quotation — Sagar Borewells', d: 'Get an instant drilling cost estimate for your borewell. GPS location, depth slider, tiered pricing, and downloadable PDF quote.' },
            '/login.html':    { t: 'Client Login — Sagar Borewells', d: 'Access your borewell project dashboard, track rig status, download BWBC certificates and estimates.' },
            '/login':         { t: 'Client Login — Sagar Borewells', d: 'Access your borewell project dashboard, track rig status, download BWBC certificates and estimates.' },
            '/dashboard.html':{ t: 'Mission Control Dashboard — Sagar Borewells', d: 'Track your active borewell project in real-time. View estimates, download certificates, and manage your drilling history.' },
            '/dashboard':     { t: 'Mission Control Dashboard — Sagar Borewells', d: 'Track your active borewell project in real-time. View estimates, download certificates, and manage your drilling history.' },
            '/about.html':    { t: 'About Us — 41+ Years of Drilling Excellence | Sagar Borewells', d: 'Learn about Sagar Borewells — trusted by L&T Construction, Amaravati Developers. 7500+ borewells, 96% success rate.' },
            '/about':         { t: 'About Us — 41+ Years of Drilling Excellence | Sagar Borewells', d: 'Learn about Sagar Borewells — trusted by L&T Construction, Amaravati Developers. 7500+ borewells, 96% success rate.' },
            '/contact.html':  { t: 'Contact Sagar Borewells — Phone, WhatsApp, Office', d: 'Reach Sagar Borewells in Mangalagiri, AP. Call +91 63040-94177, WhatsApp us, or visit our office on Gowtham Buddha Road.' },
            '/contact':       { t: 'Contact Sagar Borewells — Phone, WhatsApp, Office', d: 'Reach Sagar Borewells in Mangalagiri, AP. Call +91 63040-94177, WhatsApp us, or visit our office on Gowtham Buddha Road.' },
            '/admin.html':    { t: 'SBW Admin Console', d: '' },
            '/f/blog.html':   { t: 'News Room — Borewell Tips & Updates | Sagar Borewells', d: 'Latest news, borewell drilling tips, groundwater updates, and success stories from Sagar Borewells.' },
            '/f/blog':        { t: 'News Room — Borewell Tips & Updates | Sagar Borewells', d: 'Latest news, borewell drilling tips, groundwater updates, and success stories from Sagar Borewells.' },
            '/f/science.html':{ t: 'Science Lab — Groundwater Intelligence | Sagar Borewells', d: 'Interactive groundwater zone map, TDS water quality checker, pump recommendation engine, and geological risk analysis.' },
            '/f/science':     { t: 'Science Lab — Groundwater Intelligence | Sagar Borewells', d: 'Interactive groundwater zone map, TDS water quality checker, pump recommendation engine, and geological risk analysis.' },
            '/f/motors.html': { t: 'AI Motor Architect — Pump Recommendation | Sagar Borewells', d: 'AI-powered borewell pump recommendation using live inventory from SagarTraders. Find the exact motor you need.' },
            '/f/motors':      { t: 'AI Motor Architect — Pump Recommendation | Sagar Borewells', d: 'AI-powered borewell pump recommendation using live inventory from SagarTraders. Find the exact motor you need.' },
            '/f/pump-advisor.html': { t: 'Smart Pump Advisor — GPS Elevation TDH Calculator | Sagar Borewells', d: 'Calculate Total Dynamic Head using GPS elevation, topo data, and friction loss. AI-ranked pump recommendations from SagarTraders inventory.' },
            '/f/pump-advisor':{ t: 'Smart Pump Advisor — GPS Elevation TDH Calculator | Sagar Borewells', d: 'Calculate Total Dynamic Head using GPS elevation, topo data, and friction loss. AI-ranked pump recommendations from SagarTraders inventory.' },
            '/f/finance.html':{ t: 'Financial Assistance — YSR Jala Kala & EMI Calculator | Sagar Borewells', d: 'Check YSR Jala Kala scheme eligibility, calculate borewell loan EMI, and get financial assistance for your borewell project.' },
            '/f/finance':     { t: 'Financial Assistance — YSR Jala Kala & EMI Calculator | Sagar Borewells', d: 'Check YSR Jala Kala scheme eligibility, calculate borewell loan EMI, and get financial assistance for your borewell project.' },
            '/f/locate.html': { t: 'Site Locator — Pin Your Borewell Location | Sagar Borewells', d: 'Drag the map to pinpoint your exact borewell site location. GPS coordinates captured for precise quotation.' },
            '/f/s.html':      { t: 'Engineering Lab — Yield, Conversion & Gravel Calculators | Sagar Borewells', d: 'Borewell engineering calculators: yield (GPH), field unit converter, and gravel pack volume estimator.' },
            '/f/s1.html':     { t: 'Science Lab v2 — Field Tools | Sagar Borewells', d: 'Quick engineering tools: unit converter, TDS analyzer, cable sizer, and tank fill timer.' },
        };

        const currentPage = pageMap[path] || { t: 'Sagar Borewells — Precision Drilling Company | Mangalagiri, AP', d: 'Expert borewell drilling services in Andhra Pradesh. GPS estimates, groundwater science, AI pump recommendations, and digital certificates. Since 2010.' };

        // --- 1. Dynamic Title ---
        if (currentPage.t) document.title = currentPage.t;

        // --- 2. Meta Description ---
        if (currentPage.d && !document.querySelector('meta[name="description"]')) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = currentPage.d;
            document.head.appendChild(meta);
        }

        // --- 3. OpenGraph Tags (Facebook / WhatsApp / iMessage sharing) ---
        const ogTags = [
            { property: 'og:title', content: currentPage.t || 'Sagar Borewells' },
            { property: 'og:description', content: currentPage.d || 'Precision borewell drilling with GPS-powered estimates and AI pump recommendations.' },
            { property: 'og:image', content: 'https://sagarborewells.com/assets/img/og-share-image.png' },
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

        // --- 4. Twitter Card Tags ---
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: currentPage.t || 'Sagar Borewells' },
            { name: 'twitter:description', content: currentPage.d || 'Precision borewell drilling in Andhra Pradesh.' },
            { name: 'twitter:image', content: 'https://sagarborewells.com/assets/img/og-share-image.png' }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });

        // --- 5. Canonical URL ---
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('?')[0];
            document.head.appendChild(canonical);
        }

        // --- 6. LocalBusiness JSON-LD Schema (Google Search / Maps) ---
        if (!document.querySelector('script[type="application/ld+json"]')) {
            const schema = document.createElement('script');
            schema.type = 'application/ld+json';
            schema.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Sagar Borewells",
                "image": "https://sagarborewells.com/assets/img/og-share-image.png",
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
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                    "opens": "06:00",
                    "closes": "21:00"
                },
                "priceRange": "₹₹",
                "description": "Expert borewell drilling services with GPS-powered estimates, groundwater zone analysis, AI pump recommendations, and digital borewell commissioning certificates. Serving Andhra Pradesh since 2010.",
                "areaServed": {
                    "@type": "State",
                    "name": "Andhra Pradesh"
                },
                "founder": {
                    "@type": "Person",
                    "name": "Sagar Borewells"
                },
                "sameAs": [
                    "https://www.instagram.com/sagar_bore_wells/",
                    "https://www.youtube.com/@Sagar_Bore_Wells"
                ]
            });
            document.head.appendChild(schema);
        }
    })();
});
