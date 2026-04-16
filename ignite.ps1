# 🛡️ Nexus IT: Ignition Sequence
# Professional Launcher v5.5 (Final Patch)

Clear-Host
Write-Host '🚀 Initializing Nexus IT Ecosystem...' -ForegroundColor Cyan
Write-Host '----------------------------------------'

# 1. Launch the Backend API
Write-Host '📡 Starting Nexus Central API...' -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd nexus-engine; .\venv\Scripts\python main.py'

# 2. Launch the Frontend Dashboard
Write-Host '🖥️ Starting Nexus Admin Interface...' -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd nexus-dashboard; npm run dev'

# 3. Launch the AI Agent Console
Write-Host '🧠 Deploying Autonomous AI Agent...' -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd nexus-engine; .\venv\Scripts\python agent.py'

Write-Host ' '
Write-Host '✅ ALL SYSTEMS ARE GO.' -ForegroundColor White -BackgroundColor DarkGreen
Write-Host 'Dashboard will open automatically in 5 seconds.' -ForegroundColor Gray

Start-Sleep -Seconds 5
Start-Process 'http://localhost:5173'
