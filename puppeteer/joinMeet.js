const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const meetUrl = process.env.MEET_URL;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
    userDataDir: "./bot-profile",
    args: [
      '--use-fake-ui-for-media-stream',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1280,720',
    ],
  });

  const page = await browser.newPage();
  await page.goto(meetUrl, { waitUntil: "networkidle2", timeout: 60000 });

  // Wait for join screen to fully render
  await new Promise(resolve => setTimeout(resolve, 3000));

  // ✅ Mute mic
  try {
    await page.keyboard.down('Control');
    await page.keyboard.press('E');
    await page.keyboard.up('Control');
    console.log("🎙️ Mic muted");
  } catch (e) {
    console.warn("⚠️ Mic mute failed:", e.message);
  }

  // ✅ Disable camera
  try {
    await page.keyboard.down('Control');
    await page.keyboard.press('D');
    await page.keyboard.up('Control');
    console.log("📷 Camera off");
  } catch (e) {
    console.warn("⚠️ Camera toggle failed:", e.message);
  }

  // ✅ Click "Join" button (any language)
  try {
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));

      for (let btn of buttons) {
        const text = btn.innerText.trim().toLowerCase();
        const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";
        const jsname = btn.getAttribute("jsname") || "";

        const isJoinBtn =
          (text && text.length < 30 && btn.offsetHeight > 0 && btn.offsetWidth > 0) && (
            text.includes("join") ||
            text.includes("solicitar") ||
            text.includes("pedir") ||
            text.includes("unirse") ||
            text.includes("rejoindre") || // French
            text.includes("beitreten") || // German
            text.includes("参加") ||     // Japanese
            ariaLabel.includes("join") ||
            jsname === "Qx7uuf"
          );

        if (isJoinBtn) {
          btn.click();
          return true;
        }
      }

      return false;
    });

    if (clicked) {
      console.log("🚪 Clicked 'Join' button");
    } else {
      console.warn("⚠️ Could not find the join button");
    }
  } catch (e) {
    console.error("❌ Failed to click join:", e.message);
  }

  // 🧪 Optional: keep browser open
  // await page.waitForTimeout(10000);
})();
