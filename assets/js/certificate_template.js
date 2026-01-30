function getCertificateHTML(data) {
    const certID = data.id || "SBR-GEN";
    const drillDate = data.date || "N/A";

    return `
    <div style="width: 800px; padding: 40px; margin: 0 auto; font-family: Helvetica, sans-serif; color: #333; position: relative;">
        
        <div style="text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1e40af; font-size: 32px; margin: 0; text-transform: uppercase;">Sagar Borewells</h1>
            <p style="margin: 5px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666;">Advanced Geological Drilling Solutions</p>
        </div>

        <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: #f0f9ff; border: 1px solid #1e40af; color: #1e40af; font-weight: bold; padding: 10px 30px; border-radius: 50px; text-transform: uppercase;">
                Official Birth Certificate
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
                <p style="font-size: 10px; color: #999; text-transform: uppercase; margin: 0;">Certificate ID</p>
                <h3 style="margin: 0; font-size: 18px;">${certID}</h3>
            </div>
            <div style="text-align: right;">
                <p style="font-size: 10px; color: #999; text-transform: uppercase; margin: 0;">Completion Date</p>
                <h3 style="margin: 0; font-size: 16px;">${drillDate}</h3>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #ddd;">
            <tr style="background: #f8fafc;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Name</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${data.name}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Location</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${data.loc}</td>
            </tr>
            <tr style="background: #f8fafc;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">GPS Coordinates</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${data.gps || "N/A"}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Total Depth</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px; color: #000;">${data.depth} Feet</td>
            </tr>
            <tr style="background: #f8fafc;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Water Yield</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; color: green; font-weight: bold;">${data.yield}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Casing Details</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${data.casing_depth} ft (${data.casing_type})</td>
            </tr>
            <tr style="background: #f8fafc;">
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Rig Type</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${data.rigType || "Hydraulic"}</td>
            </tr>
        </table>

        <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 10px; color: #777; display: flex; justify-content: space-between;">
            <div style="width: 60%;">
                This is a system-generated document from Sagar Borewells Cloud Database.<br>
                For maintenance, reference ID: <strong>${certID}</strong>
            </div>
            <div style="text-align: center;">
                <div style="font-weight: bold; color: #1e40af; border: 2px solid #1e40af; padding: 5px 10px; border-radius: 4px; display: inline-block;">
                    DIGITALLY VERIFIED
                </div>
            </div>
        </div>

    </div>`;
}
