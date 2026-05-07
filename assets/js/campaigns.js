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

function playCampaignQueue(campaigns) {
    if (campaigns.length === 0) return;
    const currentCampaign = campaigns.shift(); 
    
    console.log(`🟢 [CAMPAIGN ENGINE] Playing popup: "${currentCampaign.title}"...`);
    
    const modalHTML = `
        <div id="promo-modal" class="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md opacity-0 transition-opacity duration-500">
            <div class="relative max-w-3xl w-full transform scale-95 transition-transform duration-500 delay-100 mt-8">
                
                <button id="close-promo" class="absolute -top-12 right-0 sm:-right-4 z-20 w-10 h-10 bg-white rounded-full text-slate-900 shadow-xl flex items-center justify-center hover:bg-slate-200 hover:scale-110 transition-all group">
                    <i class="ri-close-line text-2xl font-bold group-hover:rotate-90 transition-transform duration-300"></i>
                </button>
                
                <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <img src="${currentCampaign.imageUrl}" alt="${currentCampaign.title}" class="w-full h-auto object-contain max-h-[75vh]">
                </div>
                
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('promo-modal');
    const closeBtn = document.getElementById('close-promo');

    setTimeout(() => {
        if (!modal) return;
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('div');
        if (content) content.classList.remove('scale-95');
    }, 1500);

    closeBtn.addEventListener('click', () => {
        sessionStorage.setItem(`closed_campaign_${currentCampaign.id}`, "true");
        modal.classList.add('opacity-0');
        const content = modal.querySelector('div');
        if (content) content.classList.add('scale-95');
        setTimeout(() => {
            modal.remove();
            playCampaignQueue(campaigns); 
        }, 500);
    });
}
