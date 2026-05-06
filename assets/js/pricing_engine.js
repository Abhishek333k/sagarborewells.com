/**
 * FILENAME: assets/js/pricing_engine.js
 * PURPOSE: Shared pricing logic for Sagar Borewells.
 * Ensures quote.html and dashboard.html use identical math.
 */

function calculateBorewellPrice(totalDepth) {
    if (typeof QUOTE_CONFIG === 'undefined') {
        console.error("QUOTE_CONFIG missing! Pricing engine stopped.");
        return null;
    }

    const { PRICING_MODEL } = QUOTE_CONFIG;
    const jumps = PRICING_MODEL.increments;
    const bounds = PRICING_MODEL.boundaries;

    let drillHtml = "";
    let drillCost = 0;
    let currentDepth = 0;
    let currentRate = PRICING_MODEL.base_rate;
    let breakdownText = "";

    // 1. First 100ft Slab (Base Rate)
    const firstChunk = Math.min(totalDepth, 100);
    if (firstChunk > 0) {
        const cost = firstChunk * currentRate;
        drillCost += cost;
        drillHtml += `<tr><td>0 - ${firstChunk} ft</td><td class="text-center">₹${currentRate}</td><td class="text-right">₹${cost.toLocaleString()}</td></tr>`;
        breakdownText += `&#x2022; 0-${firstChunk}ft: ₹${cost.toLocaleString()} (@${currentRate}/ft)\n`;
        currentDepth += firstChunk;
    }

    // 2. Subsequent 50ft Slabs with "Jumping" Increments
    while (currentDepth < totalDepth) {
        let increment = jumps.phase_1;
        if (currentDepth >= bounds.phase_3_start) increment = jumps.phase_3;
        else if (currentDepth >= bounds.phase_2_start) increment = jumps.phase_2;

        currentRate += increment;
        let nextChunk = Math.min(50, totalDepth - currentDepth);
        let cost = nextChunk * currentRate;
        drillCost += cost;

        const endDepth = currentDepth + nextChunk;
        drillHtml += `<tr><td>${currentDepth + 1} - ${endDepth} ft</td><td class="text-center">₹${currentRate}</td><td class="text-right">₹${cost.toLocaleString()}</td></tr>`;
        breakdownText += `&#x2022; ${currentDepth + 1}-${endDepth}ft: ₹${cost.toLocaleString()} (@${currentRate}/ft)\n`;
        currentDepth += nextChunk;
    }

    return {
        drillCost,
        drillHtml,
        breakdownText,
        totalDepth
    };
}
