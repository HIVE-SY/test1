const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./bot-profile", // This is where the login session will be stored
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,720',
    ]
  });

  const page = await browser.newPage();
  await page.goto("https://accounts.google.com");

  console.log("👉 Please log in to Gmail B in this browser. Do NOT switch profiles or add other accounts.");
  console.log("✅ Close the browser manually when you’re done.");
})();
