// FILENAME: assets/js/layout.js

function renderNavbar() {
    const mount = document.getElementById('navbar-mount');
    if (!mount) return;

    const nav = document.createElement('nav');
    nav.className = "bg-white shadow-sm sticky top-0 z-50";
    nav.innerHTML = `
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-20">
                <div class="flex items-center">
                    <a href="index.html" class="flex items-center gap-2">
                        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">S</div>
                        <div>
                            <span class="block text-xl font-extrabold text-slate-900 leading-none">SAGAR</span>
                            <span class="block text-xs font-bold text-blue-600 tracking-widest">BOREWELLS</span>
                        </div>
                    </a>
                </div>

                <div class="hidden md:flex items-center gap-8">
                    <a href="index.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Home</a>
                    <a href="contact.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                    <a href="blog.html" class="font-bold text-slate-600 hover:text-blue-600 transition">News Room</a>
                    
                    <a href="admin.html" id="admin-link" class="hidden font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                        <i class="ri-shield-user-line"></i> Admin
                    </a>

                    <a href="dashboard.html" class="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
                        <i class="ri-user-line"></i> Account
                    </a>

                    <a href="quote.html" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-200">
                        Get Quote
                    </a>
                </div>

                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-slate-600 text-2xl">
                        <i class="ri-menu-line"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg">
            <a href="index.html" class="block py-3 font-bold text-slate-600">Home</a>
            <a href="blog.html" class="block py-3 font-bold text-slate-600">News Room</a>
            <a href="admin.html" id="mobile-admin-link" class="hidden block py-3 font-bold text-red-600">Admin Panel</a>
            <a href="dashboard.html" class="block py-3 font-bold text-slate-600">My Account</a>
            <a href="contact.html" class="block py-3 font-bold text-slate-600">Contact</a>
            <a href="quote.html" class="block py-3 mt-2 text-center bg-blue-600 text-white font-bold rounded-lg">Get Quote</a>
        </div>
    `;
    mount.appendChild(nav);

    // Event Listener for Mobile Menu
    const btn = document.getElementById('mobile-menu-btn');
    if(btn) btn.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));

    // Check Firebase Auth to show Admin Button
    checkAdminStatus();
}

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

function renderFooter() {
    const mount = document.getElementById('footer-mount');
    if (!mount) return;

    const footer = document.createElement('footer');
    footer.className = "bg-slate-900 text-white py-12 mt-auto";
    
    // 🟢 DYNAMICALLY INJECT CONFIG DATA HERE
    footer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
                <h4 class="text-lg font-bold text-white mb-4">Sagar Borewells</h4>
                <p class="text-slate-400">Advanced geological drilling solutions using sensor-based technology and zone-specific pricing.</p>
                <div class="flex gap-4 mt-4">
                    <a href="${CONTACT_INFO.social_youtube}" target="_blank" class="text-slate-400 hover:text-red-500 text-xl"><i class="ri-youtube-fill"></i></a>
                    <a href="${CONTACT_INFO.social_instagram}" target="_blank" class="text-slate-400 hover:text-pink-500 text-xl"><i class="ri-instagram-fill"></i></a>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-bold text-white mb-4">Quick Links</h4>
                <ul class="space-y-2 text-slate-400">
                    <li><a href="index.html" class="hover:text-blue-400">Home</a></li>
                    <li><a href="quote.html" class="hover:text-blue-400">Get Estimate</a></li>
                    <li><a href="blog.html" class="hover:text-blue-400">News Room</a></li>
                    <li><a href="dashboard.html" class="hover:text-blue-400">Client Login</a></li>
                </ul>
            </div>
            
            <div>
                <h4 class="text-lg font-bold text-white mb-4">Contact</h4>
                <p class="text-slate-400 leading-relaxed">
                    ${CONTACT_INFO.address_line1}<br>
                    ${CONTACT_INFO.address_line2}
                </p>
                <p class="text-slate-400 mt-4 font-mono font-bold text-emerald-400">
                    <i class="ri-whatsapp-line"></i> ${CONTACT_INFO.phone_display}
                </p>
                <p class="text-slate-500 text-xs mt-1">
                    <a href="mailto:${CONTACT_INFO.email}" class="hover:text-white">${CONTACT_INFO.email}</a>
                </p>
            </div>
        </div>
        
        <div class="text-center text-slate-600 text-xs mt-12 pt-8 border-t border-slate-800">
            &copy; ${new Date().getFullYear()} Sagar Borewells. All rights reserved.
        </div>
    `;
    mount.appendChild(footer);
}

// Init Layout
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar();
    renderFooter();
});
