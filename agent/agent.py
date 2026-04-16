import asyncio
from playwright.async_api import async_playwright

async def reset_password(user_email: str, new_password: str = "SecurePass123!"):
    async with async_playwright() as p:
        # Launch the browser
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        print(f"Navigating to IT Admin Panel...")
        await page.goto("http://localhost:5173")

        print(f"Searching for user: {user_email}...")
        await page.wait_for_selector("table")

        try:
            # 1. Locate the row and click the 'Reset Password' button
            user_row = page.get_by_role("row").filter(has_text=user_email)
            reset_button = user_row.get_by_role("button", name="Reset Password")
            
            if await reset_button.count() > 0:
                print(f"Found user row. Clicking 'Reset Password'...")
                await reset_button.click()
                
                # 2. Wait for the Modal to appear
                print("Waiting for Reset Modal...")
                await page.wait_for_selector("text=Reset Credentials")
                
                # 3. Type new passwords into the fields
                print("Filling in new password credentials...")
                # We target by placeholder or proximity
                await page.get_by_placeholder("••••••••").first.fill(new_password)
                await page.get_by_placeholder("••••••••").last.fill(new_password)
                
                # 4. Click the confirm button in the modal
                print("Submitting credential update...")
                await page.get_by_role("button", name="Confirm Cipher Update").click()
                
                # 5. Wait for the success toast
                print("Waiting for system confirmation...")
                await page.wait_for_selector("text=Password successfully reset") 
                print(f"SUCCESS: Agent successfully reset password for {user_email}!")
            else:
                print(f"Could not find 'Reset Password' button for {user_email}")
                
        except Exception as e:
            print(f"Error during automation: {e}")

        # Keep browser open for a few seconds to verify
        await asyncio.sleep(5)
        await browser.close()

if __name__ == "__main__":
    import sys
    target_email = sys.argv[1] if len(sys.argv) > 1 else "john@company.com"
    asyncio.run(reset_password(target_email))
