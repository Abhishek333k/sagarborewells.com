// FILENAME: assets/js/science_engine.js

// --- 1. SETUP FIREBASE ---
if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

// --- 2. MAP ENGINE ---
let sciMap;
let mapPolygons = []; 

function initSciMap() {
    const startLoc = { lat: 16.4410, lng: 80.5520 }; // Mangalagiri
    
    sciMap = new google.maps.Map(document.getElementById('sciMap'), {
        center: startLoc,
        zoom: 13,
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
        mapPolygons = []; // Reset
        snapshot.forEach((doc) => {
            const data = doc.data();
            
            const poly = new google.maps.Polygon({
                paths: data.coords,
                strokeColor: data.color,
                strokeOpacity: 0.6,
                strokeWeight: 1,
                fillColor: data.color,
                fillOpacity: 0.2, 
                map: sciMap,
                clickable: false 
            });

            // Calculate Area for "Smallest Zone Wins" logic
            const area = google.maps.geometry.spherical.computeArea(poly.getPath());

            poly.zoneData = { ...data, area: area }; 
            mapPolygons.push(poly);
        });
    });
}

// 🟢 NEW OVERLAP LOGIC: SMALLEST AREA WINS
function analyzeLocation(latLng) {
    let matches = [];
    
    // 1. Find ALL zones containing the point
    for (let poly of mapPolygons) {
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            matches.push(poly.zoneData);
        }
    }

    // 2. Sort by Area (Smallest First) -> Specific beats General
    matches.sort((a, b) => a.area - b.area);
    
    const foundZone = matches.length > 0 ? matches[0] : null;

    // UI ELEMENTS
    const statusBox = document.getElementById('scanStatus');
    const dataBox = document.getElementById('scanData');
    
    if(window.currentMarker) window.currentMarker.setMap(null);

    window.currentMarker = new google.maps.Marker({
        position: latLng,
        map: sciMap,
        animation: google.maps.Animation.DROP
    });

    if (foundZone) {
        // 🟢 PRIVACY FIX: Show 'typeName' (Category), NOT 'name' (Internal ID)
        statusBox.innerHTML = `
            <div class="text-2xl font-bold mb-1" style="color:${foundZone.color}">${foundZone.typeName}</div>
            <p class="text-xs text-white">Geological Data Verified.</p>
        `;
        
        document.getElementById('zoneType').innerText = foundZone.typeName;
        document.getElementById('zoneType').style.color = foundZone.color;
        
        let diff = "Moderate";
        if(foundZone.typeKey === 'rock') diff = "High (Blasting Req)";
        if(foundZone.typeKey === 'water') diff = "Low (Soft Soil)";
        if(foundZone.typeKey === 'silt') diff = "Risk (Casing Req)";
        document.getElementById('zoneDiff').innerText = diff;

        dataBox.classList.remove('hidden');
    } else {
        statusBox.innerHTML = `
            <div class="text-xl font-bold text-slate-300 mb-1">Standard Zone</div>
            <p class="text-xs text-slate-500">No specific warnings for this coordinate.</p>
        `;
        dataBox.classList.add('hidden');
    }
}

// --- 3. TDS CALCULATOR (Fix) ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    noteTxt.innerText = "Scanning...";

    // Ensure ID is string because Pincodes are stored as Document IDs (Strings)
    const docId = String(pincode);

    sci_db.collection('water_quality').doc(docId).get()
    .then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            rangeTxt.innerText = `${data.min} - ${data.max}`;
            noteTxt.innerHTML = `<span class="text-emerald-400">● ${data.type}</span>`;
            
            // 🟢 PITCH: Show Purifier Ad
            document.getElementById('tdsPitch').classList.remove('hidden');
        } else {
            rangeTxt.innerText = "No Data";
            noteTxt.innerText = "No survey record for " + pincode;
            document.getElementById('tdsPitch').classList.add('hidden');
        }
    })
    .catch((e) => {
        console.error(e);
        rangeTxt.innerText = "Error";
        noteTxt.innerText = "Network issue.";
    });
}

// --- 4. MOTOR & RISK ENGINE ---
function calcMotor() {
    const depth = parseInt(document.getElementById('sciDepth').value) || 0;
    
    let hp = "1.0 HP";
    let stg = "10 Stages";
    let link = "https://sagartrader.in"; // Default

    if (depth > 150) { hp = "1.5 HP"; stg = "15 Stages"; }
    if (depth > 300) { hp = "3.0 HP"; stg = "20 Stages"; }
    if (depth > 500) { hp = "5.0 HP"; stg = "25 Stages"; }
    if (depth > 800) { hp = "7.5 HP"; stg = "35 Stages"; }
    if (depth > 1000) { hp = "10 HP"; stg = "40+ Stages"; }

    document.getElementById('motorHP').innerText = hp;
    document.getElementById('motorStage').innerText = stg;
    
    // 🟢 PITCH: Update Buy Button
    const btn = document.getElementById('btnBuyMotor');
    btn.innerHTML = `Buy ${hp} Pump <i class="ri-shopping-cart-2-line ml-1"></i>`;
    btn.onclick = () => window.open(link, '_blank');

    calcRisk(depth);
}

function calcRisk(depth) {
    if(depth === 0) return;
    let risk = (depth / 1500) * 100;
    if(depth < 150) risk += 15; 
    if(depth > 1000) risk += 25; 

    const bar = document.getElementById('riskBar');
    const label = document.getElementById('riskLabel');

    const riskPct = Math.min(risk, 100);
    bar.style.width = riskPct + "%";
    
    if(riskPct < 40) {
        label.innerText = "LOW";
        label.className = "text-2xl font-black text-emerald-400";
        bar.className = "h-full meter-fill relative bg-emerald-500";
    } else if(riskPct < 75) {
        label.innerText = "MODERATE";
        label.className = "text-2xl font-black text-yellow-400";
        bar.className = "h-full meter-fill relative bg-yellow-500";
    } else {
        label.innerText = "HIGH";
        label.className = "text-2xl font-black text-red-500 animate-pulse";
        bar.className = "h-full meter-fill relative bg-red-500";
    }
}
