// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 0. INTELLIGENCE INJECTION (Analytics & Assets) ---
    const head = document.getElementsByTagName('head')[0];

    // A. Inject Favicon 
    if (!document.querySelector("link[rel*='icon']")) {
        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = 'assets/img/favicon.png';
        head.appendChild(link);
    }

    // B. Google Analytics 4 (GA4) - LIVE
    const gaId = 'G-LRKE2HG1RN'; 
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaId);

    // C. Microsoft Clarity - LIVE
    const clarityId = 'vatt3qahek';
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityId);


    // --- 1. RENDER HEADER (Navigation) ---
    const headerMount = document.getElementById('navbar-mount');
    if (headerMount) {
        headerMount.innerHTML = `
        <nav class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-20">
                    
                    <div class="flex items-center">
                        <a href="index.html" class="flex items-center gap-2 group">
                            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition">S</div>
                            <div>
                                <span class="block text-xl font-extrabold text-slate-900 leading-none">SAGAR</span>
                                <span class="block text-xs font-bold text-blue-600 tracking-widest">BOREWELLS</span>
                            </div>
                        </a>
                    </div>

                    <div class="hidden md:flex items-center gap-8">
                        <a href="index.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Home</a>
                        
                        <a href="contact.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>

                        <a href="finance.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Finance</a>
                        
                        <a href="dashboard.html" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
                            <i class="ri-user-line"></i> Account
                        </a>

                        <a href="admin.html" id="admin-link" class="hidden font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                            <i class="ri-shield-user-line"></i> Admin
                        </a>

                        <a href="quote.html" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-200 flex items-center gap-2">
                            <i class="ri-calculator-line"></i> Get Quote
                        </a>
                    </div>

                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-btn" class="text-slate-600 text-2xl p-2 rounded hover:bg-slate-100">
                            <i class="ri-menu-line"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg left-0">
                <a href="index.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">Home</a>
                <a href="dashboard.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">My Account</a>
              //  <a href="finance.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">Finance & Loans</a>
                <a href="contact.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">Contact</a>
                <a href="admin.html" id="mobile-admin-link" class="hidden block py-3 font-bold text-red-600 border-b border-slate-50">Admin Panel</a>
                <a href="quote.html" class="block py-3 mt-4 text-center bg-blue-600 text-white font-bold rounded-lg shadow-md">Get Quote</a>
            </div>
        </nav>`;

        const btn = document.getElementById('mobile-menu-btn');
        if(btn) btn.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));
        
        checkAdminStatus();
    }

    // --- 2. RENDER FOOTER (Updated Links) ---
    const footerMount = document.getElementById('footer-mount');
    if (footerMount) {
        footerMount.innerHTML = `
        <footer class="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800 text-slate-400 font-sans mt-auto">
            <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div class="col-span-1 md:col-span-1">
                    <a href="index.html" class="text-xl font-extrabold text-white flex items-center gap-2 mb-4">
                        SAGAR <span class="text-blue-500">BOREWELLS</span>
                    </a>
                    <p class="text-xs leading-relaxed mb-6">
                        Advanced geological sensor drilling. Delivering precision water solutions since 2010.
                    </p>
                </div>
                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Quick Access</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="index.html" class="hover:text-blue-400 transition">Home</a></li>
                        <li><a href="quote.html" class="hover:text-blue-400 transition">Get Estimate</a></li>
                        //<li><a href="finance.html" class="hover:text-blue-400 transition">Finance / Loans</a></li> <li><a href="dashboard.html" class="hover:text-blue-400 transition">Client Login</a></li>
                        <li><a href="admin.html" class="hover:text-blue-400 transition">Admin</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Legal</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="terms.html" class="hover:text-blue-400 transition">Terms</a></li>
                        <li><a href="privacy.html" class="hover:text-blue-400 transition">Privacy</a></li>
                        <li><a href="refund.html" class="hover:text-blue-400 transition">Refunds</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Contact</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-center gap-3"><i class="ri-phone-line text-blue-500"></i> ${typeof CONTACT_INFO !== 'undefined' ? CONTACT_INFO.phone_display : '+91 96666 03888'}</li>
                        <li class="flex items-center gap-3"><i class="ri-mail-line text-blue-500"></i> ${typeof CONTACT_INFO !== 'undefined' ? CONTACT_INFO.email : 'sagarborewells@gmail.com'}</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-xs">
                <p>© ${new Date().getFullYear()} Sagar Borewells. All rights reserved.</p>
            </div>
        </footer>`;
    }
});

// --- HELPER: ADMIN CHECK ---
function checkAdminStatus() {
    if(typeof firebase === 'undefined' || !firebase.auth) return;
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            const db = firebase.firestore();
            db.collection('admins').doc(user.phoneNumber).get()
            .then(doc => {
                if (doc.exists) {
                    const deskLink = document.getElementById('admin-link');
                    const mobLink = document.getElementById('mobile-admin-link');
                    if(deskLink) deskLink.classList.remove('hidden');
                    if(mobLink) mobLink.classList.remove('hidden');
                }
            }).catch(e => console.log("User is not admin")); 
        }
    });
}

// --- 🛡️ SITE PROTECTION SUITE (CSS + JS) 🛡️ ---
(function() {
    // 1. 🎨 INJECT CSS PROTECTION (Prevents Highlighting & Dragging)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Disable Text Selection Globally */
        body {
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        /* Re-enable Selection for Inputs (Important for Forms!) */
        input, textarea {
            -webkit-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }

        /* Prevent Image Dragging (So they can't drag images to desktop) */
        img {
            -webkit-user-drag: none;
            user-drag: none;
            pointer-events: none; /* Also stops right-clicking images */
        }
    `;
    document.head.appendChild(style);


    // 2. 🚫 DISABLE RIGHT CLICK
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        // Optional: specific alert, or just fail silently
        // alert("🔒 Copyright © Sagar Borewells. All rights reserved."); 
    });


    // 3. ⌨️ DISABLE SHORTCUTS (F12, Ctrl+U, Inspect)
    document.onkeydown = function(e) {
        // F12
        if (event.keyCode == 123) return false;
        
        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
        
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    };

    // 4. 🧹 CLEAR CONSOLE (Hides any errors or logs)
    // setInterval(function(){ console.clear(); }, 2000); 
    // (Uncomment line 4 if you want to aggressively clear console)

})();
