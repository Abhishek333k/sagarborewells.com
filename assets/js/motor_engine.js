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

// 🖥️ TERMINAL SYSTEM
const Terminal = {
    el: document.getElementById('aiTerminal'),
    log: (msg, type = '') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="opacity-50">>></span> ${msg}`;
        const container = document.getElementById('terminalLogs');
        if(container) {
            container.appendChild(line);
            container.scrollTop = container.scrollHeight;
        }
    },
    progress: (pct) => {
        const bar = document.getElementById('terminalProgress');
        if(bar) bar.style.width = `${pct}%`;
    },
    show: () => { 
        const el = document.getElementById('aiTerminal');
        if(el) el.style.display = 'flex'; 
    },
    hide: () => { 
        const el = document.getElementById('aiTerminal');
        if(el) el.style.display = 'none'; 
    }
};

// 🟢 MAIN ENGINE EXECUTION
window.runMotorEngine = async function() {
    const s = window.EngineState;
    const phaseEl = document.getElementById('inp-phase');
    s.phase = phaseEl ? parseInt(phaseEl.value) : 1;
    let head = 0;
    
    // 1. PHYSICS ENGINE (Calculate Head)
    if (s.source === 'borewell') {
        const depth = parseInt(document.getElementById('inp-depth').value || 0);
        const diaRadio = document.querySelector('input[name="dia"]:checked');
        s.dia = diaRadio ? parseInt(diaRadio.value) : 6;
        head = depth * 1.25; 
    } else if (s.source === 'openwell') {
        const suc = parseInt(document.getElementById('inp-suction').value || 0);
        const del = parseInt(document.getElementById('inp-delivery').value || 0);
        const flat = parseInt(document.getElementById('inp-flat').value || 0);
        head = suc + del + (flat / 10);
    } else if (s.source === 'sewage') {
        head = parseInt(document.getElementById('inp-lift').value || 0);
    }

    if (head <= 0) return alert("Please enter valid parameters.");
    s.calculatedHead = head;

    // 2. START TERMINAL
    Terminal.show();
    Terminal.log("Initializing Neural Context...", "highlight");
    Terminal.progress(10);

    try {
        // 3. SECURE KEYS (Fetch from Firestore)
        if (typeof getGeminiKey !== 'function' || typeof getInventoryConfig !== 'function') {
            throw new Error("Security Modules Not Loaded");
        }

        const [geminiKey, invConfig] = await Promise.all([
            getGeminiKey(),
            getInventoryConfig()
        ]);

        if (!geminiKey || !invConfig) throw new Error("Security Vault Access Denied (Missing Keys)");
        
        Terminal.log("Database Connection Established.");
        Terminal.progress(30);

        // 4. DATA AGGREGATION (Shopify + KSB + KOEL)
        Terminal.log("Aggregating Global Inventory...");
        
        // 🟢 FIX: Fetch all sources (added KOEL support)
        const [shopifyData, ksbData, koelData] = await Promise.all([
            fetchShopifyData(),
            fetchSheetData(invConfig.ksb_db_url, 'KSB'),         // KSB Catalog
            fetchSheetData(invConfig.kirloskar_db_url, 'KOEL')   // Kirloskar Catalog
        ]);

        const totalItems = shopifyData.length + ksbData.length + koelData.length;
        Terminal.log(`Analyzed ${totalItems} SKUs across 3 Databases.`);
        Terminal.progress(50);

        // 5. HARD FILTER (Physics & Type)
        Terminal.log(`Applying Physics Constraints (Head > ${Math.round(head)}ft)...`);
        
        const allCandidates = [...shopifyData, ...ksbData, ...koelData];
        
        const candidates = allCandidates.filter(item => {
            const txt = (item.title + " " + item.desc).toLowerCase();
            
            // Type Check
            if (s.source === 'borewell' && !txt.includes('sub') && !txt.includes('bore') && !txt.includes('v4') && !txt.includes('v6')) return false;
            if (s.source === 'openwell' && !txt.includes('open') && !txt.includes('mono')) return false;
            
            // Phase Check (Strict)
            const is3Phase = txt.includes('3 phase') || txt.includes('3phase') || txt.includes('3 ph');
            if (s.phase === 3 && !is3Phase) return false;
            if (s.phase === 1 && is3Phase) return false;

            // Borewell Dia Check
            if (s.source === 'borewell' && s.dia === 4 && (txt.includes('v6') || txt.includes('6 inch'))) return false;

            return true;
        }).slice(0, 40); // Limit to top 40 candidates for Gemini

        Terminal.log(`${candidates.length} Viable Candidates Identified.`, "highlight");
        
        // 6. AI DECISION (Gemini)
        let finalResults = [];
        if (candidates.length > 0) {
            Terminal.log("Requesting Gemini 1.5 Flash Analysis...");
            Terminal.progress(75);
            finalResults = await askGemini(geminiKey, s, candidates);
        }

        Terminal.log("Generating Recommendation Vectors...");
        Terminal.progress(100);
        await new Promise(r => setTimeout(r, 800)); // Cinematic delay

        // 7. RENDER RESULTS
        Terminal.hide();
        window.goToStep(3);
        
        const debugEl = document.getElementById('calcDebug');
        if(debugEl) debugEl.innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> • ${s.phase} Phase`;

        if (finalResults.length === 0) {
            document.getElementById('no-match-msg').classList.remove('hidden');
        } else {
            document.getElementById('no-match-msg').classList.add('hidden');
            renderCards(finalResults);
        }

    } catch (e) {
        console.error(e);
        Terminal.log(`CRITICAL ERROR: ${e.message}`, "error");
        setTimeout(() => { Terminal.hide(); alert("System Error: " + e.message); }, 3000);
    }
};

