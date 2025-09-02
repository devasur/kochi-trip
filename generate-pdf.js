const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateTravelCardsPDF() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'Kochi_Travel_Cards.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set the HTML content
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
    });
    
    // Generate PDF with custom options for card format
    const pdf = await page.pdf({
        path: 'Kochi_Travel_Cards.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });
    
    console.log('✅ PDF generated successfully: Kochi_Travel_Cards.pdf');
    console.log('📄 Total pages: Each card is on a separate page');
    console.log('🎨 Features: Full color, gradients, and styling preserved');
    
    await browser.close();
}

// Error handling
generateTravelCardsPDF().catch(error => {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
});