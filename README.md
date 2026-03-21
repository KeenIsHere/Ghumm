# Ghumm — Travel Experience Platform

Ghumm is a web-based travel discovery and booking-style platform.  
It is designed to help users explore tours, view details, search options, and interact with a modern travel-focused interface.

---

## Project Snapshot (For Everyone)

## What this project is
Ghumm is a tourism web application with:
- A public travel/tour browsing experience
- Featured tours and testimonials
- Search and filtering-style flow
- Tour detail pages
- Basic authentication pages (login/register UI)

## Current situation (important)
- The **frontend is active and runnable**.
- A **backend folder exists**, but currently appears to contain mainly data model files.
- The system today is best described as **frontend-first**, with backend/API integration still evolving.

## Who this is for
- **End users / stakeholders:** to understand product purpose and progress
- **Developers:** to understand architecture, setup, and technical status

---

## Non-Technical Overview (For Stakeholders)

## Product goal
Build a reliable and user-friendly travel platform where people can:
1. Discover tour packages
2. Explore destinations and highlights
3. Compare and search options
4. View trust signals (ratings/testimonials)
5. Move toward booking decisions

## Business value
- Improves digital visibility for tourism offerings
- Gives users a fast and visual exploration experience
- Creates a foundation for future booking/payment integration

## Current maturity
- **UI/UX foundation:** Strong
- **Core user journey:** Present at interface level
- **Production readiness:** Partial (frontend-ready, backend/services need expansion)
- **Security hardening:** In progress as branch-level work continues

---

## Technical Overview (For Developers)

## High-level architecture
- **Frontend:** React-based SPA
- **Routing:** React Router
- **UI stack:** Bootstrap + Reactstrap + supporting UI libraries
- **Backend status:** Model definitions exist; full service/API layer is limited in current repository state

## Key functional areas in frontend
- Home / landing experience
- Tours listing and search result pages
- Tour details page
- Featured tours and testimonials sections
- Shared UI components (cards, newsletter, search bar, layout)

## Data status
- Static/mock-style data exists in frontend assets
- Dynamic API-driven behavior appears limited at this stage
- Transition path: move from static data to backend service integration

---

## Current Status Dashboard

| Area | Status | Notes |
|------|--------|-------|
| Frontend UI | ✅ Active | Core pages and components available |
| Routing | ✅ Active | Multi-page SPA navigation in place |
| Backend API | ⚠️ Partial | Models exist, full API/services not fully represented |
| Auth flow | ⚠️ UI-level | Login/Register pages exist; full auth backend flow may be incomplete |
| Testing coverage | ⚠️ Basic | Default CRA testing setup present |
| Deployment readiness | ⚠️ Partial | Build works for frontend; full-stack deployment path still needs completion |

---

## What Works Today

- Responsive React frontend
- Tour exploration interfaces
- Reusable component structure
- Build/test scripts for frontend

---

## Known Gaps / Risks

- Backend service completeness is unclear/partial
- End-to-end integration (UI ↔ API ↔ DB) may not be fully implemented
- Production-level auth, validation, and security controls require full verification
- No unified root-level full-stack run workflow is documented yet

---

## Local Development Setup

## Prerequisites
- Node.js (LTS recommended)
- npm

## Run frontend
```bash
cd frontend
npm install
npm start
