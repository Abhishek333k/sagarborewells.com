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

// 🖥️ TERMINAL SYSTEM (Professional Overlay)
const Terminal = {
    el: document.getElementById('aiTerminal'),
    logs: document.getElementById('terminalLogs'),
    bar: document.getElementById('terminalProgress'),
    
    show: () => { document.getElementById('aiTerminal').style.display = 'flex'; },
    hide: () => { document.getElementById('aiTerminal').style.display = 'none'; },
    
    log: (msg, type = '') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="opacity-50">>></span> ${msg}`;
        const container = document.getElementById('terminalLogs');
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    },
    
    progress: (pct) => {
        document.getElementById('terminalProgress').style.width = `${pct}%`;
    }
};

// 🟢 MAIN ENGINE
window.runMotorEngine = async function() {
    const s = window.EngineState;
    const phaseEl = document.getElementById('inp-phase');
    s.phase = phaseEl ? parseInt(phaseEl.value) : 1;
    let head = 0;
    
    // Physics Logic
    if (s.source === 'borewell') {
        const depth = parseInt(document.getElementById('inp-depth').value || 0);
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

    // 1. START TERMINAL
    Terminal.show();
    Terminal.log("Initializing Neural Context...", "highlight");
    Terminal.progress(10);

    try {
        // 2. FETCH SECURE KEYS
        const [geminiKey, invConfig] = await Promise.all([
            getGeminiKey(),
            getInventoryConfig()
        ]);

        if (!geminiKey || !invConfig) throw new Error("Security Vault Access Denied (Missing Keys)");
        
        Terminal.log("Database Connection Established.");
        Terminal.progress(30);

        // 3. FETCH RAW DATA (Shopify + Sheet)
        Terminal.log("Aggregating Global Inventory...");
        const [shopifyData, sheetData] = await Promise.all([
            fetchShopifyData(),
            fetchSheetData(invConfig.ksb_db_url)
        ]);

        Terminal.log(`Analyzed ${shopifyData.length + sheetData.length} SKUs across 2 Databases.`);
        Terminal.progress(60);

        // 4. PRE-FILTER CANDIDATES (Save Token Cost)
        // We do a loose keyword filter so we don't send 2000 items to Gemini
        Terminal.log("Optimizing Data Vector...");
        const candidates = [...shopifyData, ...sheetData].filter(item => {
            const txt = (item.title + " " + item.desc).toLowerCase();
            if (s.source === 'borewell' && !txt.includes('bore') && !txt.includes('sub') && !txt.includes('v4') && !txt.includes('v6')) return false;
            if (s.source === 'openwell' && !txt.includes('open') && !txt.includes('mono')) return false;
            return true;
        }).slice(0, 40); // Top 40 Candidates

        // 5. ASK GEMINI (The Magic)
        Terminal.log("Generative Analysis in Progress...", "highlight");
        const recommendations = await askGemini(geminiKey, s, candidates);

        Terminal.log("Generating Recommendation Vector...");
        Terminal.progress(100);
        await new Promise(r => setTimeout(r, 1000)); // Cinematic Pause

        // 6. RENDER
        Terminal.hide();
        window.goToStep(3);
        
        const debugEl = document.getElementById('calcDebug');
        if(debugEl) debugEl.innerHTML = `TDH: <strong>${Math.round(head)} ft</strong> • ${s.phase} Phase`;

        if (recommendations.length === 0) {
            document.getElementById('no-match-msg').classList.remove('hidden');
        } else {
            document.getElementById('no-match-msg').classList.add('hidden');
            renderCards(recommendations);
        }

    } catch (e) {
        console.error(e);
        Terminal.log(`CRITICAL ERROR: ${e.message}`, "error");
        setTimeout(() => { Terminal.hide(); alert(e.message); }, 3000);
    }
};

// 🟢 AI BRAIN (Gemini API)
async function askGemini(apiKey, userSpecs, candidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `
    Role: Hydraulic Engineer.
    User Needs: ${userSpecs.source} pump, ${userSpecs.phase}-Phase power, capable of ${Math.round(userSpecs.calculatedHead)} ft Head.
    
    Task: Select the best 3-5 matches from the Candidate List below.
    Prioritize items from 'shopify' source first.
    
    Candidate List:
    ${JSON.stringify(candidates.map(c => ({ id: c.id, title: c.title, price: c.price, source: c.source })))}
    
    Output JSON ONLY:
    [
        { "id": "...", "reason": "Why this fits (max 10 words)" }
    ]
    `;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await res.json();
        const rawTxt = data.candidates[0].content.parts[0].text;
        const cleanJson = rawTxt.replace(/```json|```/g, '').trim();
        const ai decisions = JSON.parse(cleanJson);

        // Merge AI decisions back with full object data
        return ai_decisions.map(d => {
            const original = candidates.find(c => c.id === d.id);
            return original ? { ...original, reason: d.reason } : null;
        }).filter(x => x !== null);

    } catch (e) {
        console.warn("AI Brain Freeze, falling back to raw list", e);
        return candidates.slice(0, 3); // Fallback: Just return top 3 raw matches
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
            title: p.title,
            desc: p.tags.join(" "),
            price: p.variants[0].price,
            link: `https://${SHOPIFY_DOMAIN}/products/${p.handle}`,
            image: p.images[0]?.src
        }));
    } catch { return []; }
}

async function fetchSheetData(url) {
    if (!url) return [];
    try {
        const res = await fetch(url); // Your Google Script API
        const json = await res.json();
        
        // Convert Object { "SKU": {...} } to Array
        return Object.entries(json).map(([sku, item]) => ({
            id: sku,
            source: 'catalog',
            title: item.desc,
            desc: `${item.pumpType} ${item.hp}HP ${item.category}`,
            price: item.rate,
            link: `https://wa.me/916304094177?text=Availability Check: ${item.desc} (${sku})`,
            image: null
        }));
    } catch { return []; }
}

// 🟢 UI HELPERS
function renderCards(list) {
    const container = document.getElementById('results-grid');
    container.innerHTML = "";
    
    list.forEach(p => {
        const isStock = p.source === 'shopify';
        const badge = isStock ? "IN STOCK" : "CATALOG";
        const badgeColor = isStock ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700";
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
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${p.source}</div>
                        <h4 class="font-bold text-slate-800 text-sm leading-tight line-clamp-2">${p.title}</h4>
                        <div class="flex gap-2 mt-1 items-center">
                            <span class="${badgeColor} text-[10px] font-bold px-2 py-1 rounded">${badge}</span>
                        </div>
                    </div>
                    <div class="font-bold text-blue-600 text-right">₹${parseInt(p.price).toLocaleString()}</div>
                </div>
                <div class="text-[10px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                    🤖 ${p.reason || "Matched based on specs"}
                </div>
                <div class="mt-2">
                    <a href="${p.link}" target="_blank" class="block w-full ${btnBg} text-white text-center text-[10px] font-bold py-2 rounded-lg transition">${btnTxt}</a>
                </div>
            </div>
        </div>`;
    });
}

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
