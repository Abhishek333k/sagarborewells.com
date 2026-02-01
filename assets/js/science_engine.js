// FILENAME: assets/js/science_engine.js

// --- 1. SETUP FIREBASE ---
if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

// --- 2. MAP ENGINE (SMART OVERLAP) ---
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

    loadRealZones();

    sciMap.addListener('click', (e) => {
        analyzeLocation(e.latLng);
    });
}

function loadRealZones() {
    sci_db.collection('geo_zones').get().then((snapshot) => {
        if(snapshot.empty) return;
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const poly = new google.maps.Polygon({
                paths: data.coords,
                strokeColor: data.color,
                strokeOpacity: 0.6,
                strokeWeight: 1,
                fillColor: data.color,
                fillOpacity: 0.25,
                map: sciMap,
                clickable: false 
            });
            poly.zoneData = data; 
            mapPolygons.push(poly);
        });
    });
}

// 🟢 ANALYZE LOCATION (SMALLEST AREA WINS)
function analyzeLocation(latLng) {
    let bestZone = null;
    let minArea = Infinity; // Start with infinitely large area
    
    for (let poly of mapPolygons) {
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            // Calculate Area to determine specificity
            const area = google.maps.geometry.spherical.computeArea(poly.getPath());
            
            // If this zone is smaller than the previous best, pick this one
            // This ensures "Red Rock Zone" (Small) beats "Mangalagiri City" (Big)
            if (area < minArea) {
                minArea = area;
                bestZone = poly.zoneData;
            }
        }
    }

    const statusBox = document.getElementById('scanStatus');
    const dataBox = document.getElementById('scanData');
    
    if(window.currentMarker) window.currentMarker.setMap(null);
    window.currentMarker = new google.maps.Marker({
        position: latLng,
        map: sciMap,
        animation: google.maps.Animation.DROP
    });

    if (bestZone) {
        // 🔒 PRIVACY FIX: Don't show 'bestZone.name' (Admin Name). Show 'bestZone.typeName'.
        statusBox.innerHTML = `
            <div class="text-2xl font-bold mb-1" style="color:${bestZone.color}">${bestZone.typeName}</div>
            <p class="text-xs text-white">Geological Profile Verified.</p>
        `;
        
        document.getElementById('zoneType').innerText = "Confirmed Scan";
        document.getElementById('zoneType').style.color = bestZone.color;
        
        let diff = "Moderate";
        if(bestZone.typeKey === 'rock') diff = "High (Blasting Req)";
        if(bestZone.typeKey === 'water') diff = "Low (Soft Soil)";
        if(bestZone.typeKey === 'silt') diff = "Risk (Casing Req)";
        document.getElementById('zoneDiff').innerText = diff;

        dataBox.classList.remove('hidden');
    } else {
        statusBox.innerHTML = `
            <div class="text-xl font-bold text-slate-300 mb-1">Uncharted Zone</div>
            <p class="text-xs text-slate-500">No specific data. Standard rates apply.</p>
        `;
        dataBox.classList.add('hidden');
    }
}

// --- 3. TDS CALCULATOR (DEBUGGED) ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');
    const box = document.getElementById('tdsResult');

    if(pincode.length !== 6) return alert("Enter valid Pincode");

    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    noteTxt.innerText = "Scanning...";

    sci_db.collection('water_quality').doc(String(pincode)).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // FIXED VARIABLES HERE
            rangeTxt.innerText = `${data.min_tds} - ${data.max_tds}`;
            noteTxt.innerHTML = `<span class="text-emerald-400">● ${data.type || 'Verified Record'}</span>`;
        } else {
            rangeTxt.innerText = "No Data";
            noteTxt.innerText = "No data for this area.";
        }
    }).catch((e) => {
        console.error(e);
        rangeTxt.innerText = "Error";
        noteTxt.innerText = "Connection Failed";
    });
}

// --- 4. MOTOR & RISK ENGINE (SEPARATE INPUTS) ---

function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepthPump').value) || 0;
    
    let hp = 1.0;
    let stg = "10 Stages";
    
    if (depth > 150) { hp = 1.5; stg = "15 Stages"; }
    if (depth > 300) { hp = 3.0; stg = "20 Stages"; }
    if (depth > 500) { hp = 5.0; stg = "25 Stages"; }
    if (depth > 800) { hp = 7.5; stg = "35 Stages"; }
    if (depth > 1000) { hp = 10.0; stg = "40+ Stages"; }

    document.getElementById('motorHP').innerText = hp + " HP";
    document.getElementById('motorStage').innerText = stg;

    // 🛒 UPDATE SHOP LINK
    const shopBtn = document.getElementById('motorShopLink');
    if(depth > 0) {
        shopBtn.classList.remove('hidden');
        const query = `${hp}hp submersible pump`; 
        shopBtn.href = `https://www.sagartraders.in/search?q=${encodeURIComponent(query)}`;
    } else {
        shopBtn.classList.add('hidden');
    }
}

function calcRisk() {
    const depth = parseInt(document.getElementById('sciDepthRisk').value) || 0;
    if(depth === 0) return;

    let risk = (depth / 1500) * 100;
    if(depth < 150) risk += 15; 
    if(depth > 1000) risk += 25; 

    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskLabel');
    const desc = document.getElementById('riskDesc');

    const riskPct = Math.min(risk, 100);
    bar.style.width = riskPct + "%";
    
    if(riskPct < 40) {
        label.innerText = "LOW";
        label.className = "text-2xl font-bold text-emerald-400";
        bar.className = "h-full meter-fill relative bg-emerald-500";
        desc.innerText = "Standard conditions.";
    } else if(riskPct < 75) {
        label.innerText = "MODERATE";
        label.className = "text-2xl font-bold text-yellow-400";
        bar.className = "h-full meter-fill relative bg-yellow-500";
        desc.innerText = "Casing likely required.";
    } else {
        label.innerText = "HIGH";
        label.className = "text-2xl font-bold text-red-500 animate-pulse";
        bar.className = "h-full meter-fill relative bg-red-500";
        desc.innerText = "High cost / complexity.";
    }
}
