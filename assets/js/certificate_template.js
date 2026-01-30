function getCertificateHTML(data) {
    return `
    <div style="font-family: 'Times New Roman', serif; padding: 40px; border: 10px double #1e40af; color: #333; background: #fff; position: relative;">
        
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; font-size: 100px; font-weight: bold; color: #000; z-index: 0; pointer-events: none;">
            SAGAR
        </div>

        <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; position: relative; z-index: 1;">
            <h1 style="color: #1e40af; font-size: 36px; margin: 0; letter-spacing: 2px;">SAGAR BOREWELLS</h1>
            <p style="margin: 5px 0 0; font-size: 14px; text-transform: uppercase;">Official Record of Sub-Surface Infrastructure</p>
            <h2 style="font-family: 'Helvetica', sans-serif; color: #b91c1c; font-size: 24px; margin-top: 20px; text-transform: uppercase; border: 2px solid #b91c1c; display: inline-block; padding: 5px 20px;">
                Borewell Birth Certificate
            </h2>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-family: 'Helvetica', sans-serif;">
            <div>
                <strong>Borewell ID:</strong> ${data.id}<br>
                <strong>Owner:</strong> ${data.name}<br>
                <strong>Location:</strong> ${data.loc}
            </div>
            <div style="text-align: right;">
                <strong>Date Drilled:</strong> ${data.date}<br>
                <strong>Coordinates:</strong> ${data.gps || "N/A"}<br>
                <strong>Rig Type:</strong> Sensor/Robo Hydraulic
            </div>
        </div>

        <h3 style="background: #f1f5f9; padding: 10px; border-left: 5px solid #1e40af; margin-bottom: 15px;">Technical Specifications</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px; width: 50%;"><strong>Total Depth Drilled</strong></td>
                <td style="border: 1px solid #ccc; padding: 10px; font-weight: bold; font-size: 16px;">${data.depth} Feet</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;"><strong>Casing Pipe Installed</strong></td>
                <td style="border: 1px solid #ccc; padding: 10px;">${data.casing_depth} Feet (${data.casing_type})</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;"><strong>Water Yield (Output)</strong></td>
                <td style="border: 1px solid #ccc; padding: 10px; color: #15803d; font-weight: bold;">${data.yield}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;"><strong>Water Source Detected At</strong></td>
                <td style="border: 1px solid #ccc; padding: 10px;">${data.water_gap} Feet</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;"><strong>Motor Pump Installed</strong></td>
                <td style="border: 1px solid #ccc; padding: 10px;">${data.motor}</td>
            </tr>
        </table>

        <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 10px; color: #666; width: 60%;">
                <strong>Legacy Service Warranty:</strong><br>
                This borewell is registered in the Sagar Legacy System. All future maintenance, flushing, and motor repairs will be logged against ID: ${data.id}.
            </div>
            <div style="text-align: center;">
                <img src="https://i.imgur.com/your-signature-placeholder.png" style="height: 50px; opacity: 0.8;">
                <div style="width: 200px; border-bottom: 1px solid #333; margin-bottom: 5px;"></div>
                <p style="margin: 0; font-size: 12px; font-weight: bold;">Authorized Geologist</p>
            </div>
        </div>
    </div>
    `;
}
