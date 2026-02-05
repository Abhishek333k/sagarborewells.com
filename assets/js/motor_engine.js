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

// 🛡️ SECURITY: Basic HTML Sanitizer to prevent XSS from Sheet data
const escapeHTML = (str) => {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// 🖥️ TERMINAL SYSTEM (Visual Feedback)
// Cache DOM elements to improve performance
const DOM = {
    terminal: document.getElementById('aiTerminal'),
    logs: document.getElementById('terminalLogs'),
    progress: document.getElementById('terminalProgress'),
    debug: document.getElementById('calcDebug'),
    grid: document.getElementById('results-grid'),
    noMatch: document.getElementById('no-match-msg'),
    phase: document.getElementById('inp-phase')
};

const Terminal = {
    log: (msg, type = '') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="opacity-50">>></span> ${escapeHTML(msg)}`;
        if (DOM.logs) {
            DOM.logs.appendChild(line);
            DOM.logs.scrollTop = DOM.logs.scrollHeight;
        }
    },
    progress: (pct) => {
        if (DOM.progress) DOM.progress.style.width = `${pct}%`;
    },
    show: () => { if (DOM.terminal) DOM.terminal.style.display = 'flex'; },
    hide: () => { if (DOM.terminal) DOM.terminal.style.display = 'none'; }
};

// 🟢 MAIN ENGINE EXECUTION
window.runMotorEngine = async function() {
    const s = window.EngineState;
    s.phase = DOM.phase ? parseInt(DOM.phase.value) : 1;
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
            throw new Error("Security Modules Not Loaded (Check config.js)");
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
        
        const [shopifyData, ksbData, koelData] = await Promise.all([
            fetchShopifyData(),
            fetchSheetData(invConfig.ksb_db_url, 'KSB'),
            fetchSheetData(invConfig.kirloskar_db_url, 'KOEL')
        ]);

        const totalItems = shopifyData.length + ksbData.length + koelData.length;
        Terminal.log(`Analyzed ${totalItems} SKUs across 3 Databases.`);
        Terminal.progress(50);

        // 5. HARD FILTER (Physics & Type & BLACKLIST)
        Terminal.log(`Applying Physics Constraints (Head > ${Math.round(head)}ft)...`);
        
        const allCandidates = [...shopifyData, ...ksbData, ...koelData];
        
        // ⛔ BLACKLIST (Remove Accessories)
        const BLACKLIST = ['panel', 'starter', 'cable', 'wire', 'rope', 'pipe', 'fan', 'service', 'repair', 'kit', 'spares', 'accessories', 'control', 'box'];

        const candidates = allCandidates.filter(item => {
            const txt = (item.title + " " + item.desc).toLowerCase();
            
            // Blacklist Check
            if (BLACKLIST.some(badWord => txt.includes(badWord))) return false;

            // Type Check
            if (s.source === 'borewell' && !txt.includes('sub') && !txt.includes('bore') && !txt.includes('v4') && !txt.includes('v6')) return false;
            if (s.source === 'openwell' && !txt.includes('open') && !txt.includes('mono')) return false;
            
            // Phase Check (Strict)
            const is3Phase = txt.includes('3 phase') || txt.includes('3phase') || txt.includes('3 ph');
            if (s.phase === 3 && !is3Phase) return false;
            if (s.phase === 1 && is3Phase) return false;

            // Borewell Dia Check (Don't put 6" pump in 4" hole)
            if (s.source === 'borewell' && s.dia === 4 && (txt.includes('v6') || txt.includes('6 inch'))) return false;

            return true;
        }).slice(0, 60); // Limit to top 60 candidates for Gemini input

        Terminal.log(`${candidates.length} Viable Candidates Identified.`, "highlight");
        
        // 6. AI DECISION (Gemini)
        let finalResults = [];
        if (candidates.length > 0) {
            Terminal.log("Requesting SBW Flash Analysis...");
            Terminal.progress(75);
            // Pass the API Key strictly for this call. 
            // IMPORTANT: Restrict this key in Google Cloud Console to your domain.
            finalResults = await askGemini(geminiKey, s, candidates);
        }

        Terminal.log("Generating Recommendation Vectors...");
        Terminal.progress(100);
        await new Promise(r => setTimeout(r, 800)); // Cinematic delay

        // 7. RENDER RESULTS
        Terminal.hide();
        window.goToStep(3);
        
        if(DOM.debug) DOM.debug.innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> • ${s.phase} Phase`;

        if (finalResults.length === 0) {
            if(DOM.noMatch) DOM.noMatch.classList.remove('hidden');
        } else {
            if(DOM.noMatch) DOM.noMatch.classList.add('hidden');
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
    
    // Minify data to save tokens (Gemini charges per character)
    const miniList = candidates.map(c => ({ 
        id: c.id, 
        name: c.title, 
        price: c.price,
        source: c.source 
    }));

    const prompt = `
    Role: Expert Hydraulic Engineer.
    User Needs: ${userSpecs.source} WATER PUMP, ${userSpecs.phase}-Phase, Head requirement: ${Math.round(userSpecs.calculatedHead)} ft.
    
    Task: Select the best 10-15 matches from this list.
    
    🚨 CRITICAL RULES:
    1. ONLY recommend WATER PUMPS. 
    2. DO NOT recommend Control Panels, Starters, Fans, Cables, or Accessories.
    3. If Head is mentioned in title, it MUST be > ${Math.round(userSpecs.calculatedHead)}.
    4. Prioritize: Technical Fit > In Stock ('shopify') > Price.
    
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
        const aiDecisions = JSON.parse(cleanJson);

        // Merge AI Reasoning with Full Data Objects
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
        // Fallback: Return top 15 raw matches based on simple physics filter
        return candidates.slice(0, 15);
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
            brand: p.vendor || "Store",
            title: p.title,
            desc: p.tags ? p.tags.join(" ") : "", 
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
        return Object.entries(json).map(([sku, item]) => {
            // 🛡️ LOGIC FIX: Ensure Brand is never undefined in the object
            // This prevents "undefined" appearing in the WhatsApp link
            const safeBrand = item.brand || defaultBrand || "Premium";
            const safeTitle = item.desc || "Water Pump";
            
            return {
                id: sku,
                source: 'catalog',
                brand: safeBrand, 
                title: safeTitle,
                desc: `${item.pumpType} ${item.hp}HP ${item.category}`,
                price: item.rate,
                // 🟢 UPDATED: Cleaner Message
                link: `https://wa.me/916304094177?text=I am interested in ${safeBrand} pump: ${safeTitle} (${sku})`,
                image: null
            };
        });
    } catch (e) { 
        console.warn(`Fetch Error for ${defaultBrand}`, e); 
        return []; 
    }
}

