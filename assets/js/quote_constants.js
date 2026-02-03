/**
 * SAGAR BOREWELLS - QUOTATION ENGINE CONFIGURATION
 * Logic: Multi-Phase Jumping Rates (Slabs)
 */

const QUOTE_CONFIG = {
    
    // --- 1. OPERATIONAL CONSTANTS ---
    OFFICE_LOCATION: { lat: 16.4410, lng: 80.5520 }, // Mangalagiri
    TRANSPORT_THRESHOLD_KM: 30, // First 30km is Free
    TRANSPORT_BASE_RATE: 2000,  // Charge per 30km block after threshold
    LABOUR_CHARGE: 1500,        // Site Cleaning / Setup
    
    // --- 2. DRILLING RATES (The "Jumping" Logic) ---
    PRICING_MODEL: {
        base_rate: 70, // 0 to 100 ft
        
        // Jumps applied per 50ft slab based on depth reached
        jumps: {
            phase_1: 10, // 101ft to 200ft (Standard)
            phase_2: 20, // 201ft to 300ft (Medium)
            phase_3: 50  // 301ft+ (High Hardness)
        },
        
        // Boundaries for phases (Where the jump changes)
        boundaries: {
            phase_2_start: 200, // At 200ft, switch to +20 jump
            phase_3_start: 300  // At 300ft, switch to +50 jump
        }
    },

    // --- 3. MATERIAL RATES (Display Only - Actuals) ---
    MATERIALS: [
        { id: 'pvc_6kg', label: '5" PVC PIPE (6KG)', price: 380, unit: '/ft' },
        { id: 'pvc_10kg', label: '5" PVC PIPE (10KG)', price: 550, unit: '/ft' },
        { id: 'ms_med', label: '7" MS IRON (Med)', price: 1100, unit: '/ft' },
        { id: 'ms_heavy', label: '7" MS IRON (Heavy)', price: 1350, unit: '/ft' },
        { id: 'casing_cap', label: 'CASING CAP', price: 450, unit: '/Set' },
        { id: 'welding', label: 'WELDING', price: 300, unit: '/Joint' }
    ]
};
