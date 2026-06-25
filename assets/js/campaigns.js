console.log("🟢 [CAMPAIGN ENGINE] Script loaded into browser.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("🟢 [CAMPAIGN ENGINE] DOM Content Loaded. Checking for Firebase...");
    
    // Check if Firebase exists at all
    if (typeof firebase === 'undefined') {
        console.error("🔴 [CAMPAIGN ENGINE FATAL] Firebase SDK is NOT loaded in index.html! Ensure firebase-app and firebase-firestore are linked.");
        return;
    }

    // Check if it's initialized
    if (!firebase.apps.length) {
        console.warn("🟡 [CAMPAIGN ENGINE] Firebase is loaded but not initialized yet. Waiting 1 second for config.js to catch up...");
        setTimeout(initCampaignQueue, 1000);
    } else {
        console.log("🟢 [CAMPAIGN ENGINE] Firebase is ready. Booting Queue...");
        initCampaignQueue();
    }
});

async function initCampaignQueue() {
    try {
        const db = firebase.firestore();
        const now = new Date();
        console.log(`🟢 [CAMPAIGN ENGINE] Fetching active campaigns. Current Client Time: ${now.toISOString()}`);

        const snapshot = await db.collection('campaigns').where('status', '==', 'active').get();

        if (snapshot.empty) {
            console.warn("🟡 [CAMPAIGN ENGINE] Database reached, but ZERO active campaigns found.");
            return;
        }

        console.log(`🟢 [CAMPAIGN ENGINE] Found ${snapshot.size} active campaigns in database. Validating timestamps...`);
        let validCampaigns = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            const start = data.startTime.toDate();
            const end = data.endTime.toDate();
            
            console.log(`   👉 Checking "${data.title}": Start[${start.toLocaleString()}] End[${end.toLocaleString()}]`);

            if (now >= start && now <= end) {
                const sessionKey = `closed_campaign_${doc.id}`;
                if (!sessionStorage.getItem(sessionKey)) {
                    console.log(`   ✅ "${data.title}" is VALID and ready for display.`);
                    validCampaigns.push({ id: doc.id, ...data });
                } else {
                    console.warn(`   ⏭️ "${data.title}" skipped. User already closed it this session.`);
                }
            } else {
                console.error(`   ❌ "${data.title}" failed time validation. It is either expired or scheduled for the future.`);
            }
        });

        if (validCampaigns.length > 0) {
            validCampaigns.sort((a, b) => b.createdAt - a.createdAt);
            console.log(`🟢 [CAMPAIGN ENGINE] Queue built. ${validCampaigns.length} popups ready to play.`);
            playCampaignQueue(validCampaigns);
        } else {
            console.warn("🟡 [CAMPAIGN ENGINE] All campaigns were filtered out (either expired or already viewed).");
        }

    } catch (error) {
        console.error("🔴 [CAMPAIGN ENGINE CRASH]:", error);
    }
}

async function playCampaignQueue(campaigns) {
    if (campaigns.length === 0) return;
    const currentCampaign = campaigns.shift(); 
    
    console.log(`🟢 [CAMPAIGN ENGINE] Pre-fetching image for: "${currentCampaign.title}"...`);
    
    // 1. THE GOOGLE STANDARD: Never show UI until the asset is fully loaded
    try {
        await preloadImage(currentCampaign.imageUrl);
    } catch (error) {
        console.error(`🔴 [CAMPAIGN ENGINE] Failed to load image for "${currentCampaign.title}". Skipping to next.`);
        return playCampaignQueue(campaigns);
    }

    // 2. NATIVE HTML5 DIALOG: Handles focus trapping, Escape key, and top-layer natively
    const dialogHTML = `
        <dialog id="promo-dialog" class="bg-transparent p-0 m-auto fixed inset-0 z-[9999] overflow-visible outline-none w-full h-full backdrop:bg-transparent">
            <div id="promo-scrim" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer"></div>
            
            <div class="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <div id="promo-card" class="relative bg-white rounded-[28px] shadow-2xl overflow-hidden max-w-3xl w-full opacity-0 translate-y-12 scale-95 transition-all duration-[500ms] ease-[cubic-bezier(0.2,0,0,1)] pointer-events-auto flex flex-col">
                    
                    <div class="relative w-full bg-slate-50 flex items-center justify-center">
                        <img src="${currentCampaign.imageUrl}" alt="${currentCampaign.title}" class="w-full h-auto object-contain" style="max-height: 65vh;">
                    </div>

                    <div class="flex justify-between items-center p-4 sm:px-6 sm:py-4 bg-white border-t border-slate-100">
                        <h2 class="text-sm sm:text-base font-bold text-slate-800 truncate pr-4">${currentCampaign.title}</h2>
                        <button id="close-promo" aria-label="Dismiss promotion" class="shrink-0 h-10 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm tracking-wide transition-colors focus:ring-2 focus:ring-teal-500 outline-none flex items-center gap-2">
                            <span>Dismiss</span>
                        </button>
                    </div>

                </div>
            </div>
        </dialog>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    const dialog = document.getElementById('promo-dialog');
    const scrim = document.getElementById('promo-scrim');
    const card = document.getElementById('promo-card');
    const closeBtn = document.getElementById('close-promo');

    // Boot the native dialog
    dialog.showModal();

    // Trigger Material Entrance Motion
    requestAnimationFrame(() => {
        scrim.classList.remove('opacity-0');
        card.classList.remove('opacity-0', 'translate-y-12', 'scale-95');
    });

    const closeRoutine = () => {
        sessionStorage.setItem(`closed_campaign_${currentCampaign.id}`, "true");
        
        // Trigger Material Exit Motion
        scrim.classList.add('opacity-0');
        card.classList.add('opacity-0', 'translate-y-8', 'scale-95');
        
        setTimeout(() => {
            dialog.close();
            dialog.remove();
            playCampaignQueue(campaigns); 
        }, 400); // Wait for exit animation
    };

    // Event Listeners: Button, Background Click, and native Escape Key
    closeBtn.addEventListener('click', closeRoutine);
    scrim.addEventListener('click', closeRoutine);
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault(); // Prevent immediate native close to allow our CSS animation
        closeRoutine();
    });
}


// --- UTIL: Silent Image Preloader ---
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
