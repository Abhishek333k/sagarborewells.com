function getCertificateHTML(data) {
    const year = new Date().getFullYear();
    const certID = data.id || `SBW-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const drillDate = data.date || new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'});

    // Helper to generate row only if value exists
    const row = (label, value, extra = "") => {
        if(!value || value === "undefined" || value === "") return "";
        return `
        <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569;">${label}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 800; color: #0f172a; text-align: right;">${value} ${extra}</td>
        </tr>`;
    };

    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; background: #fff; color: #333; position: relative;">
        <div style="position: absolute; inset: 0; opacity: 0.04; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'><text x=\'50%\' y=\'50%\' font-size=\'20\' transform=\'rotate(-45 100 100)\' text-anchor=\'middle\'>SAGAR BOREWELLS</text></svg>'); pointer-events: none;"></div>

        <div style="border: 4px double #1e40af; padding: 30px; height: 95%;">
            <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="color: #1e40af; font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Sagar Borewells</h1>
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #64748b;">Official Geological Record</p>
            </div>

            <div style="background: #f8fafc; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #1e40af; margin-bottom: 30px;">
                <div><span style="font-size: 10px; color: #64748b; text-transform: uppercase; display: block;">Cert ID</span><strong style="font-size: 16px;">${certID}</strong></div>
                <div style="text-align: right;"><span style="font-size: 10px; color: #64748b; text-transform: uppercase; display: block;">Date</span><strong>${drillDate}</strong></div>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; margin: 0 0 5px 0;">${data.name}</h2>
                <p style="margin: 0; color: #64748b; font-size: 12px;">${data.loc}</p>
                <p style="margin: 0; color: #64748b; font-size: 10px; font-family: monospace;">GPS: ${data.gps || 'N/A'}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                    ${row("Total Depth", data.depth, "ft")}
                    ${row("Water Yield", data.yield)}
                    ${row("Casing Depth", data.casing_depth, "ft")}
                    ${row("Casing Type", data.casing_type)}
                    ${row("Rig Mechanism", data.rigType)}
                    ${row("Motor Specs", data.motor)}
                </tbody>
            </table>

            <div style="margin-top: 50px; text-align: center;">
                <span style="border: 2px solid #16a34a; color: #16a34a; font-weight: bold; padding: 5px 15px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Digitally Verified</span>
            </div>
        </div>
    </div>`;
}
