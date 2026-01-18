import sys
from playwright.sync_api import sync_playwright

def verify_aura():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. Navigate to Aura
        try:
            page.goto("http://localhost:5173/aura")
            # Wait for any image to load instead of the hidden header
            page.wait_for_selector("img", timeout=10000)
            print("Successfully navigated to Aura")
        except Exception as e:
            print(f"Failed to load Aura: {e}")
            sys.exit(1)

        # 2. Screenshot Grid
        page.screenshot(path="aura_grid.png")
        print("Captured aura_grid.png")

        # 3. Click an item (Focus Mode)
        try:
            # Click the first card
            page.click(".group", timeout=5000)

            # Wait for overlay content
            page.wait_for_selector("input[placeholder*='Type a command']", timeout=5000)

            # Allow animation to settle
            page.wait_for_timeout(1000)

            # 4. Interact with Suggestions (Reductionist Prompting)
            # Click "make it darker"
            page.click("text=make it darker")

            # Verify input value updated
            input_val = page.input_value("input")
            if input_val == "make it darker":
                print("Suggestion click successfully updated prompt")
            else:
                print(f"Suggestion click failed. Expected 'make it darker', got '{input_val}'")

            # 5. Screenshot Focus
            page.screenshot(path="aura_focus.png")
            print("Captured aura_focus.png")

        except Exception as e:
            print(f"Failed to interact with grid: {e}")
            page.screenshot(path="aura_error.png")
            sys.exit(1)

        browser.close()

if __name__ == "__main__":
    verify_aura()
