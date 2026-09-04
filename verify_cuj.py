import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Navigating to index...")
        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="dashboard_real_mode.png", full_page=True)
        print("Screenshot saved to dashboard_real_mode.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
