// FILENAME: assets/js/certificate_template.js

function getCertificateHTML(data) {
    // 1. DATA PREP
    const year = new Date().getFullYear();
    const certID = data.id || `SBW-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const drillDate = data.date || new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'});

    // 2. HELPER: Generate Table Row (Returns empty string if value is missing)
    const row = (label, value, extra = "") => {
        if(!value || value === "undefined" || value === "" || value === "-- None --") return "";
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px;">${label}</td>
            <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; font-family: 'Courier New', monospace;">${value} ${extra}</td>
        </tr>`;
    };

    // 3. THE TEMPLATE
    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; position: relative; width: 100%; height: 100%; background: #fff; padding: 20px; box-sizing: border-box;">
        
        <div style="position: absolute; inset: 0; opacity: 0.03; z-index: 0; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><text x=\'50%\' y=\'50%\' font-family=\'Arial\' font-weight=\'900\' font-size=\'20\' fill=\'%23000\' transform=\'rotate(-45 50 50)\' text-anchor=\'middle\'>SBW</text></svg>'); 
            background-repeat: repeat;">
        </div>

        <div style="position: relative; z-index: 10; height: 98%; border: 2px solid #1e40af; padding: 4px;">
            <div style="height: 100%; border: 1px solid #94a3b8; padding: 40px; box-sizing: border-box; background: rgba(255,255,255,0.85);">
                
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #1e40af; font-size: 36px; font-weight: 900; margin: 0; letter-spacing: -1px; text-transform: uppercase; line-height: 1;">SAGAR BOREWELLS</h1>
                    <div style="width: 60px; height: 3px; background: #ea580c; margin: 10px auto;"></div> 
                    <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #64748b; font-weight: bold;">Advanced Geological Infrastructure</p>
                </div>

                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="display: inline-block; padding: 10px 40px; border: 1px solid #1e40af; border-radius: 2px; background: #eff6ff;">
                        <h2 style="font-family: 'Times New Roman', serif; font-size: 22px; color: #1e293b; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Certificate of Commissioning</h2>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
                    <div style="width: 45%;">
                        <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Registration ID</p>
                        <p style="margin: 5px 0 0; font-size: 18px; font-weight: 700; color: #1e40af; font-family: monospace;">${certID}</p>
                    </div>
                    <div style="width: 45%; text-align: right;">
                        <p style="margin: 0; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold;">Date of Issue</p>
                        <p style="margin: 5px 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${drillDate}</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="font-family: 'Times New Roman', serif; font-size: 14px; color: #334155; text-align: center; font-style: italic; margin-bottom: 20px;">
                        This document certifies that a subterranean water extraction point has been successfully drilled and commissioned for:
                    </p>
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h3 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase;">${data.name}</h3>
                        <p style="font-size: 12px; color: #64748b; margin-top: 5px;">${data.loc}</p>
                        <p style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 2px;">GPS: ${data.gps || "Coordinates Not Logged"}</p>
                    </div>

                    <div style="background: #f8fafc; padding: 20px; border-radius: 4px; border: 1px solid #e2e8f0;">
                        <h4 style="margin: 0 0 15px 0; font-size: 11px; text-transform: uppercase; color: #1e40af; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Technical Specifications</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                ${row("Total Drilled Depth", data.depth, "ft")}
                                ${row("Water Yield Capacity", data.yield)}
                                ${row("Casing Pipe Depth", data.casing_depth, "ft")}
                                ${row("Casing Material", data.casing_type)}
                                ${row("Drilling Rig Type", data.rigType)}
                                ${row("Pump / Motor Specs", data.motor)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="width: 60%;">
                        <p style="font-size: 9px; color: #94a3b8; line-height: 1.4;">
                            <strong>Note:</strong> This certificate represents the geological status at the time of drilling. Future yield may vary due to environmental factors. This record is permanently stored in the Sagar Borewells Cloud Registry.
                        </p>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 100px; height: 40px; border: 2px solid #16a34a; color: #16a34a; font-weight: 900; font-size: 10px; display: flex; align-items: center; justify-content: center; transform: rotate(-5deg); opacity: 0.8; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                            VERIFIED
                        </div>
                        <p style="margin: 10px 0 0; font-size: 10px; font-weight: 700; color: #0f172a; border-top: 1px solid #0f172a; padding-top: 5px; width: 140px;">
                            Authorized Signatory
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>`;
}
