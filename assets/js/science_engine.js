// FILENAME: assets/js/science_engine.js

if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

let sciMap;
// Store layers separately so we can toggle them
let activeLayers = {
    manual: [],
    lithologs: [],
    waterbodies: [],
    aquifers: []
};
let visibleLayer = 'manual'; // Default view

function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; 
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 11,
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
    });

    // Start by loading the Manual Zones (Default)
    loadLayer('geo_zones', 'manual');

    sciMap.addListener('click', (e) => { analyzeLocation(e.latLng); });
}

// 🟢 NEW: FUNCTION TO SWITCH LAYERS (Called by HTML Buttons)
function toggleLayer(layerName) {
    // 1. Update Buttons Visuals
    const allBtns = ['manual', 'lithologs', 'waterbodies', 'aquifers'];
    allBtns.forEach(name => {
        const btn = document.getElementById(`btn-${name}`);
        if(btn) btn.className = "px-3 py-1 text-xs font-bold rounded bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700";
    });
    const activeBtn = document.getElementById(`btn-${layerName}`);
    if(activeBtn) activeBtn.className = "px-3 py-1 text-xs font-bold rounded bg-blue-600 text-white border border-blue-500";

    // 2. Hide All Layers
    Object.keys(activeLayers).forEach(key => {
        activeLayers[key].forEach(obj => obj.setMap(null));
    });

    // 3. Show Selected Layer
    visibleLayer = layerName;
    
    // Map internal name to Firestore Collection Name
    const dbMap = {
        'manual': 'geo_zones',
        'lithologs': 'layer_lithologs',
        'waterbodies': 'layer_waterbodies',
        'aquifers': 'layer_aquifers'
    };

    // If we have data in memory, just show it. If not, fetch from DB.
    if(activeLayers[layerName].length > 0) {
        activeLayers[layerName].forEach(obj => obj.setMap(sciMap));
    } else {
        loadLayer(dbMap[layerName], layerName);
    }
}

// 🟢 NEW: GENERIC LOADER
function loadLayer(collection, key) {
    const statusBox = document.getElementById('scanStatus');
    statusBox.innerHTML = `<div class="text-xl animate-pulse text-blue-400">Loading ${key}...</div>`;

    // Limit to 300 to prevent browser crash
    sci_db.collection(collection).limit(300).get().then((snapshot) => {
        if(snapshot.empty) {
            statusBox.innerHTML = `<div class="text-xl">No Data Found</div>`;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            let mapObj;

            // Render Point (Litholog) vs Polygon (Others)
            if(data.lat && data.lng) {
                // It's a Point -> Draw Circle
                mapObj = new google.maps.Circle({
                    strokeColor: data.color, strokeOpacity: 0.8, strokeWeight: 2,
                    fillColor: data.color, fillOpacity: 0.5,
                    map: sciMap, center: {lat: data.lat, lng: data.lng}, radius: 80, 
                    clickable: false
                });
            } else if(data.coords) {
                // It's a Polygon -> Draw Shape
                mapObj = new google.maps.Polygon({
                    paths: data.coords,
                    strokeColor: data.color, strokeOpacity: 0.8, strokeWeight: 1,
                    fillColor: data.color, fillOpacity: 0.3,
                    map: sciMap, clickable: false
                });
            }
            
            if(mapObj) {
                mapObj.zoneData = data;
                activeLayers[key].push(mapObj);
            }
        });

        statusBox.innerHTML = `<div class="text-2xl font-bold text-white">Ready</div><p class="text-xs text-slate-400">Layer Loaded: ${key}</p>`;
    });
}

