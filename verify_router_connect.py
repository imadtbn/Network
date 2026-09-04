import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Navigating to settings...")
        await page.goto("http://localhost:8000/settings.html")
        await page.wait_for_timeout(2000)

        print("Filling router connection form...")
        # Target the inputs inside the correct card to be safe
        await page.fill("#router-ip", "127.0.0.1:8000") # Use dummy port that returns 404 to avoid timeout
        await page.fill("#router-username", "admin")
        await page.fill("#router-password", "admin123")

        print("Clicking connect...")
        await page.click("#btn-connect-router")

        # Wait a bit for the mock backend response
        await page.wait_for_timeout(2000)

        await page.screenshot(path="settings_router_connect.png", full_page=True)
        print("Screenshot saved to settings_router_connect.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
