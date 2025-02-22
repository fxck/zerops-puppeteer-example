const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  let browser = null;
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--remote-debugging-port=9222',
        '--hide-scrollbars',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--no-first-run',
        '--disable-setuid-sandbox'
      ]
    });
    console.log('Browser launched successfully');

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to page...');
    const response = await page.goto('https://zerops.io', {
      waitUntil: 'domcontentloaded', // Less strict than networkidle0
      timeout: 30000
    });
    console.log('Navigation status:', response?.status());
    console.log('Navigation headers:', response?.headers());

    const screenshot = await page.screenshot();
    await browser.close();

    res.type('png').send(screenshot);
  } catch (error) {
    console.error('Screenshot error:', error);
    if (browser) {
      await browser.close().catch(console.error);
    }
    res.status(500).json({ 
      error: 'Failed to take screenshot',
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