// 🟢 ANALYZE LOCATION (Updated for Layers)
function analyzeLocation(latLng) {
    let bestZone = null;
    let minArea = Infinity;
    
    // Only check objects in the CURRENT visible layer
    const currentObjects = activeLayers[visibleLayer];

    for (let obj of currentObjects) {
        // Polygon Check
        if (obj instanceof google.maps.Polygon) {
            if (google.maps.geometry.poly.containsLocation(latLng, obj)) {
                const area = google.maps.geometry.spherical.computeArea(obj.getPath());
                if (area < minArea) { minArea = area; bestZone = obj.zoneData; }
            }
        }
        // Circle Check (Distance)
        else if (obj instanceof google.maps.Circle) {
            const dist = google.maps.geometry.spherical.computeDistanceBetween(latLng, obj.getCenter());
            if (dist < obj.getRadius()) { bestZone = obj.zoneData; }
        }
    }

    const statusBox = document.getElementById('scanStatus');
    const dataBox = document.getElementById('scanData');
    
    if(window.currentMarker) window.currentMarker.setMap(null);
    window.currentMarker = new google.maps.Marker({ position: latLng, map: sciMap, animation: google.maps.Animation.DROP });

    if (bestZone) {
        // 1. Govt Badge
        let badge = "";
        if(bestZone.source && (bestZone.source.includes("Govt") || bestZone.source.includes("WRIS"))) {
            badge = `<div class="mt-2 bg-blue-900/50 border border-blue-500/30 p-2 rounded text-[10px] text-blue-200">
                <i class="ri-government-line"></i> Verified by Central Ground Water Board
                ${bestZone.waterLevel ? `<br>Sensor Depth: ${bestZone.waterLevel} meters` : ''}
            </div>`;
        }

        statusBox.innerHTML = `
            <div class="text-2xl font-bold mb-1" style="color:${bestZone.color}">${bestZone.name}</div>
            <p class="text-xs text-white">${bestZone.typeName}</p>
            ${badge}
        `;
        
        document.getElementById('zoneType').innerText = "Confirmed Scan";
        document.getElementById('zoneType').style.color = bestZone.color;
        
        let diff = "Moderate";
        if(bestZone.typeKey === 'rock') diff = "High (Blasting Req)";
        if(bestZone.typeKey === 'water') diff = "Low (Soft Soil)";
        document.getElementById('zoneDiff').innerText = diff;

        dataBox.classList.remove('hidden');
    } else {
        // 🟢 FALLBACK: CHECK REGIONAL RISK
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                let region = "Unknown";
                results[0].address_components.forEach(comp => {
                    if(comp.types.includes("administrative_area_level_2") || comp.types.includes("locality")) {
                        region = comp.long_name;
                    }
                });

                sci_db.collection('risk_map').doc(region.toLowerCase()).get().then(doc => {
                    if(doc.exists) {
                        const rData = doc.data();
                        statusBox.innerHTML = `
                            <div class="text-xl font-bold text-blue-400 mb-1">${region}</div>
                            <p class="text-xs text-white">CGWB Classification: <span class="font-bold text-yellow-400">${rData.status}</span></p>
                        `;
                        dataBox.classList.remove('hidden');
                        document.getElementById('zoneType').innerText = "Regional Data";
                        document.getElementById('zoneDiff').innerText = rData.status;
                    } else {
                        statusBox.innerHTML = `
                            <div class="text-xl font-bold text-slate-300 mb-1">${region}</div>
                            <p class="text-xs text-slate-500">Uncharted Sector.</p>
                        `;
                        dataBox.classList.add('hidden');
                    }
                });
            }
        });
    }
}

// ... (Rest of TDS/Motor functions unchanged) ...
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');
    const box = document.getElementById('tdsResult');
    if(pincode.length !== 6) return alert("Enter valid Pincode");
    box.classList.remove('hidden'); rangeTxt.innerText = "..."; noteTxt.innerText = "Scanning...";
    sci_db.collection('water_quality').doc(String(pincode)).get().then((doc) => {
        if (doc.exists) { const d = doc.data(); rangeTxt.innerText = `${d.min_tds} - ${d.max_tds}`; noteTxt.innerHTML = `<span class="text-emerald-400">● ${d.type || 'Verified'}</span>`; } 
        else { rangeTxt.innerText = "No Data"; noteTxt.innerText = "No data for this area."; }
    }).catch((e) => { rangeTxt.innerText = "Error"; noteTxt.innerText = "Connection Failed"; });
}

function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepthPump').value) || 0;
    let hp = 1.0; let stg = "10 Stages";
    if (depth > 150) { hp = 1.5; stg = "15 Stages"; }
    if (depth > 300) { hp = 3.0; stg = "20 Stages"; }
    if (depth > 500) { hp = 5.0; stg = "25 Stages"; }
    if (depth > 800) { hp = 7.5; stg = "35 Stages"; }
    if (depth > 1000) { hp = 10.0; stg = "40+ Stages"; }
    document.getElementById('motorHP').innerText = hp + " HP";
    document.getElementById('motorStage').innerText = stg;
    const shopBtn = document.getElementById('motorShopLink');
    if(depth > 0) { shopBtn.classList.remove('hidden'); shopBtn.href = `https://www.sagartraders.in/search?q=${encodeURIComponent(hp + "hp submersible pump")}`; } 
    else { shopBtn.classList.add('hidden'); }
}

function calcRisk() {
    const depth = parseInt(document.getElementById('sciDepthRisk').value) || 0;
    if(depth === 0) return;
    let risk = (depth / 1500) * 100;
    if(depth < 150) risk += 15; if(depth > 1000) risk += 25; 
    const bar = document.getElementById('riskBar'); const label = document.getElementById('riskLabel'); const desc = document.getElementById('riskDesc');
    const riskPct = Math.min(risk, 100); bar.style.width = riskPct + "%";
    if(riskPct < 40) { label.innerText = "LOW"; label.className = "text-2xl font-bold text-emerald-400"; bar.className = "h-full meter-fill relative bg-emerald-500"; desc.innerText = "Standard conditions."; } 
    else if(riskPct < 75) { label.innerText = "MODERATE"; label.className = "text-2xl font-bold text-yellow-400"; bar.className = "h-full meter-fill relative bg-yellow-500"; desc.innerText = "Casing likely required."; } 
    else { label.innerText = "HIGH"; label.className = "text-2xl font-bold text-red-500 animate-pulse"; bar.className = "h-full meter-fill relative bg-red-500"; desc.innerText = "High cost / complexity."; }
}
