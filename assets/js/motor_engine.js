// FILENAME: assets/js/motor_engine.js

// 🟢 1. THE DATABASE (Inventory)
// Can be moved to Firestore later. For now, a robust JSON object.
const MOTOR_DB = [
    // --- SUBMERSIBLES (BOREWELL) ---
    { id: 'm1', type: 'borewell', brand: 'Texmo', model: 'T-304', hp: 1, phase: 1, stages: 10, max_head: 150, discharge: 'High', price: 12500, dia: 4 },
    { id: 'm2', type: 'borewell', brand: 'CRI', model: 'CRI-4R', hp: 1.5, phase: 1, stages: 15, max_head: 250, discharge: 'Med', price: 15800, dia: 4 },
    { id: 'm3', type: 'borewell', brand: 'Taro', model: 'V6-50', hp: 5, phase: 3, stages: 8, max_head: 350, discharge: 'High', price: 28000, dia: 6 },
    { id: 'm4', type: 'borewell', brand: 'Texmo', model: 'V6-High', hp: 7.5, phase: 3, stages: 10, max_head: 500, discharge: 'High', price: 34500, dia: 6 },
    { id: 'm5', type: 'borewell', brand: 'Kirloskar', model: 'K-Deep', hp: 2, phase: 1, stages: 25, max_head: 400, discharge: 'Low', price: 21000, dia: 4 },
    
    // --- MONOBLOCKS (OPEN WELL) ---
    { id: 'o1', type: 'openwell', brand: 'Texmo', model: 'Mono-1', hp: 1, phase: 1, max_head: 60, discharge: 'High', price: 8500 },
    { id: 'o2', type: 'openwell', brand: 'CRI', model: 'Open-Pro', hp: 1.5, phase: 1, max_head: 90, discharge: 'Med', price: 11200 },
    
    // --- SEWAGE ---
    { id: 's1', type: 'sewage', brand: 'Kirloskar', model: 'Cutter-1', hp: 1, phase: 1, max_head: 30, discharge: 'Mud', price: 9500 },
];

// 🟢 2. STATE MANAGEMENT
let userSelection = {
    source: '',
    depth: 0,
    dia: 6,
    phase: 1
};

// 🟢 3. WIZARD LOGIC
function selectSource(source) {
    userSelection.source = source;
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    // Update Progress
    document.getElementById('progressBar').style.width = "66%";

    // Toggle Borewell specific inputs
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

// 🟢 4. THE RECOMMENDATION ENGINE
function runEngine() {
    // A. Gather Data
    userSelection.depth = parseInt(document.getElementById('inputDepth').value);
    userSelection.phase = parseInt(document.getElementById('inputPhase').value);
    
    if (userSelection.source === 'borewell') {
        const dias = document.getElementsByName('dia');
        for(let d of dias) if(d.checked) userSelection.dia = parseInt(d.value);
    }

    if (!userSelection.depth) return alert("Please enter depth");

    // B. Physics Calculation (Head + Friction Buffer)
    // Rule of thumb: Add 20% extra head for friction loss in pipes/bends
    const calculatedHead = userSelection.depth * 1.2;

    // C. The "AI" Matcher
    const matches = MOTOR_DB.filter(motor => {
        // 1. Match Source Type
        if (motor.type !== userSelection.source) return false;
        
        // 2. Match Phase (Power)
        if (motor.phase !== userSelection.phase) return false;

        // 3. Match Head Capability (Motor must handle AT LEAST the calc head)
        if (motor.max_head < calculatedHead) return false;

        // 4. Match Diameter (Only for Borewells)
        if (userSelection.source === 'borewell' && motor.dia > userSelection.dia) return false; // Can't fit 6" pump in 4" hole

        return true;
    });

    // D. Render Results
    const container = document.getElementById('resultsContainer');
    const debug = document.getElementById('calcDebug');
    
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('progressBar').style.width = "100%";

    debug.innerHTML = `Calculated Load: <strong>${Math.round(calculatedHead)} ft</strong> (Depth + Friction)`;

    container.innerHTML = "";

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10">
                <div class="text-4xl mb-2">😓</div>
                <h3 class="font-bold text-slate-700">No Direct Match Found</h3>
                <p class="text-sm text-slate-500">Your requirement (${userSelection.depth}ft on ${userSelection.phase}-Phase) is highly specific.</p>
                <a href="contact.html" class="inline-block mt-4 text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded-lg">Contact Engineering Team</a>
            </div>
        `;
        return;
    }

    // Sort by Price (Low to High)
    matches.sort((a,b) => a.price - b.price);

    matches.forEach((m, index) => {
        // Tag Logic
        let tag = "";
        if (index === 0) tag = `<span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">BEST VALUE</span>`;
        if (m.max_head > calculatedHead + 100) tag = `<span class="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded">HIGH POWER</span>`;

        const card = `
            <div class="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl hover:border-blue-500 transition shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">
                        ${m.brand.substring(0,3).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 flex items-center gap-2">${m.brand} ${m.model} ${tag}</h4>
                        <p class="text-xs text-slate-500 font-mono mt-0.5">${m.hp}HP • ${m.stages ? m.stages + ' Stage •' : ''} Max ${m.max_head}ft</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-blue-600">₹${m.price.toLocaleString()}</div>
                    <button onclick="alert('Enquiry sent for ${m.model}')" class="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-wider">Enquire</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
