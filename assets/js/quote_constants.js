/**
 * SAGAR BOREWELLS - QUOTATION ENGINE CONFIGURATION
 * Logic: Non-Linear Jumping Rates (Slabs)
 */

const QUOTE_CONFIG = {
    
    // --- 1. OPERATIONAL CONSTANTS ---
    OFFICE_LOCATION: { lat: 16.4410, lng: 80.5520 }, // Mangalagiri
    TRANSPORT_THRESHOLD_KM: 30, // First 30km is Free
    TRANSPORT_BASE_RATE: 2000,  // Charge per 30km block after threshold
    LABOUR_CHARGE: 1500,        // Site Cleaning / Setup
    
    // --- 2. MATERIAL RATES (Display Only - Actuals) ---
    MATERIALS: [
        { id: 'pvc_6kg', label: '5" PVC PIPE (6KG)', price: 380, unit: '/ft' },
        { id: 'pvc_10kg', label: '5" PVC PIPE (10KG)', price: 550, unit: '/ft' },
        { id: 'ms_med', label: '7" MS IRON (Med)', price: 1100, unit: '/ft' },
        { id: 'ms_heavy', label: '7" MS IRON (Heavy)', price: 1350, unit: '/ft' },
        { id: 'casing_cap', label: 'CASING CAP', price: 450, unit: '/Set' },
        { id: 'welding', label: 'WELDING', price: 300, unit: '/Joint' }
    ],

    // --- 3. DRILLING LOGIC ---
    DEFAULT_RATES: {
        base_rate: 70, // Start Rate (0-100ft)
        
        // JUMPING LOGIC: How much to increase per 50ft slab
        jumps: {
            phase_1: 10, // Up to 200ft (Standard)
            phase_2: 20, // 201ft to 450ft (Hard)
            phase_3: 30  // 450ft+ (Deep Rock)
        }
    }
};
