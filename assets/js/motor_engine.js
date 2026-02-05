// FILENAME: assets/js/motor_engine.js

// 🟢 CONFIG
const SHOPIFY_DOMAIN = "sagartraders.in"; 

// 🟢 STATE
let userSelection = { usage: 'domestic', source: '', calculatedHead: 0, dia: 0, phase: 1 };

// 🟢 WIZARD UI (Standard - Same as before)
function selectUsage(usage) {
    userSelection.usage = usage;
    const sewageCard = document.getElementById('sewageOption');
    if (usage === 'industrial') sewageCard.classList.remove('hidden');
    else sewageCard.classList.add('hidden');
    goToStep(2);
}
function selectSource(source) {
    userSelection.source = source;
    document.querySelectorAll('.spec-group').forEach(el => el.classList.add('hidden'));
    document.getElementById(`spec-${source}`).classList.remove('hidden');
    goToStep(3);
}
function goToStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${stepNum}`).classList.add('active');
    document.getElementById('progressBar').style.width = `${stepNum * 25}%`;
}
function prevStep(targetStep) { goToStep(targetStep); }

// 🟢 THE ENGINE
async function runEngine() {
    // 1. Gather Inputs & Physics (Same as before)
    userSelection.phase = parseInt(document.getElementById('inputPhase').value);
    let head = 0;

    if (userSelection.source === 'borewell') {
        const depth = parseInt(document.getElementById('inputDepth').value || 0);
        userSelection.dia = parseFloat(document.getElementById('inputDia').value);
        head = depth * 1.25; // 25% Friction Safety Factor
    } else if (userSelection.source === 'openwell') {
        const suction = parseInt(document.getElementById('inputSuction').value || 0);
        const horiz = parseInt(document.getElementById('inputHorizontal').value || 0);
        const vert = parseInt(document.getElementById('inputDeliveryHeight').value || 0);
        head = suction + vert + (horiz / 10);
    } else if (userSelection.source === 'sewage') {
        head = parseInt(document.getElementById('inputLift').value || 0);
    }

    if (head <= 0) return alert("Please check your inputs.");
    userSelection.calculatedHead = head;

    const btn = document.getElementById('findBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Checking Global Inventory...`;
    btn.disabled = true;

    try {
        const container = document.getElementById('resultsContainer');
        const debug = document.getElementById('calcDebug');
        container.innerHTML = "";

        // --- FETCH HYBRID DATA ---
        // 1. Shopify (Live)
        const shopifyRaw = await fetchShopifyProducts();
        let matches = filterStandardized(shopifyRaw, 'shopify');

        // 2. Google Sheet (AI Master List)
        // Only fetch if we need more options
        if (matches.length < 5) {
            const sheetUrl = await getMasterListUrl(); // From config.js
            if (sheetUrl) {
                const sheetRaw = await fetch(sheetUrl).then(r => r.json());
                const sheetMatches = filterStandardized(sheetRaw, 'sheet');
                matches = [...matches, ...sheetMatches];
            }
        }

        // --- RENDER ---
        goToStep(4);
        debug.innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> | Source: ${userSelection.source.toUpperCase()}`;

        if (matches.length === 0) {
            container.innerHTML = noMatchHTML();
        } else {
            renderResults(matches);
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
        
        // Normalize Shopify Data to match Sheet Data Structure
        return d.products.map(p => {
            let specs = {};
            p.tags.forEach(tag => {
                if(tag.includes(':')) {
                    const [key, val] = tag.split(':');
                    specs[key.trim().toLowerCase()] = val.trim().toLowerCase();
                }
            });
            return {
                brand: p.vendor,
                model: p.title,
                type: specs.type || 'unknown',
                hp: specs.hp || 0,
                phase: parseInt(specs.phase || 1),
                maxhead: parseInt(specs.head || 0),
                dia: parseInt(specs.dia || 0),
                price: p.variants[0].price,
                link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
                image: p.images.length > 0 ? p.images[0].src : 'assets/img/motor-placeholder.png'
            };
        });
    } catch { return []; }
}

// 🟢 UNIVERSAL FILTER (Works for both Shopify & Sheet)
function filterStandardized(products, source) {
    return products.filter(p => {
        // 1. Type Check
        if (p.type !== userSelection.source) return false;

        // 2. Phase Check
        if (p.phase !== userSelection.phase) return false;

        // 3. Diameter Check (Borewell)
        if (userSelection.source === 'borewell' && p.dia > userSelection.dia) return false;

        // 4. Head Check
        if (p.maxhead < userSelection.calculatedHead) return false;

        // Add Metadata
        p.source = source;
        return true;
    });
}

// 🟢 RENDERER
function renderResults(items) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    // Sort: Shopify First, then Cheapest
    items.sort((a,b) => {
        if (a.source === 'shopify' && b.source !== 'shopify') return -1;
        if (a.source !== 'shopify' && b.source === 'shopify') return 1;
        return parseFloat(a.price) - parseFloat(b.price);
    });

    items.forEach((p, index) => {
        let badge = "";
        if (p.source === 'shopify') badge = `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">IN STOCK</span>`;
        else if (index === 0) badge = `<span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">CATALOG MATCH</span>`;

        const btnText = p.source === 'shopify' ? "BUY NOW" : "CHECK AVAILABILITY";
        const btnClass = p.source === 'shopify' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-800 hover:bg-slate-900";
        // If image is missing in Sheet, use placeholder
        const img = p.image || 'assets/img/motor-catalog.png';

        container.innerHTML += `
            <div class="product-card bg-white border ${p.source === 'shopify' ? 'border-emerald-400' : 'border-slate-200'} rounded-xl p-4 flex gap-4 items-center">
                <div class="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100">
                    <img src="${img}" class="w-full h-full object-contain">
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm md:text-base leading-tight">${p.brand} ${p.model}</h4>
                            <div class="flex gap-2 mt-1 items-center">
                                <span class="text-xs text-slate-500 font-mono">Max Head: ${p.maxhead}ft</span>
                                ${badge}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-blue-600">₹${parseInt(p.price).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="${p.link}" target="_blank" class="block w-full ${btnClass} text-white text-center text-xs font-bold py-2 rounded-lg transition">
                            ${btnText}
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
            <div class="text-4xl mb-2">📡</div>
            <h3 class="font-bold text-slate-700">Engineering Request Needed</h3>
            <p class="text-sm text-slate-500 mb-4">Requirement (${Math.round(userSelection.calculatedHead)}ft) exceeds standard catalog data.</p>
            <a href="contact.html" class="inline-block border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-full hover:bg-blue-50">Contact Technical Team</a>
        </div>
    `;
}
