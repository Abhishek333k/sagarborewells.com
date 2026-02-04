// FILENAME: assets/js/motor_engine.js

// 🟢 CONFIGURATION
// Replace this with your actual Shopify URL
const SHOPIFY_DOMAIN = "sagartraders.in"; 
// To make this work, create a collection in Shopify named "Motors" and get its handle (e.g., 'motors' or 'all')
const COLLECTION_HANDLE = "all"; // Use 'all' to search everything, or a specific collection handle

// 🟢 STATE MANAGEMENT
let userSelection = {
    source: '',
    depth: 0,
    dia: 6,
    phase: 1
};

// 🟢 WIZARD LOGIC
function selectSource(source) {
    userSelection.source = source;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('progressBar').style.width = "66%";

    if(source !== 'borewell') {
        document.getElementById('borewellOptions').style.display = 'none';
    } else {
        document.getElementById('borewellOptions').style.display = 'block';
    }
}

function prevStep() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('progressBar').style.width = "33%";
}

// 🟢 THE ENGINE
async function runEngine() {
    // 1. GATHER INPUTS
    const depthInput = document.getElementById('inputDepth').value;
    userSelection.depth = parseInt(depthInput);
    userSelection.phase = parseInt(document.getElementById('inputPhase').value);
    
    if (userSelection.source === 'borewell') {
        const dias = document.getElementsByName('dia');
        for(let d of dias) if(d.checked) userSelection.dia = parseInt(d.value);
    }

    if (!userSelection.depth) return alert("Please enter total head/depth");

    // 2. UI TRANSITION
    const btn = document.getElementById('findBtn');
    btn.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Analyzing...`;
    btn.disabled = true;

    // 3. PHYSICS CALCULATION
    // Add 25% safety margin for friction losses in bends/pipes
    const requiredHead = userSelection.depth * 1.25; 

    // 4. FETCH DATA FROM SHOPIFY
    try {
        const products = await fetchShopifyProducts();
        const matches = filterProducts(products, requiredHead);
        renderResults(matches, requiredHead);
        
        // Move to next step
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
        document.getElementById('progressBar').style.width = "100%";
        
    } catch (error) {
        console.error(error);
        alert("Error connecting to inventory. Please try again.");
    } finally {
        btn.innerHTML = `Find Matching Motors`;
        btn.disabled = false;
    }
}

// 🟢 SHOPIFY FETCH LOGIC
async function fetchShopifyProducts() {
    // Using the public products.json endpoint
    // Limit set to 250 (max allowed per page)
    const url = `https://${SHOPIFY_DOMAIN}/products.json?limit=250`;
    const response = await fetch(url);
    const data = await response.json();
    return data.products;
}

// 🟢 AI FILTERING LOGIC
function filterProducts(products, reqHead) {
    return products.filter(p => {
        // A. Convert Tags to Object for easy reading
        // Expecting tags like: "type:borewell", "head:400", "phase:1", "dia:6"
        let specs = {};
        p.tags.forEach(tag => {
            if(tag.includes(':')) {
                const [key, val] = tag.split(':');
                specs[key.trim().toLowerCase()] = val.trim().toLowerCase();
            }
        });

        // B. FILTER: Source Type
        // We look for 'type' tag matching selection (borewell/openwell)
        if (specs.type !== userSelection.source) return false;

        // C. FILTER: Phase
        // If phase tag exists, it must match. If missing, we assume universal (risky, so best to tag all)
        if (specs.phase && parseInt(specs.phase) !== userSelection.phase) return false;

        // D. FILTER: Diameter (Borewell only)
        if (userSelection.source === 'borewell' && specs.dia) {
            // Product diameter must be <= User hole diameter
            // e.g. 4" pump fits in 6" hole (TRUE), 6" pump in 4" hole (FALSE)
            if (parseInt(specs.dia) > userSelection.dia) return false;
        }

        // E. FILTER: Head (The Core Physics)
        // Motor Max Head must be >= Required Head
        if (specs.head) {
            const motorMaxHead = parseInt(specs.head);
            if (motorMaxHead < reqHead) return false;
        } else {
            return false; // Safety: If no head tag, ignore product
        }

        return true;
    });
}

// 🟢 RENDER LOGIC
function renderResults(matches, reqHead) {
    const container = document.getElementById('resultsContainer');
    const debug = document.getElementById('calcDebug');
    
    debug.innerHTML = `Physics Load: <strong>${Math.round(reqHead)} ft</strong> (Depth + Friction)`;
    container.innerHTML = "";

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10">
                <div class="text-4xl mb-2">🤷‍♂️</div>
                <h3 class="font-bold text-slate-700">No Perfect Match Found</h3>
                <p class="text-sm text-slate-500 mb-4">Your requirement (${Math.round(reqHead)}ft Head) is unique or out of stock.</p>
                <a href="https://${SHOPIFY_DOMAIN}" target="_blank" class="text-blue-600 font-bold hover:underline">Browse All Motors -></a>
            </div>
        `;
        return;
    }

    // Sort by price (Cheapest first)
    matches.sort((a, b) => parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price));

    matches.forEach((p, index) => {
        const variant = p.variants[0];
        const image = p.images.length > 0 ? p.images[0].src : 'assets/img/motor-placeholder.png';
        
        // Dynamic Badge
        let badge = "";
        if(index === 0) badge = `<span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">BEST VALUE</span>`;
        
        // Find Specs for display
        const headTag = p.tags.find(t => t.includes('head:')) || "";
        const maxHead = headTag.split(':')[1] || "?";

        container.innerHTML += `
            <div class="product-card bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center">
                <div class="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-slate-100">
                    <img src="${image}" class="w-full h-full object-contain" alt="${p.title}">
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm md:text-base leading-tight">${p.title}</h4>
                            <p class="text-xs text-slate-500 mt-1">Max Head: ${maxHead}ft ${badge}</p>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-blue-600">₹${parseInt(variant.price).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="https://${SHOPIFY_DOMAIN}/products/${p.handle}" target="_blank" class="block w-full bg-slate-900 text-white text-center text-xs font-bold py-2 rounded-lg hover:bg-blue-600 transition">
                            VIEW & BUY
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}
