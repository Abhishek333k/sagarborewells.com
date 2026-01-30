// FILENAME: assets/js/certificate_template.js

function getCertificateHTML(data) {
    // 1. Generate ID if missing (SBW-YEAR-RANDOM)
    const year = new Date().getFullYear();
    const certID = data.id || `SBW-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // 2. Format Date
    const drillDate = data.date || new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'});

    return `
    <div style="font-family: 'Plus Jakarta Sans', Helvetica, sans-serif; position: relative; width: 100%; height: 100%; color: #334155; background: #fff;">
        
        <div style="position: absolute; inset: 0; opacity: 0.03; z-index: 0; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'><text x=\'50%\' y=\'50%\' font-size=\'24\' fill=\'%23000\' transform=\'rotate(-45 100 100)\' text-anchor=\'middle\'>SAGAR BOREWELLS</text></svg>');"></div>

        <div style="position: relative; z-index: 10; border: 2px solid #cbd5e1; height: 95%; margin: 2.5%; padding: 40px; box-sizing: border-box;">
            
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #2563eb; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px;">SAGAR BOREWELLS</h1>
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-top: 5px;">Advanced Geological Drilling Solutions</p>
                
                <div style="margin-top: 30px;">
                    <span style="background: #f1f5f9; padding: 10px 25px; border-radius: 50px; font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #e2e8f0;">
                        Official Birth Certificate
                    </span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                <div>
                    <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin: 0;">Certificate Registration ID</p>
                    <p style="font-size: 18px; font-weight: 800; color: #1e293b; margin: 0;">${certID}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; margin: 0;">Completion Date</p>
                    <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0;">${drillDate}</p>
                </div>
            </div>

            <div style="margin-bottom: 40px;">
                <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">This document certifies the commissioning of a subterranean water extraction point for:</p>
                <h3 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0;">${data.name || "Authorized Client"}</h3>
                
                <div style="display: flex; gap: 20px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <div style="flex: 1;">
                        <span style="display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Site Location</span>
                        <span style="font-size: 14px; font-weight: 600; color: #334155;">${data.loc}</span>
                    </div>
                    <div style="flex: 1;">
                        <span style="display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">GPS Coordinates</span>
                        <span style="font-size: 14px; font-weight: 600; color: #334155;">${data.gps || "Not Recorded"}</span>
                    </div>
                </div>
            </div>

            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px;">
                <thead>
                    <tr style="text-align: left;">
                        <th style="font-size: 10px; text-transform: uppercase; color: #94a3b8; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Specification</th>
                        <th style="font-size: 10px; text-transform: uppercase; color: #94a3b8; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">Verified Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569;">Total Drilled Depth</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 16px; font-weight: 800; color: #1e293b; text-align: right;">${data.depth} Feet</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569;">Casing Installed</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #334155; text-align: right;">${data.casing_depth} ft <span style="font-size: 12px; color: #94a3b8; font-weight: 400;">(${data.casing_type})</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569;">Water Yield</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 700; color: #16a34a; text-align: right;">${data.yield}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569;">Motor Pump</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #334155; text-align: right;">${data.motor}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="width: 50%;">
                    <p style="font-size: 9px; color: #94a3b8; line-height: 1.5;">
                        <strong>Legacy System Record:</strong> This borewell is permanently logged in the Sagar Borewells Cloud Database. All future maintenance, flushing, or pump replacements should reference Certificate ID <strong>${certID}</strong>.
                    </p>
                </div>
                <div style="text-align: right;">
                    <div style="display: inline-block; border: 2px solid #10b981; padding: 5px 15px; border-radius: 4px; color: #10b981; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; opacity: 0.8;">
                        System Verified
                    </div>
                    <p style="margin: 0; font-size: 11px; font-weight: 700; color: #1e293b;">Digital Authority</p>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Sagar Borewells Ops</p>
                </div>
            </div>

        </div>
    </div>
    `;
}
