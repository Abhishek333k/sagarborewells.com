// FILENAME: assets/js/layout.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 0. GLOBAL ASSETS INJECTION (Favicon & Meta) ---
    const head = document.getElementsByTagName('head')[0];
    
    // Inject Favicon if missing
    if (!document.querySelector("link[rel*='icon']")) {
        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = 'assets/img/favicon.png'; // Make sure this file exists!
        head.appendChild(link);
    }

    // --- 1. RENDER HEADER ---
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
                        <a href="science.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Science Lab</a>
                        <a href="contact.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                        
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
                <a href="science.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">Science Lab</a>
                <a href="admin.html" id="mobile-admin-link" class="hidden block py-3 font-bold text-red-600 border-b border-slate-50">Admin Panel</a>
                <a href="contact.html" class="block py-3 font-bold text-slate-600 border-b border-slate-50">Contact</a>
                <a href="quote.html" class="block py-3 mt-4 text-center bg-blue-600 text-white font-bold rounded-lg shadow-md">Get Quote</a>
            </div>
        </nav>`;

        const btn = document.getElementById('mobile-menu-btn');
        if(btn) btn.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));
        
        checkAdminStatus();
    }

    // --- 2. RENDER FOOTER ---
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
                        <li><a href="science.html" class="hover:text-blue-400 transition">Science Lab</a></li>
                        <li><a href="admin.html" class="hover:text-blue-400 transition">Login</a></li>
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
                        <li class="flex items-center gap-3"><i class="ri-phone-line text-blue-500"></i> ${CONTACT_INFO.phone_display}</li>
                        <li class="flex items-center gap-3"><i class="ri-mail-line text-blue-500"></i> ${CONTACT_INFO.email}</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-xs">
                <p>© ${new Date().getFullYear()} Sagar Borewells. All rights reserved.</p>
            </div>
        </footer>`;
    }
});

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
