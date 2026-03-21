# Ghumm — Branch Documentation

> **Branch:** `Gallery-Sec-Ready`  
> **Base branch:** `main`  
> **Status:** In Progress

## 1) Branch Purpose

This branch focuses on improving and securing the gallery-related experience in the Ghumm travel app.

### What this branch is intended to solve
- Improve gallery UX and visual consistency
- Ensure safer handling of gallery/tour media flows
- Clean up related frontend behavior for a more stable experience

### Scope (in this branch)
- Frontend updates in gallery/tour presentation flow
- Route/component-level improvements tied to gallery experience
- Security/readiness checks around exposed UI behavior

### Out of scope
- Major backend architecture changes
- New unrelated features outside gallery/tour flow

---

## 2) Project Context

Ghumm is a React-based travel/tour booking style frontend with reusable components for:
- Home page tour discovery
- Featured tours
- Testimonials
- Search and filtering UI
- Tour details view
- Auth pages (Login/Register)

Current repository includes:
- `frontend/` (active React app)
- `backend/models/` (data model files present)

---

## 3) Tech Stack

- **Frontend:** React 18, React Router 6, Reactstrap, Bootstrap 5
- **UI utilities:** Remix Icons, React Slick, React Responsive Masonry
- **Build tooling:** Create React App (`react-scripts`)

---

## 4) Folder Overview (Frontend)

Key folders you should know:
- `src/components/` → feature UI blocks (Header, Footer, Featured tours, Gallery, Testimonials)
- `src/pages/` → page-level screens (Home, Tours, TourDetails, Login, Register)
- `src/router/` → route mapping
- `src/shared/` → reusable UI parts (SearchBar, Newsletter, TourCard, Subtitle)
- `src/assets/data/` → static tour data (`tours.js`, `tours.json`)
- `src/styles/` → page-level styles

---

## 5) Local Setup

## Prerequisites
- Node.js LTS
- npm

## Install and run (Frontend)
```bash
cd frontend
npm install
npm start
