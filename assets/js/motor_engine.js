// FILENAME: assets/js/motor_engine.js

const SHOPIFY_DOMAIN = "sagartraders.in"; 

// GLOBAL STATE
window.EngineState = {
    usage: 'domestic',
    source: '',
    calculatedHead: 0,
    dia: 6,
    phase: 1
};

// 🟢 MAIN EXECUTION FUNCTION
async function runMotorEngine() {
    const s = window.EngineState;
    
    // 1. GATHER INPUTS
    s.phase = parseInt(document.getElementById('inp-phase').value);
    
    let head = 0;
    
    if (s.source === 'borewell') {
        const depth = parseInt(document.getElementById('inp-depth').value || 0);
        const diaRadio = document.querySelector('input[name="dia"]:checked');
        s.dia = diaRadio ? parseInt(diaRadio.value) : 6;
        head = depth * 1.25; // Friction buffer
    } 
    else if (s.source === 'openwell') {
        const suc = parseInt(document.getElementById('inp-suction').value || 0);
        const del = parseInt(document.getElementById('inp-delivery').value || 0);
        const flat = parseInt(document.getElementById('inp-flat').value || 0);
        head = suc + del + (flat / 10);
    }
    else if (s.source === 'sewage') {
        head = parseInt(document.getElementById('inp-lift').value || 0);
    }

    if (head <= 0) return alert("Please enter valid depth/distance values.");
    s.calculatedHead = head;

    // 2. UI LOADING STATE
    const btn = document.getElementById('btn-search');
    const oldBtn = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> CALCULATING...`;
    btn.disabled = true;

    try {
        // 3. FETCH DATA (Hybrid)
        const container = document.getElementById('results-grid');
        container.innerHTML = "";
        
        // A. Shopify (Live)
        const shopifyRaw = await fetchShopify();
        let matches = filterData(shopifyRaw, 'shopify');

        // B. Sheet (Catalog) - Only if needed
        if (matches.length < 5) {
            const sheetUrl = await getMasterListUrl(); // From config.js
            if (sheetUrl) {
                const sheetRaw = await fetch(sheetUrl).then(r => r.json());
                const sheetMatches = filterData(sheetRaw, 'sheet');
                matches = [...matches, ...sheetMatches];
            }
        }

        // 4. RENDER
        goToStep(4);
        document.getElementById('debug-text').innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> • Source: ${s.source.toUpperCase()}`;

        if (matches.length === 0) {
            document.getElementById('no-match-msg').classList.remove('hidden');
        } else {
            document.getElementById('no-match-msg').classList.add('hidden');
            renderCards(matches);
        }

    } catch (e) {
        console.error(e);
        alert("Engine Error: " + e.message);
    } finally {
        btn.innerHTML = oldBtn;
        btn.disabled = false;
    }
}

// 🟢 DATA FETCHERS
async function fetchShopify() {
    try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/products.json?limit=250`);
        const json = await res.json();
        return json.products.map(p => {
            // Parse Tags
            let specs = {};
            p.tags.forEach(t => {
                const parts = t.split(':');
                if(parts.length === 2) specs[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase();
            });
            return {
                brand: p.vendor,
                model: p.title,
                type: specs.type || 'unknown',
                hp: parseFloat(specs.hp) || 0,
                phase: parseInt(specs.phase) || 1,
                maxhead: parseInt(specs.head) || 0,
                dia: parseInt(specs.dia) || 0,
                price: p.variants[0].price, // Number-like string
                link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
                image: p.images.length > 0 ? p.images[0].src : null
            };
        });
    } catch (e) { return []; }
}

// 🟢 UNIVERSAL FILTER
function filterData(list, source) {
    const s = window.EngineState;
    return list.filter(p => {
        if (p.type !== s.source) return false;
        if (p.phase !== s.phase) return false;
        if (s.source === 'borewell' && p.dia > s.dia) return false;
        if (p.maxhead < s.calculatedHead) return false;
        
        p.source = source;
        return true;
    });
}

// 🟢 RENDERER (With Safe Sort)
function renderCards(list) {
    const container = document.getElementById('results-grid');
    
    // SAFE SORT: Handle "Check Stock" string vs Numbers
    list.sort((a, b) => {
        // 1. Source Priority: Shopify First
        if (a.source === 'shopify' && b.source !== 'shopify') return -1;
        if (a.source !== 'shopify' && b.source === 'shopify') return 1;

        // 2. Price Sort (Handle Text)
        const pa = parseFloat(a.price) || 999999; // Treat text as high price (bottom)
        const pb = parseFloat(b.price) || 999999;
        return pa - pb;
    });

    list.forEach(p => {
        const isStock = p.source === 'shopify';
        const badge = isStock 
            ? `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">IN STOCK</span>`
            : `<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">CATALOG</span>`;
            
        const priceTxt = isStock ? `₹${parseInt(p.price).toLocaleString()}` : `<span class="text-xs uppercase font-bold text-slate-400">${p.price}</span>`;
        const btnTxt = isStock ? "BUY NOW" : "CHECK AVAILABILITY";
        const btnBg = isStock ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 hover:bg-black";
        const img = p.image || 'assets/img/motor-catalog.png';

        const html = `
        <div class="product-card p-4 flex gap-4 items-center">
            <div class="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1">
                <img src="${img}" class="w-full h-full object-contain mix-blend-multiply">
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${p.brand}</div>
                        <div class="font-bold text-slate-800 text-sm line-clamp-1">${p.model}</div>
                        <div class="flex gap-2 mt-1 items-center">
                            <span class="text-xs font-mono text-slate-500">${p.maxhead}ft Head</span>
                            ${badge}
                        </div>
                    </div>
                    <div class="font-bold text-blue-600 text-right">${priceTxt}</div>
                </div>
                <div class="mt-2">
                    <a href="${p.link}" target="_blank" class="block w-full ${btnBg} text-white text-center text-[10px] font-bold py-2 rounded-lg transition">
                        ${btnTxt}
                    </a>
                </div>
            </div>
        </div>`;
        
        container.innerHTML += html;
    });
}
