// FILENAME: assets/js/layout.js

function renderNavbar() {
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
                    <a href="locate.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Find Us</a>
                    <a href="contact.html" class="font-bold text-slate-600 hover:text-blue-600 transition">Contact</a>
                    
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
            <a href="dashboard.html" class="block py-3 font-bold text-slate-600">My Account</a>
            <a href="quote.html" class="block py-3 mt-2 text-center bg-blue-600 text-white font-bold rounded-lg">Get Quote</a>
        </div>
    `;
    document.getElementById('navbar-mount').appendChild(nav);

    // Toggle Mobile Menu
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
}

function renderFooter() {
    // (Keep your existing footer code here, or I can provide it if needed)
    // For brevity, just ensuring navbar is the focus.
    const footer = document.createElement('footer');
    footer.className = "bg-slate-900 text-white py-12 mt-auto";
    footer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p class="text-slate-500 text-sm">© ${new Date().getFullYear()} Sagar Borewells. All rights reserved.</p>
        </div>
    `;
    document.getElementById('footer-mount').appendChild(footer);
}

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar();
    renderFooter();
});
