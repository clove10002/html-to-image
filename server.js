const express = require('express');
const puppeteer = require('puppeteer-core');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text({ type: '*/*', limit: '5mb' }));

function getChromePath() {
  return '/usr/bin/chromium-browser'; // ✅ This works on Render
}

app.get('/', (req, res) => {
  res.send('✅ HTML to Image API is running. POST to /html-to-image');
});

app.post('/html-to-image', async (req, res) => {
  try {
    const html = req.body;

    const browser = await puppeteer.launch({
      executablePath: getChromePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 800, height: 800 });

    const image = await page.screenshot({ type: 'png' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(image);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send(`Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
