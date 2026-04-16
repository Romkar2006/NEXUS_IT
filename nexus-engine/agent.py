import asyncio
import os
import json
import re
import google.generativeai as genai
from playwright.async_api import async_playwright
from dotenv import load_dotenv

# 🔐 Setup Configuration
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 🌐 Environment Routes
BASE_URL = "http://127.0.0.1:5173"
VALID_DEPTS = ["Security Operations", "Architecture Lab", "Data Engineering", "Core Infrastructure"]

# --- 🛰️ Tactical UI Colors (ANSI) ---
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

if API_KEY and "PASTE_YOUR" not in API_KEY:
    genai.configure(api_key=API_KEY)

# --- 🛰️ Specialized AI Logging Protocol ---

async def log_agent_action(page, action, target):
    try:
        await page.evaluate(f"""
            fetch('http://localhost:8000/api/logs', {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{
                    date: new Date().toLocaleDateString('en-US', {{ month: 'short', day: 'numeric' }}),
                    time: new Date().toLocaleTimeString([], {{ hour: '2-digit', minute: '2-digit', second: '2-digit' }}),
                    action: '[AI_AGENT] {action}',
                    target: '{target}',
                    actor: 'Nexus AI Core',
                    status: 'SUCCESS'
                }})
            }})
        """)
    except: pass

# --- 🦾 Hyper-Resilient Agent Logic ---

async def wait_for_app(page):
    print(f"{CYAN}🛰️  [SYSTEM] Initializing Uplink to Nexus Grid...{RESET}")
    try:
        await page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
        print(f"{GREEN}🟢 [SUCCESS] Neural Link Established. Authorized.{RESET}")
    except:
        print(f"{YELLOW}⚠️  [RETRY] Connection unstable. Re-syncing...{RESET}")
        await page.goto(BASE_URL)
        await asyncio.sleep(2)

async def reset_password_task(page, email, **kwargs):
    print(f"\n{MAGENTA}{BOLD}--- 🦾 MISSION START: SECURITY RESET [{email}] ---{RESET}")
    await wait_for_app(page)
    await log_agent_action(page, "Security Reset Initialized", email)
    
    print(f"{CYAN}🔍 Scanning Central Directory for node...{RESET}")
    await page.get_by_placeholder(re.compile("Search", re.IGNORECASE)).fill(email)
    await asyncio.sleep(1.5)
    
    row = page.locator("tr").filter(has_text=email)
    if await row.count() == 0:
        raise Exception(f"Identity '{email}' not found in registry.")

    print(f"{CYAN}🔓 Bypassing security locks...{RESET}")
    await row.get_by_role("button", name=re.compile("Reset", re.IGNORECASE)).click(force=True)
    await page.wait_for_selector("text=Reset Password", state="visible")
    
    print(f"{CYAN}💾 Overwriting encrypted credentials...{RESET}")
    pass_fields = page.locator("input[type='password']")
    await pass_fields.first.press_sequentially("Nexus_Security_2026!", delay=40)
    await pass_fields.last.press_sequentially("Nexus_Security_2026!", delay=40)
    
    print(f"{CYAN}📤 Committing change to global ledger...{RESET}")
    await page.get_by_role("button", name=re.compile("Update Password", re.IGNORECASE)).click()
    await page.wait_for_selector("text=successfully", timeout=12000)
    
    await log_agent_action(page, "Password Update Finalized", email)
    print(f"{GREEN}✅ [MISSION COMPLETE] Credentials sanitized and reset.{RESET}")

