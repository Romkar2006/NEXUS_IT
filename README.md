# 🛡️ Nexus IT: Self-Auditing AI Admin Command Center
### *Autonomous Identity Provisioning & Security Infrastructure v5.0 Elite*

Nexus IT is a production-grade, autonomous administration platform that merges **high-fidelity UI design** with **agentic AI automation**. It is designed to handle complex IT operations—such as user provisioning, clearance level management, and security resets—with zero-touch automation and real-time ledger verification.

---

## 🚀 Key Innovative Pillars

### 1. 🧠 Hybrid Intelligence Brain (v5.0 Elite)
The AI Agent doesn't just "run scripts." It utilizes a **Multi-Layered Reasoning System**:
- **Layer 2: Tactical Fallback (Regex Engine)**: A high-performance local fallback system that ensures the agent remains 100% operational even during API rate limits or offline scenarios.
- **Layer 3: Self-Correction**: The agent identifies if a user already exists before attempting provisioning, preventing redundant backend writes.

![Agent Intelligence Console](file:///C:/Users/Victus/.gemini/antigravity/brain/9bec5408-ef3e-4292-83a4-ed077ba8c9bf/final_vibrant_admin_ui_preview_1776284238316.webp)

### 2. 🛰️ Centralized Real-Time Infrastructure
Unlike basic prototypes, Nexus IT features a **Unified Backend State**:
- **FastAPI Core**: A persistent REST API that serves as the single source of truth for both the UI and the AI Agent.
- **Real-Time Polling**: The React frontend utilizes precision polling to ensure that any change made by the AI Agent in the "background" is instantly reflected in the "foreground" UI.
- **System Pulse**: A dedicated infrastructure monitor that pings the backend every 5 seconds to ensure system health.

![Nexus Dashboard Overview](file:///C:/Users/Victus/.gemini/antigravity/brain/9bec5408-ef3e-4292-83a4-ed077ba8c9bf/full_dashboard_replication_check_1776289135622.webp)

### 3. 📜 Autonomous Self-Auditing
The agent follows a **Closed-Loop Automation** protocol:
1. **Action**: The Agent provisions a user or resets a security node.
2. **Verification**: After completion, the Agent autonomously navigates to the **Audit Log**.
3. **Ledger Matching**: It verifies that the "Audit Entry" exists in the database before declaring a mission "100% SUCCESS."

![Audit Ledger Logic](file:///C:/Users/Victus/.gemini/antigravity/brain/9bec5408-ef3e-4292-83a4-ed077ba8c9bf/audit_log_redesign_verification_1776288761165.png)

---

## 🏗️ Technical Deep Dive & Architecture

### **The Backend Engine (Python/FastAPI)**
The "Heart" of the system. I have chosen **FastAPI** because of its high performance and native support for asynchronous operations. 
- **Single Source of Truth**: Instead of using browser-only `localStorage`, we built a Python-based state manager that handles all persistence in a structured `database.json`.
- **Dynamic Ingestion**: The backend supports cross-process calls—allowing the UI (on Vite) and the Agent (on Python) to write and read from the same ledger simultaneously.

### **The AI Agent (Playwright + Gemini)**
The "Brain" of the system. This is a custom-built **Agentic Automator**:
- **Intent Extraction**: When a user inputs a mission (like *"Add Bruce Wayne as an Admin"*), the agent uses **Google Gemini 1.5 Flash** to extract intent.
- **Hybrid Intelligence**: To ensure maximum uptime, we built a **Regex Fallback Engine**. If the AI API is rate-limited, the agent instantly swaps to local processing to keep the mission running.
- **Hyper-Stable Automation**: Built with **Playwright Async**, the agent uses "Heuristic Selectors" making it resistant to UI changes.

### **The Connectivity Layer (The "Bridge")**
- **Real-Time Synchronization**: We implemented a specialized **Polling Ingestion** in React. Every 2.5 seconds, the UI pings the FastAPI backend to fetch the latest state. 
- **System Heartbeat**: We implemented a global heartbeat monitor that shows a "System Pulse" widget in the UI for infrastructure health transparency.

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide Icons, Vanilla CSS Modals |
| **Backend API** | FastAPI, Uvicorn (Server), Python-Dotenv |
| **Persistence** | JSON State Management (Centralized) |
| **AI/Agent** | Google Generative AI, Playwright, Regex Heuristics |

---

## 🏃‍♂️ Quick Start

### 1. Initialize the Grid (Backend Services)
```powershell
cd nexus-engine
.\venv\Scripts\python main.py
```

### 2. Launch the Command Center (Frontend)
```powershell
cd nexus-dashboard
npm run dev
```

### 3. Deploy the Autonomous Agent
```powershell
cd nexus-engine
.\venv\Scripts\python agent.py
```

---

## ⚖️ License
Internal Use Only | **Decawork Internship Project 2026**
