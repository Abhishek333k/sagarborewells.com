// FILENAME: assets/js/science_engine.js

// --- 1. CONFIG & DATA ---
// Fallback data if Firebase is empty (The "Vague Local Knowledge")
const MOCK_TDS_DATA = {
    '522': { min: 400, max: 900, type: "Hard / High Mineral" }, // Guntur/Mangalagiri Region
    '520': { min: 200, max: 600, type: "Sweet / River Bed" },   // Vijayawada Region
    'default': { min: 300, max: 800, type: "Standard Profile" }
};

// --- 2. TDS CALCULATOR (Robust) ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsBox');
    const valText = document.getElementById('tdsVal');
    const msgText = document.getElementById('tdsMsg');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    // UI Animation
    box.classList.remove('hidden');
    valText.innerText = "Scanning...";
    msgText.innerText = "Querying Hydro-Database...";
    box.classList.add('animate-pulse');

    // Simulate "Processing Delay" for effect
    setTimeout(() => {
        box.classList.remove('animate-pulse');
        
        // Logic: Check Mock Data based on first 3 digits
        const prefix = pincode.substring(0, 3);
        const data = MOCK_TDS_DATA[prefix] || MOCK_TDS_DATA['default'];

        // Inject Result
        valText.innerText = `${data.min} - ${data.max} PPM`;
        msgText.innerHTML = `<span class="${data.min > 500 ? 'text-orange-400' : 'text-emerald-400'}">● ${data.type}</span>`;
    }, 800);
}

// --- 3. RISK & MOTOR ENGINE (Optimized) ---
const slider = document.getElementById('riskSlider');
if(slider) {
    slider.addEventListener('input', function() {
        const depth = parseInt(this.value);
        document.getElementById('depthLabel').innerText = depth;
        updateRiskAndMotor(depth);
    });
}

function updateRiskAndMotor(depth) {
    // A. MOTOR LOGIC (Physics Estimate)
    let hp = "1.0 HP";
    if (depth > 150) hp = "1.5 HP";
    if (depth > 250) hp = "3.0 HP";
    if (depth > 400) hp = "5.0 HP";
    if (depth > 600) hp = "7.5 HP";
    if (depth > 900) hp = "10 HP+";
    
    document.getElementById('recMotor').innerText = hp;

    // B. RISK LOGIC
    // Base Risk increases with depth
    let risk = (depth / 1500) * 100; 
    
    // Add "Vague Knowledge" Curve:
    // Drilling 300-500ft is usually safest. Very shallow or very deep is risky.
    if(depth < 200) risk += 10; // Silt collapse risk
    if(depth > 800) risk += 20; // Boulder risk

    // Clamp 0-100
    risk = Math.min(100, Math.max(10, risk));

    // UI Update
    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskText');

    bar.style.width = risk + "%";

    // Dynamic Color
    bar.className = `h-full meter-fill relative transition-all duration-300 ${
        risk < 40 ? 'bg-emerald-500' : 
        risk < 70 ? 'bg-yellow-500' : 'bg-red-500'
    }`;

    // Text Label
    if(risk < 40) {
        label.innerText = "SAFE";
        label.className = "text-xl font-bold text-emerald-400";
    } else if(risk < 70) {
        label.innerText = "MODERATE";
        label.className = "text-xl font-bold text-yellow-400";
    } else {
        label.innerText = "HIGH RISK";
        label.className = "text-xl font-bold text-red-500 animate-pulse";
    }
}

// --- 4. MAP INTELLIGENCE (The "Vague Data" Layer) ---
let sciMap;
function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; // Mangalagiri
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 12,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        zoomControl: true
    });

    // Draw a "Reference Circle" (e.g., The known rocky zone)
    new google.maps.Circle({
        strokeColor: "#ef4444",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#ef4444",
        fillOpacity: 0.15,
        map: sciMap,
        center: startLoc,
        radius: 3000 // 3km radius around office is "Rocky" (Hypothetically)
    });

    // Click Event to Simulate Analysis
    sciMap.addListener('click', (e) => {
        analyzePoint(e.latLng);
    });
}

function analyzePoint(latLng) {
    // 1. Calculate distance from "Rocky Center" (Mangalagiri)
    const office = new google.maps.LatLng(16.4410, 80.5520);
    const dist = google.maps.geometry.spherical.computeDistanceBetween(latLng, office);

    // 2. "Vague Knowledge" Logic
    let terrain = "Alluvial Soil";
    let water = "High (150ft)";
    let rock = "Soft / Medium";

    if(dist < 3000) { // Within 3km of Mangalagiri
        terrain = "Rocky / Hilly";
        water = "Moderate (400ft+)";
        rock = "Hard Granite";
    } else if (dist > 10000) { // Far away (Towards Vijayawada river)
        terrain = "River Basin";
        water = "Very High (80ft)";
        rock = "Silt / Clay";
    }

    // 3. Update UI
    document.getElementById('mapTerrain').innerText = terrain;
    document.getElementById('mapWater').innerText = water;
    document.getElementById('mapRock').innerText = rock;

    // Visual Marker
    new google.maps.Marker({
        position: latLng,
        map: sciMap,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
}

// Initial Run
updateRiskAndMotor(300);