async def create_user_task(page, name, email, role="USER", dept="Security Operations", **kwargs):
    if not role or role == "None": role = "USER"
    if not dept or dept == "None": dept = "Security Operations"
    
    print(f"\n{MAGENTA}{BOLD}--- 🦾 MISSION START: IDENTITY PROVISIONING [{name}] ---{RESET}")
    await wait_for_app(page)
    
    await log_agent_action(page, f"Protocol: Provisioning Sequence Start", email)
    
    print(f"{CYAN}🔍 Vetting centralized nodes...{RESET}")
    await page.get_by_placeholder(re.compile("Search", re.IGNORECASE)).fill(email)
    await asyncio.sleep(1.5)
    if await page.locator("tr").filter(has_text=email).count() > 0:
        print(f"{YELLOW}💡 [NOTICE] Identity exists. Aborting redundant entry.{RESET}")
    else:
        print(f"{CYAN}🚀 Initializing Secure Workspace...{RESET}")
        await page.goto(f"{BASE_URL}/create", wait_until="networkidle")
        
        print(f"{CYAN}🧬 Injecting identity metadata...{RESET}")
        await page.get_by_placeholder("e.g. Marcus Thorne").press_sequentially(name, delay=40)
        await page.get_by_placeholder("m.thorne@nexus.it").press_sequentially(email, delay=40)
        
        print(f"{CYAN}🛡️ Assigning Clearance: {role}...{RESET}")
        try:
            await page.get_by_role("button", name=str(role).upper(), exact=True).click()
        except:
            await page.get_by_role("button", name="USER", exact=True).click()
        
        print(f"{CYAN}🛰️ Mapping to {dept}...{RESET}")
        if dept not in VALID_DEPTS: dept = "Security Operations"
        await page.locator("select").select_option(label=dept)
        
        print(f"{CYAN}⚡ Executing Commit sequence...{RESET}")
        await page.locator("button[type='submit']").click()
        await page.wait_for_selector("text=successfully", timeout=15000)
        print(f"{GREEN}✅ [SUCCESS] Node online and registered.{RESET}")

    print(f"{CYAN}📜 Auditing mission status...{RESET}")
    await asyncio.sleep(1)
    await page.goto(f"{BASE_URL}/audit", wait_until="networkidle")
    await asyncio.sleep(1.5)
    if await page.locator("tr").filter(has_text=email).count() > 0:
        await log_agent_action(page, "Final Verification Sequence", email)
        print(f"{GREEN}🔍 [VERIFIED] Operation confirmed in Audit Ledger.{RESET}")
    else:
        print(f"{RED}⚠️  [WARNING] Registry sync delayed.{RESET}")

# --- 🧠 Reasoning Logic ---

async def ask_brain(instruction: str):
    print(f"\n{CYAN}🧠 Engaging Neural Processor...{RESET}")
    instr = instruction.lower()
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', instr)
    email = email_match.group(0) if email_match else "unknown@nexus.it"
    
    if "reset" in instr:
        return {"task": "reset_password", "email": email}

    if API_KEY and "PASTE_YOUR" not in API_KEY:
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            prompt = f"Convert to JSON: '{instruction}'. Valid Depts: {VALID_DEPTS}. Fields: task, name, email, role, dept."
            response = await asyncio.to_thread(model.generate_content, prompt)
            text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except Exception:
            pass
    
    # Robust local extraction fallback
    name_match = re.search(r"named\s+([\w\s]+?)(?:\s+at|\s+with|\s+as|$|for)", instr)
    name = name_match.group(1).title().strip() if name_match else "New User"
    role = "ADMIN" if "admin" in instr else "VIEWER" if "viewer" in instr else "USER"
    dept = "Security Operations"
    for d in VALID_DEPTS:
        if d.lower() in instr: dept = d
        
    return {"task": "create_user", "name": name, "email": email, "role": role, "dept": dept}

# --- 🏁 Main Terminal Interface ---

async def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"""{CYAN}
    █▄▄ █▀▀ █▄░█ █░█ █▀
    █▄▄ ██▄ █░▀█ █▄█ ▄█  
    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    {BOLD}NEXUS IT AGENT | v5.0 ELITE ACTIVE{RESET}
    {CYAN}Environment: Tactical Command Center (CLI)
    Target Infrastructure: http://127.0.0.1:5173
    {RESET}""")
    
    while True:
        try:
            prompt = input(f"{YELLOW}🎙️ MISSION READY > {RESET}")
            if not prompt or prompt.lower() in ['exit', 'quit']: break
            
            command = await ask_brain(prompt)
            if not command: continue

            async with async_playwright() as p:
                print(f"{MAGENTA}🚀 Deployment initiated...{RESET}")
                browser = await p.chromium.launch(headless=False, slow_mo=700)
                page = await browser.new_page(viewport={'width': 1366, 'height': 768})
                try:
                    if command.get('task') == 'reset_password': await reset_password_task(page, **command)
                    elif command.get('task') == 'create_user': await create_user_task(page, **command)
                except Exception as e: print(f"{RED}❌ [ABORTED] {e}{RESET}")
                await asyncio.sleep(4)
                await browser.close()
        except (EOFError, KeyboardInterrupt): break
    print(f"\n{YELLOW}System Terminated.{RESET}")

if __name__ == "__main__":
    asyncio.run(main())
