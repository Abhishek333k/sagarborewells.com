// FILENAME: assets/js/science_engine.js

// --- 1. SETUP FIREBASE & CONFIG ---
if(typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(CONTACT_INFO.firebase_config);
}
const sci_db = firebase.firestore();

// --- 2. MAP ENGINE (REAL-TIME FIREBASE DATA) ---
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

    // 🟢 FETCH REAL ZONES FROM FIREBASE
    loadRealZones();

    // Click Listener for Analysis
    sciMap.addListener('click', (e) => {
        analyzeLocation(e.latLng);
    });
}

function loadRealZones() {
    sci_db.collection('geo_zones').get().then((snapshot) => {
        if(snapshot.empty) console.log("No zones found in DB.");
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Draw Polygon on Map
            const poly = new google.maps.Polygon({
                paths: data.coords,
                strokeColor: data.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: data.color,
                fillOpacity: 0.35, // Semi-transparent
                map: sciMap
            });

            // Attach Data to the Polygon Object for easy retrieval
            poly.zoneData = data; 
            
            // Add to our list so we can check it later
            mapPolygons.push(poly);
        });
    });
}

// 🟢 ANALYZE LOCATION (HANDLES OVERLAPS)
function analyzeLocation(latLng) {
    let foundZone = null;
    
    // Loop through all loaded polygons
    // Note: If overlaps exist, this picks the *last* one added that matches.
    // This allows you to draw a small "Red" zone on top of a big "Green" zone.
    for (let poly of mapPolygons) {
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            foundZone = poly.zoneData;
            // We don't 'break' here if we want the 'top-most' layer (last loaded)
            // But if you want the first match, uncomment the line below:
            // break; 
        }
    }

    const statusEl = document.getElementById('zoneStatus');
    
    // Clear previous markers
    if(window.currentMarker) window.currentMarker.setMap(null);

    if (foundZone) {
        statusEl.innerHTML = `<span style="color:${foundZone.color}">● ${foundZone.name}</span> <span class="text-white">(${foundZone.typeName})</span>`;
        
        // Add Marker
        window.currentMarker = new google.maps.Marker({
            position: latLng,
            map: sciMap,
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: foundZone.color,
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "white"
            }
        });
    } else {
        statusEl.innerText = "Unknown Zone (Standard Rates Apply)";
        statusEl.style.color = "#94a3b8"; // Slate color
        
        window.currentMarker = new google.maps.Marker({
            position: latLng,
            map: sciMap
        });
    }
}

// --- 3. TDS CALCULATOR (REAL FIREBASE DATA) ---
function checkWaterQuality() {
    const pincode = document.getElementById('sciPincode').value;
    const box = document.getElementById('tdsResult');
    const rangeTxt = document.getElementById('tdsRange');
    const noteTxt = document.getElementById('tdsNote');

    if(pincode.length !== 6) return alert("Enter valid 6-digit Pincode");

    box.classList.remove('hidden');
    rangeTxt.innerText = "...";
    noteTxt.innerText = "Querying Database...";

    // 🟢 REAL DB CALL
    sci_db.collection('water_quality').doc(pincode).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            rangeTxt.innerText = `${data.min} - ${data.max}`;
            noteTxt.innerHTML = `<span class="text-emerald-400">● ${data.type || 'Recorded Data'}</span>`;
        } else {
            // Fallback if Pincode not in DB yet
            rangeTxt.innerText = "No Data";
            noteTxt.innerText = "Local data not available yet.";
        }
    }).catch((e) => {
        console.error(e);
        rangeTxt.innerText = "Error";
    });
}

// --- 4. MOTOR & RISK ENGINE (Math Logic) ---
// (This logic remains local as it's physics-based, no DB needed)
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
        if(depth < 150) risk += 10; 
        if(depth > 900) risk += 20;

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
    // Init Slider
    slider.dispatchEvent(new Event('input'));
}