// 🟢 AI BRAIN (Gemini API)
async function askGemini(apiKey, userSpecs, candidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Minify data to save tokens
    const miniList = candidates.map(c => ({ 
        id: c.id, 
        name: c.title, 
        price: c.price,
        source: c.source 
    }));

    const prompt = `
    Role: Expert Hydraulic Engineer.
    User Needs: ${userSpecs.source} pump, ${userSpecs.phase}-Phase, Head requirement: ${Math.round(userSpecs.calculatedHead)} ft.
    
    Task: Select the best 3-5 matches from this list.
    Prioritize: 1. Technical Fit, 2. 'Shopify' (In Stock), 3. Price.
    Constraint: If Head is mentioned in title, it MUST be > ${Math.round(userSpecs.calculatedHead)}.
    
    List: ${JSON.stringify(miniList)}
    
    Output JSON ONLY: [ { "id": "...", "reason": "Why this fits (max 10 words)" } ]
    `;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await res.json();
        
        if (!data.candidates || !data.candidates[0].content) throw new Error("AI Busy");
        
        const rawTxt = data.candidates[0].content.parts[0].text;
        const cleanJson = rawTxt.replace(/```json|```/g, '').trim();
        
        // 🟢 FIX: Variable name collision fixed
        const aiDecisions = JSON.parse(cleanJson);

        // Merge AI Reasoning
        return aiDecisions.map(d => {
            const original = candidates.find(c => c.id === d.id);
            if (original) {
                original.reason = d.reason;
                return original;
            }
            return null;
        }).filter(x => x !== null);

    } catch (e) {
        console.warn("AI Fallback triggered", e);
        return candidates.slice(0, 3); // Fallback logic
    }
}

// 🟢 DATA FETCHERS

async function fetchShopifyData() {
    try {
        const res = await fetch(`https://${SHOPIFY_DOMAIN}/products.json?limit=250`);
        const json = await res.json();
        return json.products.map(p => ({
            id: p.id.toString(),
            source: 'shopify',
            brand: p.vendor,
            title: p.title,
            desc: p.tags ? p.tags.join(" ") : "", // 🟢 FIX: Safe navigation
            price: p.variants[0].price,
            link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
            image: p.images[0]?.src
        }));
    } catch { return []; }
}

async function fetchSheetData(url, defaultBrand) {
    if (!url) return [];
    try {
        const res = await fetch(url);
        const json = await res.json();
        
        // Handle Google Script Object Response
        return Object.entries(json).map(([sku, item]) => ({
            id: sku,
            source: 'catalog',
            brand: item.brand || defaultBrand, 
            title: item.desc,
            desc: `${item.pumpType} ${item.hp}HP ${item.category}`,
            price: item.rate,
            link: `https://wa.me/916304094177?text=I am interested in ${item.brand || defaultBrand} pump: ${item.desc} (${sku})`,
            image: null
        }));
    } catch (e) { 
        console.warn(`Fetch Error for ${defaultBrand}`, e); 
        return []; 
    }
}

// 🟢 RENDERER
function renderCards(list) {
    const container = document.getElementById('results-grid');
    container.innerHTML = "";
    
    list.forEach(p => {
        const isStock = p.source === 'shopify';
        
        // Badge Logic
        let badge = "CATALOG";
        let badgeColor = "bg-blue-100 text-blue-700";
        
        if (isStock) {
            badge = "IN STOCK";
            badgeColor = "bg-emerald-100 text-emerald-700";
        } else if (p.brand === 'Kirloskar' || p.brand === 'KOEL') {
            badge = "KOEL FACTORY";
            badgeColor = "bg-green-100 text-green-800";
        } else if (p.brand === 'KSB') {
            badge = "KSB FACTORY";
            badgeColor = "bg-orange-100 text-orange-800";
        }

        const btnTxt = isStock ? "BUY NOW" : "CHECK AVAILABILITY";
        const btnBg = isStock ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 hover:bg-black";
        const img = p.image || 'assets/img/motor-catalog.png';

        container.innerHTML += `
        <div class="product-card bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center animate-[fadeIn_0.5s]">
            <div class="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1 flex items-center justify-center">
                <img src="${img}" class="max-w-full max-h-full object-contain">
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${p.brand || 'Premium'}</div>
                        <h4 class="font-bold text-slate-800 text-sm leading-tight line-clamp-2">${p.title}</h4>
                        <div class="flex gap-2 mt-1 items-center">
                            <span class="${badgeColor} text-[10px] font-bold px-2 py-1 rounded">${badge}</span>
                        </div>
                    </div>
                    <div class="font-bold text-blue-600 text-right">₹${parseInt(p.price).toLocaleString()}</div>
                </div>
                <div class="text-[10px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                    ✨ ${p.reason || "AI Selected"}
                </div>
                <div class="mt-2">
                    <a href="${p.link}" target="_blank" class="block w-full ${btnBg} text-white text-center text-[10px] font-bold py-2 rounded-lg transition">${btnTxt}</a>
                </div>
            </div>
        </div>`;
    });
}

// 🟢 WIZARD HELPERS
window.selectSource = function(s) {
    window.EngineState.source = s;
    document.querySelectorAll('.wizard-step').forEach(e => e.classList.remove('active'));
    document.getElementById('step2').classList.add('active');
    document.getElementById('progressBar').style.width="66%";
    document.querySelectorAll('.spec-box').forEach(e => e.classList.add('hidden'));
    document.getElementById('opt-'+s).classList.remove('hidden');
}
window.goToStep = function(n) {
    document.querySelectorAll('.wizard-step').forEach(e => e.classList.remove('active'));
    document.getElementById('step'+n).classList.add('active');
    document.getElementById('progressBar').style.width=(n*33)+"%";
}