// 🟢 RENDERER
function renderCards(list) {
    if (!DOM.grid) return;
    DOM.grid.innerHTML = "";
    
    // 🎨 Fallback Image (Blueprint Style)
    const FALLBACK_IMG = 'assets/img/blueprint-placeholder.png'; 

    list.forEach(p => {
        const isStock = p.source === 'shopify';
        
        let badge = "DIRECT";
        let badgeColor = "bg-blue-100 text-blue-700";
        
        const brandUp = (p.brand || "").toUpperCase();

        if (isStock) {
            badge = "IN STOCK";
            badgeColor = "bg-emerald-100 text-emerald-700";
        } else if (brandUp.includes('KIRLOSKAR') || brandUp.includes('KOEL')) {
            badge = "KOEL DIRECT";
            badgeColor = "bg-green-100 text-green-800";
        } else if (brandUp.includes('KSB')) {
            badge = "KSB DIRECT";
            badgeColor = "bg-orange-100 text-orange-800";
        }

        const btnTxt = isStock ? "BUY NOW" : "CHECK AVAILABILITY";
        const btnBg = isStock ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 hover:bg-black";
        
        // 🛡️ Logic: Use product image if exists, otherwise use fallback
        const displayImg = p.image ? p.image : FALLBACK_IMG;
        
        // Sanitize outputs for display
        const safeTitle = escapeHTML(p.title);
        const safeReason = escapeHTML(p.reason || "AI Selected");
        const safeBrand = escapeHTML(p.brand || "Premium");

        DOM.grid.innerHTML += `
        <div class="product-card bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center animate-[fadeIn_0.5s]">
            <div class="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1 flex items-center justify-center overflow-hidden relative">
                <img src="${displayImg}" 
                     class="max-w-full max-h-full object-contain" 
                     alt="${safeTitle}"
                     onerror="this.onerror=null; this.src='${FALLBACK_IMG}';">
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${safeBrand}</div>
                        <h4 class="font-bold text-slate-800 text-sm leading-tight line-clamp-2">${safeTitle}</h4>
                        <div class="flex gap-2 mt-1 items-center">
                            <span class="${badgeColor} text-[10px] font-bold px-2 py-1 rounded">${badge}</span>
                        </div>
                    </div>
                    <div class="font-bold text-blue-600 text-right">₹${parseInt(p.price).toLocaleString()}</div>
                </div>
                <div class="text-[10px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                    ✨ ${safeReason}
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
    const opt = document.getElementById('opt-'+s);
    if(opt) opt.classList.remove('hidden');
}

window.goToStep = function(n) {
    document.querySelectorAll('.wizard-step').forEach(e => e.classList.remove('active'));
    const step = document.getElementById('step'+n);
    if(step) step.classList.add('active');
    document.getElementById('progressBar').style.width=(n*33)+"%";
}
