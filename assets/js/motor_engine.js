// FILENAME: assets/js/motor_engine.js

// 🟢 CONFIG
const SHOPIFY_DOMAIN = "sagartraders.in"; 

// 🟢 STATE
let userSelection = { 
    usage: 'domestic', // domestic | agri | industrial
    source: '', 
    calculatedHead: 0, 
    dia: 0, 
    phase: 1,
    fluidType: 'clear'
};

// 🟢 WIZARD LOGIC
function selectUsage(usage) {
    userSelection.usage = usage;
    
    // Show/Hide Sewage based on usage
    const sewageCard = document.getElementById('sewageOption');
    if (usage === 'industrial') {
        sewageCard.classList.remove('hidden');
    } else {
        sewageCard.classList.add('hidden');
    }

    goToStep(2);
}

function selectSource(source) {
    userSelection.source = source;
    
    // Toggle UI Inputs
    document.querySelectorAll('.spec-group').forEach(el => el.classList.add('hidden'));
    document.getElementById(`spec-${source}`).classList.remove('hidden');

    goToStep(3);
}

function goToStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${stepNum}`).classList.add('active');
    document.getElementById('progressBar').style.width = `${stepNum * 25}%`;
}

function prevStep(targetStep) {
    goToStep(targetStep);
}

// 🟢 THE PHYSICS ENGINE
async function runEngine() {
    // 1. GATHER & CALCULATE HEAD
    userSelection.phase = parseInt(document.getElementById('inputPhase').value);
    
    let head = 0;

    if (userSelection.source === 'borewell') {
        const depth = parseInt(document.getElementById('inputDepth').value || 0);
        userSelection.dia = parseFloat(document.getElementById('inputDia').value);
        // Rule: Depth + 20% Friction
        head = depth * 1.2;
    } 
    else if (userSelection.source === 'openwell') {
        const suction = parseInt(document.getElementById('inputSuction').value || 0);
        const horiz = parseInt(document.getElementById('inputHorizontal').value || 0);
        const vert = parseInt(document.getElementById('inputDeliveryHeight').value || 0);
        
        // Rule: Vertical + (Horizontal / 10) friction
        // Example: 500ft horizontal = 50ft vertical load
        head = suction + vert + (horiz / 10);
    }
    else if (userSelection.source === 'sewage') {
        head = parseInt(document.getElementById('inputLift').value || 0);
        userSelection.fluidType = document.getElementById('inputFluid').value;
    }

    if (head <= 0) return alert("Please check your inputs.");
    userSelection.calculatedHead = head;

    // 2. UI LOADING
    const btn = document.getElementById('findBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Calculating Physics...`;
    btn.disabled = true;

    try {
        const container = document.getElementById('resultsContainer');
        const debug = document.getElementById('calcDebug');
        container.innerHTML = "";

        // --- FETCH DATA ---
        // 1. Shopify
        const shopifyRaw = await fetchShopifyProducts();
        let matches = filterShopify(shopifyRaw);
        let source = "shopify";

        // 2. Sheet Fallback
        if (matches.length < 3) {
            const sheetUrl = await getMasterListUrl();
            if (sheetUrl) {
                const sheetRaw = await fetch(sheetUrl).then(r => r.json());
                const sheetMatches = filterSheet(sheetRaw);
                matches = [...matches, ...sheetMatches];
                source = "hybrid";
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

// 🟢 FETCHERS & FILTERS (Updated Logic)

async function fetchShopifyProducts() {
    try {
        const url = `https://${SHOPIFY_DOMAIN}/products.json?limit=250`;
        const r = await fetch(url);
        const d = await r.json();
        return d.products || [];
    } catch { return []; }
}

function filterShopify(products) {
    return products.filter(p => {
        let specs = {};
        p.tags.forEach(tag => {
            if(tag.includes(':')) {
                const [key, val] = tag.split(':');
                specs[key.trim().toLowerCase()] = val.trim().toLowerCase();
            }
        });

        // 1. Source Type Match
        // Note: Shopify tags should be 'borewell', 'openwell', 'sewage'
        if (specs.type !== userSelection.source) return false;

        // 2. Phase Match
        if (specs.phase && parseInt(specs.phase) !== userSelection.phase) return false;

        // 3. Borewell Diameter Logic
        // If pump is 4", it fits in 4", 5", 6", 8" holes.
        // If pump is 6", it ONLY fits in 6", 7", 8" holes.
        if (userSelection.source === 'borewell' && specs.dia) {
            const pumpDia = parseFloat(specs.dia);
            if (pumpDia > userSelection.dia) return false; // Pump too big for hole
        }

        // 4. Head Logic (The Physics Check)
        if (specs.head) {
            const maxHead = parseInt(specs.head);
            // Pump must handle AT LEAST the calculated head
            if (maxHead < userSelection.calculatedHead) return false;
        } else {
            return false;
        }

        // Standardize
        p.std = {
            title: p.title,
            brand: p.vendor,
            price: p.variants[0].price,
            image: p.images.length > 0 ? p.images[0].src : 'assets/img/motor-placeholder.png',
            link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
            head: specs.head,
            source: 'shopify',
            action: "BUY NOW"
        };
        return true;
    });
}

function filterSheet(rows) {
    return rows.map(r => normalizeRow(r))
               .filter(r => {
                   if (!r.valid) return false;

                   // 1. Fuzzy Type Match
                   if (userSelection.source === 'borewell' && !r.type.includes('sub')) return false;
                   if (userSelection.source === 'openwell' && !r.type.includes('mono')) return false;
                   if (userSelection.source === 'sewage' && !r.type.includes('mud')) return false;

                   // 2. Phase
                   if (r.phase !== userSelection.phase) return false;

                   // 3. Diameter (Borewell)
                   if (userSelection.source === 'borewell' && r.dia > userSelection.dia) return false;

                   // 4. Head
                   if (r.maxhead < userSelection.calculatedHead) return false;

                   return true;
               })
               .map(r => {
                   return {
                       std: {
                           title: `${r.brand} ${r.model} (${r.hp}HP)`,
                           brand: r.brand || "Generic",
                           price: r.price || "Check Price",
                           image: 'assets/img/motor-catalog.png',
                           link: `https://wa.me/${CONTACT_INFO.whatsapp_api}?text=I need ${r.brand} ${r.model} (Code: ${r.sku})`,
                           head: r.maxhead,
                           source: 'sheet',
                           action: "CHECK STOCK"
                       }
                   };
               });
}

function normalizeRow(row) {
    const safeGet = (key) => (row[key] || row[Object.keys(row).find(k => k.toLowerCase().includes(key))] || "").toString();

    let clean = {
        valid: true,
        sku: safeGet('code') || safeGet('item'),
        brand: safeGet('category') || "KSB",
        model: safeGet('description') || "Pump",
        type: (safeGet('pump type') || safeGet('type')).toLowerCase(),
        hp: parseFloat(safeGet('hp')) || 0,
        price: safeGet('m.r.p') || safeGet('price'),
        stage: parseInt(safeGet('stage')) || 0,
        dia: 0,
        phase: 0,
        maxhead: 0
    };

    if (clean.stage > 0) clean.maxhead = clean.stage * 15; // 1 Stage = ~15ft head (Standard)
    if (clean.hp > 0) clean.phase = (clean.hp <= 2) ? 1 : 3; // Inference

    // Diameter Inference
    if (clean.model.toLowerCase().includes('v4')) clean.dia = 4;
    else if (clean.model.toLowerCase().includes('v6')) clean.dia = 6;
    else clean.dia = (clean.hp <= 3) ? 4 : 6;

    if (clean.maxhead === 0 || clean.hp === 0) clean.valid = false;

    return clean;
}

// 🟢 RENDERER
function renderResults(items) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    items.sort((a,b) => (a.std.source === 'shopify' ? -1 : 1)); // Shopify First
    items.sort((a,b) => parseFloat(a.std.price) - parseFloat(b.std.price)); // Cheap First

    items.forEach((item, index) => {
        const i = item.std;
        let badge = "";
        if (i.source === 'shopify') badge = `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">IN STOCK</span>`;
        
        const borderClass = i.source === 'shopify' ? 'border-emerald-400 border-2' : 'border-slate-200 border';
        const btnClass = i.source === 'shopify' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-900';

        container.innerHTML += `
            <div class="product-card bg-white ${borderClass} rounded-xl p-4 flex gap-4 items-center">
                <div class="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100 relative">
                    <img src="${i.image}" class="w-full h-full object-contain" alt="${i.title}">
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm md:text-base leading-tight">${i.title}</h4>
                            <div class="flex gap-2 mt-1 items-center">
                                <span class="text-xs text-slate-500 font-mono">Head: ${i.head}ft</span>
                                ${badge}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-blue-600">${typeof i.price === 'number' ? '₹'+i.price.toLocaleString() : i.price}</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="${i.link}" target="_blank" class="block w-full ${btnClass} text-white text-center text-xs font-bold py-2 rounded-lg transition">
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
            <div class="text-4xl mb-2">📡</div>
            <h3 class="font-bold text-slate-700">Engineering Request Needed</h3>
            <p class="text-sm text-slate-500 mb-4">Your requirement is complex. Our engineering team needs to review this.</p>
            <a href="contact.html" class="inline-block border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-full hover:bg-blue-50">Contact Technical Team</a>
        </div>
    `;
}
