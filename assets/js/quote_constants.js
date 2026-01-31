/**
 * SAGAR BOREWELLS - QUOTATION ENGINE CONFIGURATION
 * * Edit this file to change prices, labels, and calculation logic.
 * No need to touch the main HTML code.
 */

const QUOTE_CONFIG = {
    
    // --- 1. OPERATIONAL CONSTANTS ---
    OFFICE_LOCATION: { lat: 16.4410, lng: 80.5520 }, // Mangalagiri
    TRANSPORT_THRESHOLD_KM: 30, // Km limit for free transport
    TRANSPORT_BASE_RATE: 1000,  // Charge per unit (multiplier) if above threshold
    LABOUR_CHARGE: 1000,        // Fixed worker charge
    FLUSHING_CHARGE: 10000,      // Fixed flushing charge
    
    // --- 2. VARIABLE MATERIALS (Charged on Actuals) ---
    // These appear in the "Variable Materials" box.
    // Format: { label: "Display Name", price: 400, unit: "/ft" }
    MATERIALS: [
        { id: 'pvc_10', label: '10" INCH PVC PIPE', price: 400, unit: '/ft' },
        { id: 'pvc_12', label: '12" INCH PVC PIPE', price: 700, unit: '/ft' },
        { id: 'ms_7_med', label: '7" MS PIPE (Medium)', price: 500, unit: '/ft' },
        { id: 'ms_7_heavy', label: '7" MS PIPE (Heavy)', price: 650, unit: '/ft' },
        { id: 'gi_7_med', label: '7" GI PIPE (Medium)', price: 620, unit: '/ft' },
        { id: 'gi_7_heavy', label: '7" GI PIPE (Heavy)', price: 750, unit: '/ft' },
        { id: 'welding', label: 'WELDING CHARGES', price: 500, unit: '/Joint' },
        { id: 'collar', label: 'COLLAR & CAP', price: 350, unit: '/Set' },
        { id: 'holes', label: 'SLOTTING / HOLES', price: 200, unit: '/ft' }, // Updated to 200 as per request
        { id: 'water', label: 'WATER INJECTION', price: 10, unit: '/ft' }
    ],

    // --- 3. DRILLING SLABS (Fallback Defaults) ---
    // These are used if Firebase fails or for offline testing
    DEFAULT_RATES: {
        base_rate: 80,
        slab_step: 10 // Increase per slab
    }
};
