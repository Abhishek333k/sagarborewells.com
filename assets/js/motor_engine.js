// FILENAME: assets/js/motor_engine.js

// 🟢 CONFIG
const SHOPIFY_DOMAIN = "sagartraders.in"; 

// 🟢 STATE
let userSelection = { source: '', depth: 0, dia: 6, phase: 1 };

// 🟢 WIZARD UI LOGIC (Unchanged)
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

// 🟢 THE HYBRID ENGINE
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
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Intelligent Search...`;
    btn.disabled = true;

    // Physics Buffer (25% friction loss)
    const requiredHead = userSelection.depth * 1.25; 

    try {
        const container = document.getElementById('resultsContainer');
        const debug = document.getElementById('calcDebug');
        container.innerHTML = "";
        
        // --- SOURCE 1: SHOPIFY (Live Stock) ---
        // (This code remains same as previous, fetching active products)
        const shopifyRaw = await fetchShopifyProducts();
        let matches = filterShopify(shopifyRaw, requiredHead);
        let source = "shopify";

        // --- SOURCE 2: GOOGLE SHEET (Master DB) ---
        // If Shopify yields low results, we check the Master DB
        if (matches.length < 3) {
            const sheetUrl = await getMasterListUrl(); 
            if (sheetUrl) {
                const sheetRaw = await fetch(sheetUrl).then(r => r.json());
                const sheetMatches = filterSheet(sheetRaw, requiredHead);
                
                // Merge results (Shopify on top)
                matches = [...matches, ...sheetMatches];
                source = "hybrid";
            }
        }

        // --- RENDER ---
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        document.getElementById('progressBar').style.width = "100%";
        debug.innerHTML = `Physics Load: <strong>${Math.round(requiredHead)} ft</strong> (${matches.length} matches found)`;

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

// 🟢 FETCHERS (Unchanged)
async function fetchShopifyProducts() {
    try {
        const url = `https://${SHOPIFY_DOMAIN}/products.json?limit=250`;
        const r = await fetch(url);
        const d = await r.json();
        return d.products || [];
    } catch { return []; }
}

// 🟢 SMART FILTER: SHOPIFY
function filterShopify(products, reqHead) {
    return products.filter(p => {
        let specs = {};
        p.tags.forEach(tag => {
            if(tag.includes(':')) {
                const [key, val] = tag.split(':');
                specs[key.trim().toLowerCase()] = val.trim().toLowerCase();
            }
        });
        
        // Strict Logic for Active Products
        if (specs.type !== userSelection.source) return false;
        if (specs.phase && parseInt(specs.phase) !== userSelection.phase) return false;
        if (userSelection.source === 'borewell' && specs.dia && parseInt(specs.dia) > userSelection.dia) return false;
        if (!specs.head || parseInt(specs.head) < reqHead) return false;

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

// 🟢 SMART FILTER: DIRTY DATA SHEET (The Logic Upgrade)
function filterSheet(rows, reqHead) {
    return rows.map(r => normalizeRow(r)) // 1. Clean Data
               .filter(r => {             // 2. Filter Logic
                   if (!r.valid) return false; // Skip junk rows

                   // Rule 1: Type Match (Fuzzy match)
                   // If excel says "Submersible", it matches "borewell"
                   if (userSelection.source === 'borewell' && !r.type.includes('sub')) return false;
                   if (userSelection.source === 'openwell' && !r.type.includes('mono')) return false;

                   // Rule 2: Phase Match (With Inference)
                   if (r.phase !== userSelection.phase) return false;

                   // Rule 3: Diameter (Borewell Only)
                   if (userSelection.source === 'borewell' && r.dia > userSelection.dia) return false;

                   // Rule 4: Head (Physics)
                   if (r.maxhead < reqHead) return false;

                   return true;
               })
               .map(r => {
                   // 3. Format for Display
                   return {
                       std: {
                           title: `${r.brand} ${r.model} (${r.hp}HP)`,
                           brand: r.brand || "Generic",
                           price: r.price || "Call for Price",
                           image: 'assets/img/motor-catalog.png',
                           link: `https://wa.me/${CONTACT_INFO.whatsapp_api}?text=I need ${r.brand} ${r.model} (Item Code: ${r.sku})`,
                           head: r.maxhead,
                           source: 'sheet',
                           action: "CHECK STOCK"
                       }
                   };
               });
}

// 🟢 DATA NORMALIZER (The "AI" Cleaner)
function normalizeRow(row) {
    // Standardize Keys (lowercase)
    const safeGet = (key) => (row[key] || row[Object.keys(row).find(k => k.toLowerCase().includes(key))] || "").toString();

    let clean = {
        valid: true,
        sku: safeGet('code') || safeGet('item'),
        brand: safeGet('category') || "KSB", // Default to KSB if using KSB sheet
        model: safeGet('description') || "Pump",
        type: (safeGet('pump type') || safeGet('type')).toLowerCase(),
        hp: parseFloat(safeGet('hp')) || 0,
        price: safeGet('m.r.p') || safeGet('price'),
        stage: parseInt(safeGet('stage')) || 0,
        dia: 0,
        phase: 0,
        maxhead: 0
    };

    // 🧠 INFERENCE ENGINE (Filling the Gaps)

    // 1. Infer Head from Stages (If Head column missing)
    // KSB Data usually implies 1 Stage = 4-5 Meters (approx 15ft)
    if (clean.stage > 0) {
        clean.maxhead = clean.stage * 15; 
    }

    // 2. Infer Phase from HP
    // < 3HP usually 1-Phase (Domestic), > 3HP usually 3-Phase (Agri)
    if (clean.hp > 0) {
        clean.phase = (clean.hp <= 2) ? 1 : 3;
    }

    // 3. Infer Dia from Description
    // Look for "V4" (4 inch) or "V6" (6 inch) in model name
    if (clean.model.toLowerCase().includes('v4') || clean.model.toLowerCase().includes('100mm')) {
        clean.dia = 4;
    } else if (clean.model.toLowerCase().includes('v6') || clean.model.toLowerCase().includes('150mm')) {
        clean.dia = 6;
    } else {
        // Fallback: Low HP = 4", High HP = 6"
        clean.dia = (clean.hp <= 3) ? 4 : 6;
    }

    // Validation: If we still have 0 head or 0 HP, this row is junk.
    if (clean.maxhead === 0 || clean.hp === 0) clean.valid = false;

    return clean;
}

// 🟢 RENDERER
function renderResults(items) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    // Prioritize Shopify items (In Stock) over Sheet items
    items.sort((a,b) => (a.std.source === 'shopify' ? -1 : 1));

    items.forEach((item, index) => {
        const i = item.std;
        let badge = "";
        
        // Smart Badging
        if (i.source === 'shopify') badge = `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">IN STOCK</span>`;
        else if (index === 0) badge = `<span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">BEST MATCH</span>`;

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
            <p class="text-sm text-slate-500 mb-4">Your depth requirement is extremely high. Standard catalog motors may not suffice.</p>
            <a href="contact.html" class="inline-block border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-full hover:bg-blue-50">Contact Technical Team</a>
        </div>
    `;
}
