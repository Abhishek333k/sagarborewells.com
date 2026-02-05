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
            noMatchMsg.classList.remove('hidden');
        } else {
            noMatchMsg.classList.add('hidden');
            renderCards(allMatches);
        }

    } catch (e) {
        console.error("Engine Error:", e);
        alert("System Error: " + e.message);
    } finally {
        btn.innerHTML = oldBtnContent;
        btn.disabled = false;
    }
};

// 🟢 SHOPIFY FETCHER
async function fetchShopifyData() {
    const s = window.EngineState;
    try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/products.json?limit=250`);
        const json = await res.json();
        
        return json.products.map(p => {
            let tags = {};
            p.tags.forEach(t => { 
                const parts = t.split(':'); 
                if(parts.length===2) tags[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase(); 
            });

            if (tags.type !== s.source) return null;
            if (parseInt(tags.phase) !== s.phase) return null;
            if (s.source === 'borewell' && parseInt(tags.dia) > s.dia) return null;
            if (parseInt(tags.head) < s.calculatedHead) return null;

            return {
                source: 'shopify',
                brand: p.vendor,
                model: p.title,
                hp: parseFloat(tags.hp) || 0,
                maxhead: parseInt(tags.head),
                price: p.variants[0].price,
                link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
                image: p.images[0]?.src
            };
        }).filter(item => item !== null); 
    } catch (e) { console.error("Shopify Fetch Error", e); return []; }
}

// 🟢 AI AGENT FETCHER
async function fetchAIAgentData(userSpecs) {
    if (typeof getInventoryAgentUrl !== 'function') {
        console.error("Config missing 'getInventoryAgentUrl'");
        return [];
    }

    const agentUrl = await getInventoryAgentUrl(); 
    if (!agentUrl) return [];

    try {
        // We use text/plain to avoid CORS preflight, ensuring standard Google Apps Script handling
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
