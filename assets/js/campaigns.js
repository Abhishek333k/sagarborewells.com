document.addEventListener('DOMContentLoaded', () => {
    // Only run if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;
    initCampaignQueue();
});

async function initCampaignQueue() {
    try {
        const db = firebase.firestore();
        const now = new Date();

        // 1. Fetch only 'active' campaigns
        const snapshot = await db.collection('campaigns')
            .where('status', '==', 'active')
            .get();

        if (snapshot.empty) return;

        let validCampaigns = [];

        // 2. Client-Side Timestamp Validation
        snapshot.forEach(doc => {
            const data = doc.data();
            const start = data.startTime.toDate();
            const end = data.endTime.toDate();

            // Only queue it if we are currently inside the time window
            if (now >= start && now <= end) {
                // Session Memory: Check if the user already closed this specific popup today
                const sessionKey = `closed_campaign_${doc.id}`;
                if (!sessionStorage.getItem(sessionKey)) {
                    validCampaigns.push({ id: doc.id, ...data });
                }
            }
        });

        // 3. Start the Sequential Queue
        if (validCampaigns.length > 0) {
            // Sort by creation date so the newest ones show first
            validCampaigns.sort((a, b) => b.createdAt - a.createdAt);
            playCampaignQueue(validCampaigns);
        }

    } catch (error) {
        console.error("Campaign Engine Error:", error);
    }
}

function playCampaignQueue(campaigns) {
    if (campaigns.length === 0) return;

    const currentCampaign = campaigns.shift(); // Take the first one off the list
    
    // Inject the HTML Modal
    const modalHTML = `
        <div id="promo-modal" class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm opacity-0 transition-opacity duration-500">
            <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full transform scale-95 transition-transform duration-500 delay-100">
                <button id="close-promo" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors">
                    <i class="ri-close-line text-2xl"></i>
                </button>
                <img src="${currentCampaign.imageUrl}" alt="${currentCampaign.title}" class="w-full h-auto object-cover max-h-[80vh]">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('promo-modal');
    const closeBtn = document.getElementById('close-promo');

    // Trigger Entrance Animation after a slight delay (so it doesn't jump scare the user on load)
    setTimeout(() => {
        if (!modal) return;
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('div');
        if (content) content.classList.remove('scale-95');
    }, 1500);

    // Close Button Logic
    closeBtn.addEventListener('click', () => {
        // 1. Remember they closed it
        sessionStorage.setItem(`closed_campaign_${currentCampaign.id}`, "true");
        
        // 2. Trigger Exit Animation
        modal.classList.add('opacity-0');
        const content = modal.querySelector('div');
        if (content) content.classList.add('scale-95');
        
        // 3. Wait for animation to finish, delete DOM, and play the next one
        setTimeout(() => {
            modal.remove();
            // Recursive call to play the next campaign in the queue
            playCampaignQueue(campaigns); 
        }, 500);
    });
}
