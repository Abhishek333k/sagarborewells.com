function getCertificateHTML(data) {
    const year = new Date().getFullYear();
    const certID = data.id || `SBW-${year}-${Math.floor(100000 + Math.random() * 900000)}`; 
    const dateObj = data.date ? new Date(data.date) : new Date();
    const drillDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Helper for rows
    const row = (label, value, unit = "") => {
        if (!value || value === "undefined" || value === "" || value === "-- None --") return "";
        return `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding: 8px 0;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">${label}</span>
            <span style="font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a;">${value} ${unit}</span>
        </div>`;
    };

    return `
    <div style="width: 210mm; min-height: 297mm; background: #fff; padding: 10mm; box-sizing: border-box; font-family: sans-serif; position: relative;">
        <div style="border: 2px solid #1e293b; height: 100%; padding: 5px; box-sizing: border-box;">
            <div style="border: 1px solid #f59e0b; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column;">
                
                <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="margin: 0; font-size: 32px; color: #1e293b; text-transform: uppercase; letter-spacing: 2px;">Sagar <span style="color: #2563eb;">Borewells</span></h1>
                    <p style="margin: 5px 0 0; font-size: 9px; color: #64748b; letter-spacing: 3px; text-transform: uppercase;">Water Resource Infrastructure</p>
                </div>

                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 30px; border-radius: 50px;">
                        <h2 style="margin: 0; font-size: 14px; text-transform: uppercase; color: #0f172a; letter-spacing: 1px;">Borewell Commissioning Record</h2>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: auto;">
                    
                    <div>
                        <h3 style="font-size: 11px; color: #2563eb; text-transform: uppercase; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px;">Client Profile</h3>
                        <div style="margin-bottom: 15px;">
                            <p style="margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase;">Issued To</p>
                            <p style="margin: 2px 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">${data.name}</p>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <p style="margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase;">Site Location</p>
                            <p style="margin: 2px 0 0; font-size: 12px; color: #334155;">${data.loc}</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase;">GPS Coordinates</p>
                            <p style="margin: 2px 0 0; font-family: monospace; font-size: 12px; color: #2563eb;">${data.gps || "Not Recorded"}</p>
                        </div>
                    </div>

                    <div>
                        <h3 style="font-size: 11px; color: #f59e0b; text-transform: uppercase; border-bottom: 2px solid #f59e0b; padding-bottom: 5px; margin-bottom: 15px;">Technical Data</h3>
                        ${row("Drilled Depth", data.depth, "FT")}
                        ${row("Water Yield", data.yield, "")}
                        ${row("Casing Depth", data.casing_depth, "FT")}
                        ${row("Casing Type", data.casing_type, "")}
                        ${row("Rig Type", data.rigType, "")}
                        ${row("Motor Installed", data.motor, "")}
                    </div>
                </div>

                <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <p style="margin: 0; font-size: 10px; color: #94a3b8;">Certificate ID: <strong style="color: #0f172a;">${certID}</strong></p>
                        <p style="margin: 3px 0 0; font-size: 10px; color: #94a3b8;">Date: <strong style="color: #0f172a;">${drillDate}</strong></p>
                    </div>
                    <div style="text-align: right;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${certID}" style="width: 50px; opacity: 0.8;">
                        <p style="margin: 5px 0 0; font-size: 8px; color: #94a3b8; text-transform: uppercase;">Official Verification</p>
                    </div>
                </div>

            </div>
        </div>
    </div>`;
}
