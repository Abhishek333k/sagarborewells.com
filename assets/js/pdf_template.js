// FILENAME: assets/js/pdf_template.js

function getInvoiceHTML(data) {
    // Current Date
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // YOU CAN EDIT THE HTML BELOW TO CHANGE THE PDF DESIGN
    return `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 800px; margin: 0 auto; color: #333; background: #fff; padding: 40px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
                <h1 style="color: #2563eb; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">SAGAR BOREWELLS</h1>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666;">Advanced Geological Drilling Solutions</p>
            </div>
            <div style="text-align: right;">
                <h2 style="margin: 0; color: #333; font-size: 20px;">ESTIMATE</h2>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666;">#WEB-${Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div style="width: 45%;">
                <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Billed To</p>
                <h3 style="margin: 0 0 5px 0; font-size: 16px;">${data.name}</h3>
                <p style="margin: 0; font-size: 14px; color: #555;">${data.mobile}</p>
            </div>
            <div style="width: 45%; text-align: right;">
                <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Site Location</p>
                <h3 style="margin: 0 0 5px 0; font-size: 16px;">${data.loc}</h3>
                <p style="margin: 0; font-size: 14px; color: #555;">${date} | ${time}</p>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="background-color: #f8fafc; text-align: left;">
                    <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 12px; color: #64748b; text-transform: uppercase;">Description</th>
                    <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 12px; color: #64748b; text-transform: uppercase; text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.rows}
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px;">Fixed Operational Costs (Transport/Setup)</td>
                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; font-weight: bold;">₹7,000</td>
                </tr>
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
            <div style="width: 250px; background: #f1f5f9; padding: 20px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Estimated Total</span>
                    <span style="font-size: 24px; color: #2563eb; font-weight: 800;">₹${data.total.toLocaleString()}</span>
                </div>
                <p style="font-size: 10px; color: #94a3b8; margin-top: 10px; text-align: right;">*Excludes GST & Material Costs</p>
            </div>
        </div>

        <div style="border-top: 2px solid #f1f5f9; padding-top: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #333; text-transform: uppercase;">Terms & Conditions</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: #666; line-height: 1.6;">
                <li>This is an estimate only. Final billing based on actual depth drilled in feet.</li>
                <li>80% payment required upon rig arrival. Balance upon completion.</li>
                <li>Water yield is geological and not guaranteed by Sagar Borewells.</li>
            </ul>
        </div>

        <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                </div>
            <div style="text-align: center;">
                <div style="width: 150px; border-bottom: 1px solid #ccc; margin-bottom: 10px;"></div>
                <p style="margin: 0; font-size: 12px; color: #999;">Authorized Signatory</p>
            </div>
        </div>

    </div>
    `;
}
