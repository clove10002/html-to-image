const express = require('express');
const puppeteer = require('puppeteer-core');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');

const app = express();
app.use(bodyParser.text({ type: '*/*', limit: '5mb' }));

// Find Chrome path
function getChromePath() {
  try {
    return execSync('which chromium-browser').toString().trim();
  } catch {
    return '/usr/bin/google-chrome'; // fallback
  }
}

app.post('/html-to-image', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
