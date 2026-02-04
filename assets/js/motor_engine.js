// FILENAME: assets/js/motor_engine.js

// 🟢 CONFIG
const SHOPIFY_DOMAIN = "sagartraders.in"; 

// 🟢 STATE
let userSelection = { source: '', depth: 0, dia: 6, phase: 1 };

// 🟢 WIZARD UI LOGIC
function selectSource(source) {
    userSelection.source = source;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('progressBar').style.width = "66%";
    document.getElementById('borewellOptions').style.display = (source === 'borewell') ? 'block' : 'none';
}

function prevStep() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('progressBar').style.width = "33%";
}

// 🟢 THE HYBRID ENGINE (Shopify First -> Google Sheet Backup)
async function runEngine() {
    // 1. Gather Inputs
    userSelection.depth = parseInt(document.getElementById('inputDepth').value);
    userSelection.phase = parseInt(document.getElementById('inputPhase').value);
    if (userSelection.source === 'borewell') {
        const dias = document.getElementsByName('dia');
        for(let d of dias) if(d.checked) userSelection.dia = parseInt(d.value);
    }

    if (!userSelection.depth) return alert("Please enter total head/depth");

    // 2. UI Loading State
    const btn = document.getElementById('findBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Scanning Inventory...`;
    btn.disabled = true;

    const requiredHead = userSelection.depth * 1.25; // Physics Buffer

    try {
        const container = document.getElementById('resultsContainer');
        const debug = document.getElementById('calcDebug');
        container.innerHTML = "";
        
        // --- ATTEMPT 1: SHOPIFY (Live Stock) ---
        debug.innerText = "Checking Live Inventory...";
        const shopifyRaw = await fetchShopifyProducts();
        let matches = filterShopify(shopifyRaw, requiredHead);
        let source = "shopify";

        // --- ATTEMPT 2: GOOGLE SHEET (Master List) ---
        if (matches.length === 0) {
            debug.innerText = "Checking Master Dealership Database...";
            const sheetUrl = await getMasterListUrl(); // 🔐 Secure Fetch
            
            if (sheetUrl) {
                const sheetRaw = await fetch(sheetUrl).then(r => r.json());
                matches = filterSheet(sheetRaw, requiredHead);
                source = "sheet";
            }
        }

        // --- RENDER ---
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        document.getElementById('progressBar').style.width = "100%";
        debug.innerHTML = `Physics Load: <strong>${Math.round(requiredHead)} ft</strong> (${source === 'shopify' ? 'In Stock' : 'Dealership Order'})`;

        if (matches.length === 0) {
            container.innerHTML = noMatchHTML();
        } else {
            renderResults(matches, source);
        }

    } catch (error) {
        console.error(error);
        alert("Network Error. Please try again.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 🟢 FETCHERS & FILTERS

async function fetchShopifyProducts() {
    try {
        const url = `https://${SHOPIFY_DOMAIN}/products.json?limit=250`;
        const r = await fetch(url);
        const d = await r.json();
        return d.products || [];
    } catch { return []; }
}

function filterShopify(products, reqHead) {
    return products.filter(p => {
        let specs = {};
        p.tags.forEach(tag => {
            if(tag.includes(':')) {
                const [key, val] = tag.split(':');
                specs[key.trim().toLowerCase()] = val.trim().toLowerCase();
            }
        });
        
        if (specs.type !== userSelection.source) return false;
        if (specs.phase && parseInt(specs.phase) !== userSelection.phase) return false;
        if (userSelection.source === 'borewell' && specs.dia && parseInt(specs.dia) > userSelection.dia) return false;
        if (!specs.head || parseInt(specs.head) < reqHead) return false;

        // Standardize Object for Renderer
        p.std = {
            title: p.title,
            brand: p.vendor,
            price: p.variants[0].price,
            image: p.images.length > 0 ? p.images[0].src : 'assets/img/motor-placeholder.png',
            link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
            head: specs.head,
            action: "BUY NOW"
        };
        return true;
    });
}

function filterSheet(rows, reqHead) {
    return rows.filter(r => {
        // Sheet columns: type, phase, dia, maxhead, brand, model, price
        if (r.type.toLowerCase() !== userSelection.source) return false;
        if (parseInt(r.phase) !== userSelection.phase) return false;
        if (userSelection.source === 'borewell' && parseInt(r.dia) > userSelection.dia) return false;
        if (parseInt(r.maxhead) < reqHead) return false;

        // Standardize Object
        r.std = {
            title: `${r.brand} ${r.model} (${r.hp}HP)`,
            brand: r.brand,
            price: r.price,
            image: 'assets/img/motor-catalog.png', // Generic image for catalog items
            link: `https://wa.me/${CONTACT_INFO.whatsapp_api}?text=I need ${r.brand} ${r.model} motor`,
            head: r.maxhead,
            action: "ORDER VIA DEALER"
        };
        return true;
    });
}

// 🟢 RENDERER
function renderResults(items, source) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    // Sort cheap to expensive
    items.sort((a,b) => parseFloat(a.std.price) - parseFloat(b.std.price));

    items.forEach((item, index) => {
        const i = item.std;
        let badge = "";
        if (index === 0) badge = `<span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">BEST MATCH</span>`;
        
        // Visual distinction for Sheet items (Yellow border)
        const borderClass = source === 'sheet' ? 'border-yellow-400 border-2' : 'border-slate-200 border';

        container.innerHTML += `
            <div class="product-card bg-white ${borderClass} rounded-xl p-4 flex gap-4 items-center">
                <div class="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100 relative">
                    <img src="${i.image}" class="w-full h-full object-contain" alt="${i.title}">
                    ${source === 'sheet' ? '<div class="absolute bottom-0 w-full bg-yellow-400 text-[8px] text-center font-bold">CATALOG</div>' : ''}
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm md:text-base leading-tight">${i.title}</h4>
                            <p class="text-xs text-slate-500 mt-1">Max Head: ${i.head}ft ${badge}</p>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-blue-600">₹${parseInt(i.price).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="${i.link}" target="_blank" class="block w-full ${source === 'shopify' ? 'bg-slate-900 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white text-center text-xs font-bold py-2 rounded-lg transition">
                            ${i.action}
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

function noMatchHTML() {
    return `
        <div class="text-center py-10">
            <div class="text-4xl mb-2">🕵️</div>
            <h3 class="font-bold text-slate-700">Checking Factory Database...</h3>
            <p class="text-sm text-slate-500 mb-4">No direct stock found. Our engineering team can source this.</p>
            <a href="contact.html" class="text-blue-600 font-bold hover:underline">Submit Technical Request -></a>
        </div>
    `;
}
