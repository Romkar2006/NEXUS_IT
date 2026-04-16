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
    print(f"{CYAN}🛰️  [SYSTEM] Initializing Uplink...{RESET}")
    try:
        await page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
    except:
        await page.goto(BASE_URL)
        await asyncio.sleep(2)

async def security_audit_task(page, **kwargs):
    """ADVANCED MISSION: Scans the entire directory for security compliance."""
    print(f"\n{MAGENTA}{BOLD}--- 🛡️ MISSION: COMPREHENSIVE SECURITY AUDIT ---{RESET}")
    await wait_for_app(page)
    await log_agent_action(page, "Global Security Audit Initialized", "Identity Directory")
    
    print(f"{CYAN}🔍 Crawling User Database for anomalies...{RESET}")
    rows = page.locator("tr")
    count = await rows.count() - 1 # Exclude header
    
    if count <= 0:
        print(f"{YELLOW}⚠️  No identities found to audit.{RESET}")
        return

    admins = 0
    insecure = 0
    
    print(f"{CYAN}📊 Analyzing {count} identity nodes...{RESET}")
    for i in range(1, count + 1):
        text = await rows.nth(i).inner_text()
        if "ADMIN" in text: admins += 1
        if "pending" in text.lower(): insecure += 1
        
    print(f"\n{BOLD}📝 SECURITY HEALTH REPORT:{RESET}")
    print(f"├─ Total Identities: {count}")
    print(f"├─ Authorized Admins: {admins}")
    print(f"└─ Compliance Risk (Pending): {insecure}")
    
    status = "OPTIMAL" if insecure == 0 else "ATTENTION REQUIRED"
    print(f"\n{GREEN if insecure == 0 else YELLOW}⚖️  INFRASTRUCTURE STATUS: {status}{RESET}")
    
    await log_agent_action(page, f"Audit Finished - {status}", f"{count} Nodes Scanned")
    print(f"{GREEN}✅ [MISSION COMPLETE] Security report committed to ledger.{RESET}")

async def reset_password_task(page, email, **kwargs):
    print(f"\n{MAGENTA}{BOLD}--- 🦾 MISSION START: SECURITY RESET [{email}] ---{RESET}")
    await wait_for_app(page)
    await log_agent_action(page, "Security Reset Initialized", email)
    await page.get_by_placeholder(re.compile("Search", re.IGNORECASE)).fill(email)
    await asyncio.sleep(1.5)
    row = page.locator("tr").filter(has_text=email)
    if await row.count() == 0: raise Exception(f"Identity '{email}' not found.")
    await row.get_by_role("button", name=re.compile("Reset", re.IGNORECASE)).click(force=True)
    await page.wait_for_selector("text=Reset Password", state="visible")
    pass_fields = page.locator("input[type='password']")
    await pass_fields.first.press_sequentially("Nexus_Security_2026!", delay=40)
    await pass_fields.last.press_sequentially("Nexus_Security_2026!", delay=40)
    await page.get_by_role("button", name=re.compile("Update Password", re.IGNORECASE)).click()
    await page.wait_for_selector("text=successfully", timeout=12000)
    await log_agent_action(page, "Password Update Finalized", email)
    print(f"{GREEN}✅ [MISSION COMPLETE] Credentials reset.{RESET}")

