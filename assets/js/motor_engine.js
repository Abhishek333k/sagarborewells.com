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

// 🟢 WIZARD UI LOGIC
window.selectSource = function(source) {
    window.EngineState.source = source;
    document.querySelectorAll('.wizard-step').forEach(e => e.classList.remove('active'));
    document.getElementById('step2').classList.add('active');
    
    const progress = document.getElementById('progressBar');
    if(progress) progress.style.width = "66%";
    
    document.querySelectorAll('.spec-box').forEach(e => e.classList.add('hidden'));
    const targetOpt = document.getElementById('opt-' + source);
    if(targetOpt) targetOpt.classList.remove('hidden');
};

window.goToStep = function(n) {
    document.querySelectorAll('.wizard-step').forEach(e => e.classList.remove('active'));
    const target = document.getElementById('step' + n);
    if(target) target.classList.add('active');
    
    const progress = document.getElementById('progressBar');
    if(progress) progress.style.width = (n * 33) + "%";
};

// 🟢 MAIN ENGINE FUNCTION
window.runMotorEngine = async function() {
    const s = window.EngineState;
    
    // 1. CALCULATE PHYSICS
    const phaseEl = document.getElementById('inp-phase');
    s.phase = phaseEl ? parseInt(phaseEl.value) : 1;
    
    let head = 0;
    
    if (s.source === 'borewell') {
        const depth = parseInt(document.getElementById('inp-depth').value || 0);
        const diaRadio = document.querySelector('input[name="dia"]:checked');
        s.dia = diaRadio ? parseInt(diaRadio.value) : 6;
        head = depth * 1.25; 
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

    if (head <= 0) return alert("Please enter valid parameters.");
    s.calculatedHead = head;

    // 2. UI LOADING
    const btn = document.getElementById('btn-search');
    const oldBtnContent = btn.innerHTML;
    btn.innerHTML = `<i class="ri-cpu-line animate-pulse"></i> AI SEARCHING...`;
    btn.disabled = true;

    try {
        const container = document.getElementById('results-grid');
        container.innerHTML = "";
        
        // Move to Results Step
        window.goToStep(3);

        // 3. PARALLEL EXECUTION
        const [shopifyResults, aiResults] = await Promise.all([
            fetchShopifyData(),       
            fetchAIAgentData(s)       
        ]);

        // 4. MERGE & RENDER
        const allMatches = [...shopifyResults, ...aiResults];

        const debugEl = document.getElementById('calcDebug');
        if(debugEl) debugEl.innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> • ${s.phase} Phase`;

        const noMatchMsg = document.getElementById('no-match-msg');
        if (allMatches.length === 0) {
            noMatchMsg.innerHTML = "No exact matches found. <br><span class='text-xs'>Try changing phase or diameter.</span>";
            noMatchMsg.classList.remove('hidden');
        } else {
            noMatchMsg.classList.add('hidden');
            renderCards(allMatches);
        }

    } catch (e) {
        console.error("Engine Error:", e);
        // Show error nicely in the UI instead of alert
        const noMatchMsg = document.getElementById('no-match-msg');
        noMatchMsg.innerHTML = `<span class="text-red-500"><i class="ri-error-warning-line"></i> System Error: ${e.message}</span>`;
        noMatchMsg.classList.remove('hidden');
    } finally {
        btn.innerHTML = oldBtnContent;
        btn.disabled = false;
    }
};

// 🟢 SHOPIFY FETCHER (ROBUST / FUZZY MATCHING)
async function fetchShopifyData() {
    const s = window.EngineState;
    console.log("🔍 Starting Shopify Search for:", s);

    try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/products.json?limit=250`);
        const json = await res.json();
        
        const results = json.products.map(p => {
            // 1. EXTRACT SPECS FROM TAGS & TITLE (Fuzzy Match)
            let specs = {
                type: 'unknown',
                hp: 0,
                phase: 1,
                head: 0,
                dia: 0
            };

            // Combine tags and title for searching
            const searchStr = (p.tags.join(" ") + " " + p.title).toLowerCase();

            // A. Detect Type
            if (searchStr.includes('borewell') || searchStr.includes('submersible') || searchStr.includes('v4') || searchStr.includes('v6')) {
                specs.type = 'borewell';
            } else if (searchStr.includes('openwell') || searchStr.includes('monoblock') || searchStr.includes('centrifugal')) {
                specs.type = 'openwell';
            } else if (searchStr.includes('sewage') || searchStr.includes('cutter') || searchStr.includes('mud')) {
                specs.type = 'sewage';
            }

            // B. Detect HP (Regex for "0.5 HP", "1HP", etc.)
            const hpMatch = searchStr.match(/(\d+(\.\d+)?)\s?hp/);
            if (hpMatch) specs.hp = parseFloat(hpMatch[1]);

            // C. Detect Phase
            if (searchStr.includes('3 phase') || searchStr.includes('3phase') || searchStr.includes('3 ph')) {
                specs.phase = 3;
            } else {
                specs.phase = 1; // Default to single phase
            }

            // D. Detect Head (Look for "100 ft", "30 m")
            // If explicit head tag exists (head:100), use it. Otherwise, guess.
            let explicitHead = 0;
            p.tags.forEach(t => {
                if(t.toLowerCase().includes('head:')) explicitHead = parseInt(t.split(':')[1]);
            });
            
            if (explicitHead > 0) {
                specs.head = explicitHead;
            } else {
                // Heuristic: If head missing, estimate based on HP? 
                // Or looking for numbers near "ft" or "mtr"
                // For safety, let's assume if we can't find head, we DON'T filter by it strictly, 
                // OR we set a generous default.
                specs.head = 999; // Allow it to pass if head is unknown
            }

            // E. Detect Dia (Borewell only)
            if (searchStr.includes('v4') || searchStr.includes('4 inch') || searchStr.includes('100mm')) specs.dia = 4;
            if (searchStr.includes('v6') || searchStr.includes('6 inch') || searchStr.includes('150mm')) specs.dia = 6;


            // 2. FILTERING LOGIC
            // Filter 1: Type Mismatch
            if (specs.type !== 'unknown' && specs.type !== s.source) return null;

            // Filter 2: Phase Mismatch
            if (specs.phase !== s.phase) return null;

            // Filter 3: Borewell Dia Mismatch (You can't put a 6" pump in a 4" hole)
            if (s.source === 'borewell' && specs.dia > s.dia) return null;

            // Filter 4: Head Capacity (Pump must be strong enough)
            // Note: If specs.head is 999 (unknown), we let it pass to be safe
            if (specs.head !== 999 && specs.head < s.calculatedHead) return null;

            return {
                source: 'shopify',
                brand: p.vendor,
                model: p.title,
                hp: specs.hp,
                maxhead: specs.head === 999 ? "Unknown" : specs.head,
                price: p.variants[0].price,
                link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
                image: p.images.length > 0 ? p.images[0].src : 'assets/img/motor-placeholder.png'
            };
        }).filter(item => item !== null);

        console.log(`✅ Shopify Found ${results.length} matches`);
        return results;

    } catch (e) { 
        console.error("❌ Shopify Fetch Error", e); 
        return []; 
    }
}

