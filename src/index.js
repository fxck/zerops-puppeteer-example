const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  let browser = null;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
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
    console.log('Navigating to page...');

    await page.goto('https://zerops.io', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || 'No description found',
      h1: document.querySelector('h1')?.innerText || 'No H1 found',
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }));

    await browser.close();
    console.log('Page info collected:', pageInfo);

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: pageInfo
    });

  } catch (error) {
    console.error('Error:', error);
    if (browser) {
      await browser.close().catch(console.error);
    }
    res.status(500).json({
      error: 'Failed to analyze page',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
