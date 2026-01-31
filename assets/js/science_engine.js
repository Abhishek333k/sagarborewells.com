// FILENAME: assets/js/science_engine.js

// --- 1. CONFIG & DATA ---
const KNOWN_ZONES = [
    {
        name: "Mangalagiri Hill Zone",
        type: "Hard Rock",
        color: "#ef4444", // Red
        coords: [
            { lat: 16.445, lng: 80.550 },
            { lat: 16.448, lng: 80.560 },
            { lat: 16.440, lng: 80.565 },
            { lat: 16.435, lng: 80.555 }
        ]
    },
    {
        name: "Krishna River Basin",
        type: "River Bed / Silt",
        color: "#10b981", // Green
        coords: [
            { lat: 16.480, lng: 80.600 },
            { lat: 16.490, lng: 80.620 },
            { lat: 16.470, lng: 80.630 },
            { lat: 16.460, lng: 80.610 }
        ]
    }
];

const MOCK_TDS_DATA = {
    '522': { min: 400, max: 1200, type: "Hard / High Mineral" },
    '520': { min: 200, max: 600, type: "Sweet / River Bed" },
    'default': { min: 300, max: 900, type: "Standard Profile" }
};

// --- 2. MAP ENGINE ---
let sciMap;
let mapPolygons = [];

function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; 
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 12,
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
    });

    // Draw Polygons
    KNOWN_ZONES.forEach(zone => {
        const poly = new google.maps.Polygon({
            paths: zone.coords,
            strokeColor: zone.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: zone.color,
            fillOpacity: 0.35,
            map: sciMap
        });
        poly.zoneData = zone;
        mapPolygons.push(poly);
    });

    // Click Listener
    sciMap.addListener('click', (e) => {
        analyzeLocation(e.latLng);
    });
}

function analyzeLocation(latLng) {
    let foundZone = null;
    for (let poly of mapPolygons) {
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            foundZone = poly.zoneData;
            break;
        }
    }

    const statusEl = document.getElementById('zoneStatus');
    if (foundZone) {
        statusEl.innerText = `${foundZone.name} (${foundZone.type})`;
        statusEl.style.color = foundZone.color;
        new google.maps.Marker({ position: latLng, map: sciMap, animation: google.maps.Animation.DROP });
    } else {
        statusEl.innerText = "Unknown Zone (Standard Rates Apply)";
        statusEl.style.color = "#94a3b8";
    }
}

// --- 3. TDS CALCULATOR ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    noteTxt.innerText = "Analyzing...";

    setTimeout(() => {
        const prefix = pincode.substring(0, 3);
        const data = MOCK_TDS_DATA[prefix] || MOCK_TDS_DATA['default'];
        rangeTxt.innerText = `${data.min} - ${data.max}`;
        noteTxt.innerHTML = `<span class="${data.min > 500 ? 'text-orange-400' : 'text-emerald-400'}">● ${data.type}</span>`;
    }, 600);
}

// --- 4. MOTOR & RISK ENGINE ---
function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepth').value) || 0;
    
    // Motor Logic
    let hp = "1.0 HP";
    let stg = "10 Stages";
    if (depth > 150) { hp = "1.5 HP"; stg = "15 Stages"; }
    if (depth > 300) { hp = "3.0 HP"; stg = "20 Stages"; }
    if (depth > 500) { hp = "5.0 HP"; stg = "25 Stages"; }
    if (depth > 800) { hp = "7.5 HP"; stg = "35 Stages"; }
    if (depth > 1000) { hp = "10 HP"; stg = "40+ Stages"; }

    document.getElementById('motorHP').innerText = hp;
    document.getElementById('motorStage').innerText = stg;

    // Risk Logic Trigger
    calcRisk(depth);
}

function calcRisk(depth) {
    if(depth === 0) return;

    // Base Risk Curve
    let risk = (depth / 1500) * 100;
    if(depth < 150) risk += 10; // Shallow collapse
    if(depth > 900) risk += 20; // Deep pressure

    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskLabel');
    const desc = document.getElementById('riskDesc');

    bar.style.width = Math.min(risk, 100) + "%";
    
    if(risk < 40) {
        label.innerText = "LOW RISK";
        label.className = "text-3xl font-black text-emerald-400 tracking-tight";
        desc.innerText = "Standard drilling conditions expected.";
        bar.className = "h-full meter-fill relative bg-emerald-500";
    } else if(risk < 70) {
        label.innerText = "MODERATE";
        label.className = "text-3xl font-black text-yellow-400 tracking-tight";
        desc.innerText = "Casing requirement likely. Silt/boulders possible.";
        bar.className = "h-full meter-fill relative bg-yellow-500";
    } else {
        label.innerText = "HIGH RISK";
        label.className = "text-3xl font-black text-red-500 tracking-tight animate-pulse";
        desc.innerText = "Complex geology. Heavy duty rig recommended.";
        bar.className = "h-full meter-fill relative bg-red-500";
    }
}
