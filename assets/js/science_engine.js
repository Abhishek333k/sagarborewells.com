// FILENAME: assets/js/science_engine.js

// --- 1. CONFIG & DATA ---

// 🟢 DATA: Define your Polygons here.
// You can use tools like geojson.io to draw shapes and copy the coordinates.
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

// --- 2. MAP ENGINE (POLYGON LOGIC) ---
let sciMap;
let mapPolygons = [];

function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; // Mangalagiri
    
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 12,
        mapTypeId: 'hybrid', // Hybrid looks more "Satellite Science"
        disableDefaultUI: true,
        styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] } // Clean map
        ]
    });

    // 🟢 DRAW POLYGONS
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
        
        // Attach data to the object for retrieval later
        poly.zoneData = zone; 
        mapPolygons.push(poly);
    });

    // 🟢 CLICK LISTENER
    sciMap.addListener('click', (e) => {
        analyzeLocation(e.latLng);
    });
}

function analyzeLocation(latLng) {
    let foundZone = null;

    // Check every polygon
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
        
        // Add a marker to show where they clicked
        new google.maps.Marker({
            position: latLng,
            map: sciMap,
            animation: google.maps.Animation.DROP
        });
    } else {
        statusEl.innerText = "Unknown Zone (Standard Rates Apply)";
        statusEl.style.color = "#94a3b8"; // Slate-400
    }
}

// --- 3. TDS CALCULATOR ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    // UI Reset
    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    noteTxt.innerText = "Analyzing Aquifer Data...";
    
    // Simulate API Call
    setTimeout(() => {
        const prefix = pincode.substring(0, 3);
        const data = MOCK_TDS_DATA[prefix] || MOCK_TDS_DATA['default'];

        rangeTxt.innerText = `${data.min} - ${data.max}`;
        noteTxt.innerHTML = `<span class="${data.min > 500 ? 'text-orange-400' : 'text-emerald-400'}">● ${data.type}</span>`;
    }, 600);
}

// --- 4. RISK & MOTOR ENGINE ---
const slider = document.getElementById('riskSlider');
if(slider) {
    slider.addEventListener('input', function() {
        const depth = parseInt(this.value);
        document.getElementById('depthLabel').innerText = depth;
        
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

        // Risk Logic
        let risk = (depth / 1500) * 100;
        if(depth < 150) risk += 10; // Shallow collapse risk
        if(depth > 900) risk += 20; // Deep pressure risk

        const bar = document.getElementById('riskBar');
        const label = document.getElementById('riskLabel');

        bar.style.width = Math.min(risk, 100) + "%";
        
        if(risk < 40) {
            label.innerText = "LOW";
            label.className = "text-xl font-bold text-emerald-400";
            bar.className = "h-full bg-emerald-500 transition-all duration-300";
        } else if(risk < 70) {
            label.innerText = "MODERATE";
            label.className = "text-xl font-bold text-yellow-400";
            bar.className = "h-full bg-yellow-500 transition-all duration-300";
        } else {
            label.innerText = "HIGH";
            label.className = "text-xl font-bold text-red-500";
            bar.className = "h-full bg-red-500 transition-all duration-300";
        }
    });
}

// Init
if(document.getElementById('depthLabel')) {
    slider.dispatchEvent(new Event('input'));
}
