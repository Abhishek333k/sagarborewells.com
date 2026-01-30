// FILENAME: assets/js/certificate_template.js
function getCertificateHTML(data) {
    const year = new Date().getFullYear();
    const certID = data.id || `SBW-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const drillDate = data.date || new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'});

    return `
    <div style="font-family: 'Plus Jakarta Sans', Helvetica, sans-serif; position: relative; width: 100%; height: 100%; color: #334155; background: #fff; overflow: hidden;">
        
        <div style="position: absolute; inset: 0; z-index: 0; opacity: 0.04; pointer-events: none; 
            background-image: url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'><text x=\'50%\' y=\'50%\' font-family=\'Arial\' font-weight=\'bold\' font-size=\'30\' fill=\'%23000\' transform=\'rotate(-45 150 150)\' text-anchor=\'middle\'>SAGAR BOREWELLS</text></svg>'); 
            background-repeat: repeat;">
        </div>

        <div style="position: relative; z-index: 10; border: 4px double #2563eb; height: 94%; margin: 3%; padding: 40px; box-sizing: border-box; background: rgba(255,255,255,0.8);">
            
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
                <h1 style="color: #1e40af; font-size: 36px; font-weight: 900; margin: 0; letter-spacing: -1px; text-transform: uppercase;">Sagar Borewells</h1>
                <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 4px; color: #64748b; margin-top: 5px; font-weight: 600;">Advanced Geological Drilling Solutions</p>
                <div style="margin-top: 20px;">
                    <span style="background: #1e40af; color: white; padding: 8px 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Official Birth Certificate</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">
                <div>
                    <span style="display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: bold;">Certificate ID</span>
                    <span style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: monospace;">${certID}</span>
                </div>
                <div style="text-align: right;">
                    <span style="display: block; font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: bold;">Date of Completion</span>
                    <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${drillDate}</span>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">This document certifies the successful commissioning of a borewell for:</p>
                <h2 style="font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0;">${data.name}</h2>
                <div style="font-size: 13px; color: #475569;">
                    <strong>Site Location:</strong> ${data.loc} <br>
                    <strong>GPS Coordinates:</strong> ${data.gps || "N/A"}
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                <thead>
                    <tr style="background: #1e40af; color: white;">
                        <th style="padding: 10px; font-size: 11px; text-transform: uppercase; text-align: left;">Parameter</th>
                        <th style="padding: 10px; font-size: 11px; text-transform: uppercase; text-align: right;">Verified Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Total Drilled Depth</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 800; color: #0f172a; text-align: right;">${data.depth} Feet</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Casing Installed</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #334155; text-align: right;">${data.casing_depth} ft (${data.casing_type})</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Water Yield</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #16a34a; text-align: right;">${data.yield}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">Rig Type</td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: right;">${data.rigType || "Hydraulic"}</td>
                    </tr>
                </tbody>
            </table>

            <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="font-size: 9px; color: #94a3b8; max-width: 60%;">
                    <strong>System Record:</strong> This is a digitally generated certificate stored in the Sagar Borewells Cloud Database.<br>
                    Verify at: <u>sagarborewells.com/verify/${certID}</u>
                </div>
                <div style="text-align: center;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1024px-Infobox_info_icon.svg.png" style="height: 40px; opacity: 0.2; margin-bottom: 5px;">
                    <div style="border-top: 1px solid #0f172a; width: 150px; padding-top: 5px;">
                        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #0f172a;">AUTHORIZED SIGNATORY</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
}
