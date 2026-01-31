// FILENAME: assets/js/science_engine.js

// Init Firebase (Safe Check)
if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

// 1. MAPS & HEATMAP
let sciMap;
function initSciMap() {
    const mapOptions = {
        center: { lat: 16.4410, lng: 80.5520 }, // Mangalagiri
        zoom: 12,
        mapTypeId: 'satellite',
        disableDefaultUI: true
    };
    sciMap = new google.maps.Map(document.getElementById('sciMap'), mapOptions);

    // 🟢 TODO: In Phase 3, we will load Polygon Data from 'geo_zones' collection here
    // For now, let's draw a dummy "High Yield" circle to show it works
    const cityCircle = new google.maps.Circle({
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#10b981",
        fillOpacity: 0.35,
        map: sciMap,
        center: mapOptions.center,
        radius: 2000 // 2km radius
    });
}

// 2. TDS CALCULATOR
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const resBox = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) { alert("Enter valid 6-digit Pincode"); return; }

    resBox.classList.remove('hidden');
    rangeTxt.innerText = "Loading...";

    // Fetch from Firebase
    sci_db.collection('water_quality').doc(pincode).get()
    .then(doc => {
        if (doc.exists) {
            const data = doc.data();
            rangeTxt.innerText = `${data.min} - ${data.max}`;
            noteTxt.innerText = data.type || "Standard Profile";
            noteTxt.className = "mt-2 text-sm text-emerald-400";
        } else {
            // Fallback Algorithm (Fake it intelligently based on region codes)
            // e.g. 522xxx is usually Guntur (High Mineral)
            if(pincode.startsWith('522')) {
                rangeTxt.innerText = "600 - 1400";
                noteTxt.innerText = "High Mineral Content (Estimate)";
                noteTxt.className = "mt-2 text-sm text-yellow-400";
            } else {
                rangeTxt.innerText = "No Data";
                noteTxt.innerText = "Local data unavailable.";
            }
        }
    }).catch(err => {
        console.error(err);
        rangeTxt.innerText = "Error";
    });
}

// 3. MOTOR RECOMMENDATION LOGIC
function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepth').value) || 0;
    const hpLabel = document.getElementById('motorHP');
    const stageLabel = document.getElementById('motorStage');
    
    if(depth === 0) { hpLabel.innerText = "-- HP"; stageLabel.innerText = "--"; return; }

    // PHYSICS LOGIC (Simplified for Borewells)
    // Rule of thumb: 1 HP per 150-200ft depending on stages
    let hp = 0;
    let stages = 0;

    if (depth <= 150) { hp = 1.0; stages = 10; }
    else if (depth <= 250) { hp = 1.5; stages = 15; }
    else if (depth <= 400) { hp = 3.0; stages = 20; }
    else if (depth <= 600) { hp = 5.0; stages = 25; }
    else if (depth <= 900) { hp = 7.5; stages = 30; }
    else { hp = 10.0; stages = "40+"; }

    hpLabel.innerText = hp + " HP";
    stageLabel.innerText = stages;

    // Trigger Risk Calc too
    calcRisk(depth);
}

// 4. RISK CALCULATOR
function calcRisk(depth) {
    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskLabel');
    const desc = document.getElementById('riskDesc');

    let riskScore = 10; // Base risk

    // Depth Risk
    if(depth > 300) riskScore += 20;
    if(depth > 600) riskScore += 30;
    if(depth > 1000) riskScore += 30;

    // TODO: Add Zone Risk here later (if Zone = Rocky, add +20)

    // Visuals
    bar.style.width = riskScore + "%";
    
    if(riskScore < 30) {
        label.innerText = "LOW RISK";
        label.className = "text-2xl font-bold text-emerald-400";
        desc.innerText = "Standard drilling conditions expected.";
    } else if (riskScore < 70) {
        label.innerText = "MODERATE RISK";
        label.className = "text-2xl font-bold text-yellow-400";
        desc.innerText = "Casing requirement likely. Silt/boulders possible.";
    } else {
        label.innerText = "HIGH RISK";
        label.className = "text-2xl font-bold text-red-500 animate-pulse";
        desc.innerText = "Complex geology. Heavy duty rig required.";
    }
}