async def create_user_task(page, name, email, role="USER", dept="Security Operations", **kwargs):
    if not role or role == "None": role = "USER"
    if not dept or dept == "None": dept = "Security Operations"
    print(f"\n{MAGENTA}{BOLD}--- 🦾 MISSION START: IDENTITY PROVISIONING [{name}] ---{RESET}")
    await wait_for_app(page)
    await log_agent_action(page, f"Protocol: Provisioning Sequence Start", email)
    await page.get_by_placeholder(re.compile("Search", re.IGNORECASE)).fill(email)
    await asyncio.sleep(1.5)
    if await page.locator("tr").filter(has_text=email).count() > 0:
        print(f"{YELLOW}💡 [NOTICE] Identity exists.{RESET}")
    else:
        await page.goto(f"{BASE_URL}/create", wait_until="networkidle")
        await page.get_by_placeholder("e.g. Marcus Thorne").press_sequentially(name, delay=40)
        await page.get_by_placeholder("m.thorne@nexus.it").press_sequentially(email, delay=40)
        try:
            await page.get_by_role("button", name=str(role).upper(), exact=True).click()
        except:
            await page.get_by_role("button", name="USER", exact=True).click()
        if dept not in VALID_DEPTS: dept = "Security Operations"
        await page.locator("select").select_option(label=dept)
        await page.locator("button[type='submit']").click()
        await page.wait_for_selector("text=successfully", timeout=15000)
        print(f"{GREEN}✅ [SUCCESS] Node online.{RESET}")

    await asyncio.sleep(1)
    await page.goto(f"{BASE_URL}/audit", wait_until="networkidle")
    await asyncio.sleep(1.5)
    if await page.locator("tr").filter(has_text=email).count() > 0:
        await log_agent_action(page, "Final Verification Sequence", email)
        print(f"{GREEN}🔍 [VERIFIED] Operation confirmed.{RESET}")

# --- 🧠 Reasoning Logic ---

async def ask_brain(instruction: str):
    print(f"\n{CYAN}🧠 Engaging Neural Processor...{RESET}")
    instr = instruction.lower()
    
    # 🌩️ Advanced Mission Handlers
    if "audit" in instr or "scan" in instr or "report" in instr:
        return {"task": "security_audit"}
        
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', instr)
    email = email_match.group(0) if email_match else "unknown@nexus.it"
    
    if "reset" in instr: return {"task": "reset_password", "email": email}

    if API_KEY and "PASTE_YOUR" not in API_KEY:
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
            prompt = f"Convert to JSON: '{instruction}'. Valid Depts: {VALID_DEPTS}. Fields: task, name, email, role, dept."
            response = await asyncio.to_thread(model.generate_content, prompt)
            text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except: pass
    
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
    {BOLD}NEXUS IT AGENT | v5.5 ELITE PRO{RESET}
    {CYAN}Capabilities: Provision, Reset, Security Audit
    {RESET}""")
    
    while True:
        try:
            prompt = input(f"{YELLOW}🎙️ MISSION READY > {RESET}").strip()
            
            # Skip empty entries (prevents accidental enters or weird paste issues)
            if not prompt: 
                continue
                
            if prompt.lower() in ['exit', 'quit']: 
                break
                
            command = await ask_brain(prompt)
            if not command: 
                continue

            async with async_playwright() as p:
                print(f"{MAGENTA}🚀 Deployment initiated...{RESET}")
                # Use a single profile to avoid unnecessary cleanup issues
                browser = await p.chromium.launch(headless=False, slow_mo=700)
                context = await browser.new_context(viewport={'width': 1366, 'height': 768})
                page = await context.new_page()
                
                try:
                    task_type = command.get('task')
                    if task_type == 'security_audit': 
                        await security_audit_task(page)
                    elif task_type == 'reset_password': 
                        await reset_password_task(page, **command)
                    elif task_type == 'create_user': 
                        await create_user_task(page, **command)
                    else:
                        print(f"{YELLOW}⚠️  [WARNING] Unrecognized mission type: {task_type}{RESET}")
                except Exception as e: 
                    print(f"{RED}❌ [ABORTED] {e}{RESET}")
                finally:
                    await asyncio.sleep(2)
                    await browser.close()
                    
        except EOFError:
            break
        except KeyboardInterrupt:
            print(f"\n{CYAN}👋 Nexus IT Agent signing off.{RESET}")
            break
        except Exception as e:
            print(f"{RED}💥 [CRITICAL ERROR] {e}{RESET}")
            print(f"{CYAN}🔄 Attempting to stabilize system...{RESET}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
