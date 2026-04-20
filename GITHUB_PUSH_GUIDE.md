# Complete GitHub Deployment Guide - Ghumm Project

## 📋 Prerequisites

Before starting, ensure you have:
- [x] GitHub CLI installed (`gh` command available)
- [x] Git installed and configured
- [x] GitHub account and authenticated with CLI (`gh auth login`)
- [x] Repository created at: https://github.com/KeenIsHere/Ghumm

---

## 🚀 STEP 1: Setup GitHub CLI (if not already done)

```powershell
# Check if GitHub CLI is installed
gh --version

# If not installed, install via Chocolatey or Winget:
# choco install gh
# or
# winget install GitHub.cli

# Authenticate with GitHub
gh auth login

# When prompted:
# - Select "GitHub.com"
# - Choose "HTTPS"
# - Select "Y" for git credential manager
# - Create new token in browser when asked
```

---

## 🔧 STEP 2: Clone and Clear Existing Ghumm Repository

```powershell
# Navigate to a working directory (NOT inside travelapp)
cd C:\Users\ASUS\Desktop

# Clone the Ghumm repo (this will have old files)
git clone https://github.com/KeenIsHere/Ghumm.git
cd Ghumm

# Check what's in there
ls -la
```

### Remove all existing files:

```powershell
# Remove all files except .git and .gitignore
Get-ChildItem -Force | Where-Object { $_.Name -ne '.git' -and $_.Name -ne '.gitignore' } | Remove-Item -Recurse -Force

# Verify only .git and .gitignore remain
ls -la
```

---

## 📁 STEP 3: Copy travelapp Code to Ghumm Repository

```powershell
# From the Ghumm directory, copy all travelapp content
$sourcePath = "C:\Users\ASUS\Desktop\travelapp\*"
$destPath = "C:\Users\ASUS\Desktop\Ghumm\"

# Copy everything from travelapp EXCEPT node_modules and mongodb
Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force -Exclude @("node_modules", "mongodb", "mongodb-data", ".git")

# Navigate back to Ghumm
cd C:\Users\ASUS\Desktop\Ghumm

# Verify the copy
ls -la
```

---

## 📝 STEP 4: Create Proper .gitignore

Create/update `.gitignore` file in Ghumm root:

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Database
mongodb/
mongodb-data/
mongod_*.txt
*.log

# Build/Dist
dist/
build/
.vite/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Misc
.cache/
*.tmp
do-not-publish/
```

---

## 🎯 STEP 5: Initialize Git and Make Initial Commit

```powershell
cd C:\Users\ASUS\Desktop\Ghumm

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Add Ghumm travel platform with core features"

# Check git status
git status
```

---

## 🌿 STEP 6: Create Feature Branches

```powershell
# Make sure you're on main
git checkout main

# Create all feature branches
git checkout -b feature/auth-system
git push origin feature/auth-system

git checkout main
git checkout -b feature/package-management
git push origin feature/package-management

git checkout main
git checkout -b feature/booking-system
git push origin feature/booking-system

git checkout main
git checkout -b feature/payment-integration
git push origin feature/payment-integration

git checkout main
git checkout -b feature/premium-system
git push origin feature/premium-system

git checkout main
git checkout -b feature/admin-dashboard
git push origin feature/admin-dashboard

git checkout main
git checkout -b feature/notifications
git push origin feature/notifications

git checkout main
git checkout -b feature/reviews-ratings
git push origin feature/reviews-ratings

git checkout main
git checkout -b feature/wishlist
git push origin feature/wishlist

git checkout main
git checkout -b feature/testing
git push origin feature/testing

# Return to main
git checkout main
```

---

## 📤 STEP 7: Push Main Branch to GitHub

```powershell
cd C:\Users\ASUS\Desktop\Ghumm

# Push the main branch
git push origin main

# Verify all branches are pushed
git branch -a
```

---

## 🤖 STEP 8: Run GitHub Project Automation Script

```powershell
cd C:\Users\ASUS\Desktop\travelapp

# Run the PowerShell automation script
.\setup-github-project.ps1 -Owner "KeenIsHere" -Repo "Ghumm"

