const express = require('express');
const puppeteer = require('puppeteer-core');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const chromiumPath = '/usr/bin/chromium';

app.use(bodyParser.text({ type: '*/*', limit: '5mb' }));

// Rate limiter to prevent overloading the container
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // max 10 requests per minute
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('✅ HTML to Image API is running. POST HTML to /html-to-image');
});

app.post('/html-to-image', async (req, res) => {
  let browser;
  try {
    const html = req.body;

    browser = await puppeteer.launch({
      executablePath: chromiumPath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 800, height: 800 });

    const image = await page.screenshot({ type: 'png' });

    res.setHeader('Content-Type', 'image/png');
    res.send(image);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send(`Error: ${err.message}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.warn('⚠️ Failed to close browser:', e);
      }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
