// assets/js/components.js
function loadHeader() {
    const headerHTML = `
    <nav class="bg-[#0f172a] border-b border-slate-800 p-4 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="index.html" class="text-xl font-bold text-white tracking-tight">SAGAR <span class="text-blue-500">OPS</span></a>
            <div class="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                <a href="locate.html" class="hover:text-blue-400 transition">Site Locator</a>
                <a href="quote.html" class="hover:text-blue-400 transition">Price Calculator</a>
                <a href="terms.html" class="hover:text-blue-400 transition">Legal</a>
            </div>
            <a href="tel:+916304094177" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                <i class="fa-solid fa-phone"></i> Call Ops
            </a>
        </div>
    </nav>`;
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
}
document.addEventListener("DOMContentLoaded", loadHeader);