# This will create:
# ✅ 16 Labels
# ✅ 8 Milestones
# ✅ 60+ Issues with proper descriptions
```

---

## 📊 STEP 9: Setup GitHub Project Board

Go to: https://github.com/KeenIsHere/Ghumm/projects

### Create New Project:

1. Click **"New project"** button
2. Enter title: **"GhummGhamm-Development"**
3. Choose **"Table"** template (we'll add more views)
4. Click **"Create project"**

### Add Views:

1. Click **"Add view"** → **Board** (Kanban view)
   - Add columns: `Backlog` → `Todo` → `In Progress` → `In Review` → `Done`

2. Click **"Add view"** → **Table** (Already created)
   - Add fields: Status, Priority, Assignee, Type, Milestone, Due Date

3. Click **"Add view"** → **Roadmap** (Timeline view)
   - Add status field for timeline

### Link Issues to Project:

1. Go to **Issues** tab
2. Filter by "Open" issues
3. Select all issues (use checkbox at top)
4. Click **"Projects"** dropdown → Select **"GhummGhamm-Development"**

Or individually:

1. Click on any issue
2. In right sidebar under **"Projects"** → Select **"GhummGhamm-Development"**
3. Set **Status** column value

---

## ✅ STEP 10: Verification Checklist

```powershell
# Verify everything is set up
Write-Host "Checking GitHub Setup..." -ForegroundColor Green

# Check branches
gh repo view KeenIsHere/Ghumm --json branches --jq '.branches[].name'

# Check issues count
gh issue list --repo KeenIsHere/Ghumm --limit 100

# Check labels
gh label list --repo KeenIsHere/Ghumm

# Check milestones
gh milestone list --repo KeenIsHere/Ghumm
```

---

## 🎓 Project Structure on GitHub

After setup, your GitHub will have:

```
Repository: KeenIsHere/Ghumm
├── main
│   └── All production-ready code
├── develop
│   └── Integration branch
└── Feature Branches
    ├── feature/auth-system
    ├── feature/package-management
    ├── feature/booking-system
    ├── feature/payment-integration
    ├── feature/premium-system
    ├── feature/admin-dashboard
    ├── feature/notifications
    ├── feature/reviews-ratings
    ├── feature/wishlist
    └── feature/testing

Issues: 60+ organized by phases
├── v0.1 - Core Foundation (11 issues)
├── v0.2 - Auth & User Mgmt (10 issues)
├── v0.3 - Packages & Booking (10 issues)
├── v0.4 - Payment (7 issues)
├── v1.0 - Premium System (9 issues)
├── v1.1 - Admin Dashboard (9 issues)
├── v1.2 - Notifications & Polish (11 issues)
└── v1.3 - Testing & Deployment (7 issues)

Project Views:
├── 📋 Board (Kanban)
├── 📊 Table (Tracking)
└── 🗓️ Roadmap (Timeline)
```

---

## 🔄 Workflow After Setup

### For Each Feature:

1. **Create Issue** - Describe what needs to be done
2. **Create Branch** - `git checkout -b feature-name`
3. **Work on Code** - Make commits
4. **Create PR** - Link to issue and milestone
5. **Review & Merge** - Move issue to Done

### Example PR Description:

```
## Feature: Setup Express Server

Closes #1

### Changes
- [x] Express.js configured with middleware
- [x] CORS, body parser, cookie parser setup
- [x] Environment variables loaded
- [x] Health check endpoint working

### Type
- [x] Feature
- [ ] Bug Fix
- [ ] Docs

### Testing
- [x] Manual testing completed
- [ ] Unit tests added

### Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
```

---

## 🚨 Troubleshooting

### Issue: GitHub CLI not found
```powershell
# Install GitHub CLI
winget install GitHub.cli
# or
choco install gh

# Verify installation
gh --version
```

### Issue: Not authenticated
```powershell
# Re-authenticate
gh auth logout
gh auth login
```

### Issue: Repository not found
```powershell
# Check if repository exists
gh repo view KeenIsHere/Ghumm

# If not, create it via GitHub web UI first
```

### Issue: Cannot push branches
```powershell
# Ensure SSH/HTTPS is configured correctly
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Try pushing again
git push origin feature-name
```

---

## 📞 Quick Commands Reference

```powershell
# GitHub CLI Commands
gh auth login                          # Authenticate
gh repo view KeenIsHere/Ghumm          # View repo details
gh issue list -R KeenIsHere/Ghumm      # List all issues
gh label list -R KeenIsHere/Ghumm      # List all labels
gh milestone list -R KeenIsHere/Ghumm  # List milestones

# Git Commands
git status                              # Check status
git add .                               # Stage changes
git commit -m "message"                 # Commit changes
git push origin branch-name             # Push branch
git pull origin main                    # Pull latest
git checkout -b new-branch              # Create new branch
git branch -a                           # List all branches
git log --oneline                       # View commit history
```

---

## 🎯 Success Criteria

When complete, you should have:

✅ Ghumm repo with all travelapp code  
✅ 10 feature branches created  
✅ 60+ issues across 8 milestones  
✅ 16 labels for categorization  
✅ Project board with 3 views (Board, Table, Roadmap)  
✅ Initial commit with clean history  
✅ .gitignore properly configured  

---

## 🎉 You're Done!

Your GitHub project is now fully set up for collaborative development with:
- Clear issue tracking
- Organized milestones
- Visual project management
- Feature branch workflow
- Professional project structure

Happy coding! 🚀
