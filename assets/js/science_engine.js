// FILENAME: assets/js/science_engine.js

// --- 1. SETUP FIREBASE ---
if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

// --- 2. MAP ENGINE (STRICT REAL-TIME) ---
let sciMap;
let mapPolygons = []; // Stores the actual Google Maps Polygon objects

function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; // Mangalagiri
    
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 12,
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
    });

    // 🟢 FETCH ONLY REAL ZONES
    loadRealZones();

    // Click Listener for Analysis
    sciMap.addListener('click', (e) => {
        analyzeLocation(e.latLng);
    });
}

function loadRealZones() {
    sci_db.collection('geo_zones').get().then((snapshot) => {
        if(snapshot.empty) {
            console.log("System: No geological zones mapped yet.");
            return;
        }
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Draw Polygon on Map
            const poly = new google.maps.Polygon({
                paths: data.coords,
                strokeColor: data.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: data.color,
                fillOpacity: 0.3, 
                map: sciMap,
                clickable: false 
            });

            // Attach Data to the Polygon Object
            poly.zoneData = data; 
            mapPolygons.push(poly);
        });
    }).catch(error => {
        console.error("Map Data Error:", error);
    });
}

// 🟢 ANALYZE LOCATION
function analyzeLocation(latLng) {
    let foundZone = null;
    
    // Check if click is inside any polygon
    for (let poly of mapPolygons) {
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            foundZone = poly.zoneData;
        }
    }

    // UI ELEMENTS
    const statusBox = document.getElementById('scanStatus');
    const dataBox = document.getElementById('scanData');
    
    // Clear previous markers
    if(window.currentMarker) window.currentMarker.setMap(null);

    // Place "Pin"
    window.currentMarker = new google.maps.Marker({
        position: latLng,
        map: sciMap,
        animation: google.maps.Animation.DROP
    });

    if (foundZone) {
        // ZONE DETECTED (Real Data)
        statusBox.innerHTML = `
            <div class="text-2xl font-bold mb-1" style="color:${foundZone.color}">${foundZone.name}</div>
            <p class="text-xs text-white">Zone Verified in Database.</p>
        `;
        
        document.getElementById('zoneType').innerText = foundZone.typeName;
        document.getElementById('zoneType').style.color = foundZone.color;
        
        // Infer Difficulty based on type
        let diff = "Moderate";
        if(foundZone.typeKey === 'rock') diff = "High (Blasting Req)";
        if(foundZone.typeKey === 'water') diff = "Low (Soft Soil)";
        if(foundZone.typeKey === 'silt') diff = "Risk (Casing Req)";
        document.getElementById('zoneDiff').innerText = diff;

        dataBox.classList.remove('hidden');
    } else {
        // UNCHARTED ZONE (Honest Response)
        statusBox.innerHTML = `
            <div class="text-xl font-bold text-slate-300 mb-1">Uncharted Sector</div>
            <p class="text-xs text-slate-500">No geological data recorded for these coordinates.</p>
        `;
        dataBox.classList.add('hidden');
    }
}

// --- 3. TDS CALCULATOR (STRICT DB ONLY) ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    // UI Feedback
    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    rangeTxt.className = "text-4xl font-bold text-slate-400 animate-pulse";
    noteTxt.innerText = "Querying Live Database...";
    noteTxt.className = "text-sm text-slate-500";

    // 🟢 REAL DB CALL
    sci_db.collection('water_quality').doc(pincode).get()
    .then((doc) => {
        if (doc.exists) {
            // SUCCESS: Found Data
            const data = doc.data();
            rangeTxt.innerText = `${data.min} - ${data.max}`;
            rangeTxt.className = "text-4xl font-bold text-white";
            
            noteTxt.innerHTML = `<span class="text-emerald-400">● ${data.type || 'Verified Record'}</span>`;
            noteTxt.className = "text-sm font-bold";
        } else {
            // FAILURE: No Data (Be Honest)
            rangeTxt.innerText = "No Record";
            rangeTxt.className = "text-3xl font-bold text-slate-500";
            
            noteTxt.innerText = `No survey data available for Pincode: ${pincode}`;
            noteTxt.className = "text-sm text-red-400";
        }
    })
    .catch((e) => {
        // ERROR: Network/Auth
        console.error(e);
        rangeTxt.innerText = "Offline";
        rangeTxt.className = "text-3xl font-bold text-red-500";
        noteTxt.innerText = "Check internet connection.";
    });
}

// --- 4. MOTOR & RISK ENGINE (PHYSICS BASED) ---
// This relies on math (User Input), not database, so it is always "Real" logic.

function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepth').value) || 0;
    
    // Motor Logic (Standard Hydraulic Engineering Estimates)
    let hp = "1.0 HP";
    let stg = "10 Stages";
    
    if (depth > 150) { hp = "1.5 HP"; stg = "15 Stages"; }
    if (depth > 300) { hp = "3.0 HP"; stg = "20 Stages"; }
    if (depth > 500) { hp = "5.0 HP"; stg = "25 Stages"; }
    if (depth > 800) { hp = "7.5 HP"; stg = "35 Stages"; }
    if (depth > 1000) { hp = "10 HP"; stg = "40+ Stages"; }

    document.getElementById('motorHP').innerText = hp;
    const stageEl = document.getElementById('motorStage');
    if(stageEl) stageEl.innerText = stg;

    // Risk Logic Trigger
    calcRisk(depth);
}

function calcRisk(depth) {
    if(depth === 0) return;

    // Base Risk Curve (Linear increase with depth)
    let risk = (depth / 1500) * 100;
    
    // Structural Risk Factors
    if(depth < 150) risk += 15; // Surface collapse / Silt
    if(depth > 1000) risk += 25; // Heat / Pressure / Boulders

    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskLabel');

    // Cap at 100%
    const riskPct = Math.min(risk, 100);
    bar.style.width = riskPct + "%";
    
    // Strict Thresholds
    if(riskPct < 40) {
        label.innerText = "LOW";
        label.className = "text-xl font-bold text-emerald-400";
        bar.className = "h-full meter-fill relative bg-emerald-500";
    } else if(riskPct < 75) {
        label.innerText = "MODERATE";
        label.className = "text-xl font-bold text-yellow-400";
        bar.className = "h-full meter-fill relative bg-yellow-500";
    } else {
        label.innerText = "HIGH";
        label.className = "text-xl font-bold text-red-500 animate-pulse";
        bar.className = "h-full meter-fill relative bg-red-500";
    }
}