// 🟢 AI AGENT FETCHER
async function fetchAIAgentData(userSpecs) {
    if (typeof getInventoryAgentUrl !== 'function') {
        console.error("Config missing 'getInventoryAgentUrl'");
        throw new Error("Configuration Error: Missing API Link");
    }

    const agentUrl = await getInventoryAgentUrl(); 
    if (!agentUrl) {
        // We throw an error here so the main try-catch block knows the AI failed critically
        console.warn("AI Agent URL not found in Firebase.");
        return []; 
    }

    try {
        const res = await fetch(agentUrl, {
            method: 'POST', 
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ specs: userSpecs })
        });
        
        const data = await res.json(); 
        if(data.matches) {
            return data.matches.map(m => ({
                source: 'catalog',
                brand: m.brand,
                model: m.model,
                hp: m.hp,
                maxhead: m.head,
                price: "Check Stock",
                link: `https://wa.me/916304094177?text=I need ${m.brand} ${m.model}`,
                image: null,
                reason: m.reason 
            }));
        }
        return [];
    } catch (e) {
        console.warn("AI Agent Fetch Failed:", e);
        return [];
    }
}

// 🟢 RENDERER
function renderCards(list) {
    const container = document.getElementById('results-grid');
    container.innerHTML = "";
    
    // Sort: Shopify First
    list.sort((a, b) => (a.source === 'shopify' ? -1 : 1));

    list.forEach(p => {
        const isStock = p.source === 'shopify';
        const badge = isStock 
            ? `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">IN STOCK</span>`
            : `<span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">AI MATCH</span>`;
        
        const priceTxt = isStock ? `₹${parseInt(p.price).toLocaleString()}` : `<span class="text-xs uppercase font-bold text-slate-400">CATALOG</span>`;
        const btnTxt = isStock ? "BUY NOW" : "GET QUOTE";
        const btnBg = isStock ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 hover:bg-black";
        const img = p.image || 'assets/img/motor-catalog.png';
        const aiReason = p.reason ? `<div class="text-[10px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">"${p.reason}"</div>` : '';

        container.innerHTML += `
        <div class="product-card bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center">
            <div class="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1 flex items-center justify-center">
                <img src="${img}" class="max-w-full max-h-full object-contain">
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${p.brand}</div>
                        <h4 class="font-bold text-slate-800 text-sm leading-tight">${p.model}</h4>
                        <div class="flex gap-2 mt-1 items-center">
                            <span class="text-xs font-mono text-slate-500 font-bold">${p.maxhead}ft</span>
                            ${badge}
                        </div>
                    </div>
                    <div class="font-bold text-blue-600 text-right">${priceTxt}</div>
                </div>
                ${aiReason}
                <div class="mt-2">
                    <a href="${p.link}" target="_blank" class="block w-full ${btnBg} text-white text-center text-[10px] font-bold py-2 rounded-lg transition">${btnTxt}</a>
                </div>
            </div>
        </div>`;
    });
}
