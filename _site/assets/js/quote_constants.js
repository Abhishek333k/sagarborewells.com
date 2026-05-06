/**
 * SAGAR BOREWELLS - QUOTATION ENGINE CONFIGURATION
 * Logic: Cumulative Jumping Rates (Slabs)
 * Updated: Latest Pricing Model
 */

const QUOTE_CONFIG = {
    
    // --- 1. OPERATIONAL CONSTANTS ---
    OFFICE_LOCATION: { lat: 16.4410, lng: 80.5520 }, // Mangalagiri
    TRANSPORT_THRESHOLD_KM: 30, // First 30km is Free
    TRANSPORT_BASE_RATE: 1000,  // Charge per 30km block after threshold
    
    // LABOUR: Heavy work (Mast erection, Casing installation, Loading/Unloading)
    LABOUR_CHARGE: 1000,        
    
    // --- 2. DRILLING RATES (The "Jumping" Logic) ---
    PRICING_MODEL: {
        base_rate: 70, // 0 to 100 ft
        
        // INCREMENTS: How much to ADD to the previous rate per 50ft slab
        increments: {
            phase_1: 10, // 101ft to 200ft (Standard)
            phase_2: 20, // 201ft to 300ft (Medium Hardness)
            phase_3: 50  // 301ft+ (Extreme Hardness)
        },
        
        // Boundaries where the increment amount changes
        boundaries: {
            phase_2_start: 200, 
            phase_3_start: 300  
        }
    },

    // --- 3. MATERIAL RATES (Display Only - Actuals) ---
    MATERIALS: [
        { id: 'pvc_6kg', label: '5" PVC PIPE (6KG)', price: 380, unit: '/ft' },
        { id: 'pvc_10kg', label: '5" PVC PIPE (10KG)', price: 550, unit: '/ft' },
        { id: 'ms_med', label: '7" MS IRON (Med)', price: 1100, unit: '/ft' },
        { id: 'casing_cap', label: 'CASING CAP', price: 450, unit: '/Set' },
        { id: 'welding', label: 'WELDING CHARGES', price: 300, unit: '/Joint' }
    ]
};
