// FILENAME: assets/js/certificate_template.js

function getCertificateHTML(data) {
    // --- 1. DATA PREPARATION & CLEANUP ---
    const year = new Date().getFullYear();
    // Ensure ID exists, fallback to a smart random string if not
    const certID = data.id || `SBW-${year}-${Math.floor(100000 + Math.random() * 900000)}`; 
    
    // Formatting Date: "30 January 2026" looks more official than 30/01/2026
    const dateObj = data.date ? new Date(data.date) : new Date();
    const drillDate = dateObj.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // --- 2. HELPER: Smart Row Generator ---
    // Returns HTML string only if value is valid (not null, empty, "undefined", or "-- None --")
    const row = (label, value, unit = "") => {
        if (!value || value === "undefined" || value === "" || value === "-- None --") return "";
        
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; width: 40%; font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">
                ${label}
            </td>
            <td style="padding: 12px 0; width: 60%; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 14px; font-weight: 700; color: #0f172a; text-align: right;">
                ${value} <span style="font-size: 10px; color: #94a3b8; font-weight: 400;">${unit}</span>
            </td>
        </tr>`;
    };

    // --- 3. ASSETS (Embedded for Portability) ---
    // Diagonal Pattern SVG (Base64 encoded for cleaner string interpolation)
    const watermarkSVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><text x='50%' y='50%' font-family='Arial' font-weight='bold' font-size='24' fill='%231e40af' fill-opacity='0.03' transform='rotate(-45 75 75)' text-anchor='middle'>SBW</text></svg>`;

    // --- 4. THE TEMPLATE ---
    return `
    <div style="width: 100%; height: 100%; background: #ffffff; padding: 40px; box-sizing: border-box; position: relative; font-family: 'Inter', Helvetica, Arial, sans-serif; color: #334155;">
        
        <div style="position: absolute; inset: 0; background-image: url('${watermarkSVG}'); background-repeat: repeat; z-index: 0;"></div>

        <div style="position: relative; z-index: 10; height: 100%; border: 3px solid #1e293b; padding: 5px; box-sizing: border-box;">
            <div style="height: 100%; border: 1px solid #ea580c; padding: 40px; box-sizing: border-box; background: rgba(255, 255, 255, 0.90); display: flex; flex-direction: column;">
                
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
                    <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 38px; color: #1e293b; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                        SAGAR <span style="color: #2563eb;">BOREWELLS</span>
                    </h1>
                    <p style="margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; font-weight: 700;">
                        Advanced Geological Infrastructure
                    </p>
                </div>

                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="background: #f1f5f9; padding: 8px 24px; border-radius: 50px; border: 1px solid #cbd5e1; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #334155;">
                        Official Commissioning Record
                    </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; padding: 0 10px;">
                    <div>
                        <p style="margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">Certificate ID</p>
                        <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: #ea580c;">${certID}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">Commission Date</p>
                        <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #1e293b;">${drillDate}</p>
                    </div>
                </div>

                <div style="display: flex; gap: 30px; margin-bottom: 30px;">
                    
                    <div style="flex: 1;">
                        <p style="font-family: 'Playfair Display', serif; font-size: 13px; font-style: italic; color: #64748b; margin-bottom: 5px;">This certifies completion for:</p>
                        <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 800; color: #1e293b; line-height: 1.2;">
                            ${data.name}
                        </h2>
                        
                        <div style="margin-bottom: 15px;">
                            <span style="display: block; font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Site Location</span>
                            <span style="font-size: 13px; color: #334155; line-height: 1.4;">${data.loc}</span>
                        </div>

                        <div>
                            <span style="display: block; font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">GPS Coordinates</span>
                            <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #2563eb;">${data.gps || "N/A"}</span>
                        </div>
                    </div>

                    <div style="flex: 1.2; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ea580c; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                            Technical Telemetry
                        </h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                ${row("Total Depth", data.depth, "FT")}
                                ${row("Water Yield", data.yield, "")}
                                ${row("Casing Depth", data.casing_depth, "FT")}
                                ${row("Casing Type", data.casing_type, "")}
                                ${row("Rig Type", data.rigType, "")}
                                ${row("Motor Specs", data.motor, "")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 2px solid #f1f5f9;">
                    
                    <div style="width: 60%;">
                        <p style="margin: 0; font-size: 8px; color: #94a3b8; line-height: 1.5; text-align: justify;">
                            <strong>LEGAL NOTICE:</strong> This document represents the geological conditions observed at the specific coordinates and time of drilling. Subterranean water yield is subject to seasonal fluctuations and environmental changes. This digital record is immutable and archived in the Sagar Borewells Central Database.
                        </p>
                    </div>

                    <div style="text-align: center;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 110px; height: 35px; border: 2px solid #059669; color: #059669; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; transform: rotate(-3deg); opacity: 0.8; margin-bottom: 8px;">
                            VERIFIED
                        </div>
                        <div style="border-top: 1px solid #1e293b; padding-top: 4px; width: 140px;">
                            <p style="margin: 0; font-size: 9px; font-weight: 700; color: #1e293b; text-transform: uppercase;">Authorized Signatory</p>
                            <p style="margin: 0; font-size: 8px; color: #64748b;">Sagar Borewells Ops.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>`;
}
