<div align="center">

# 🛡️ GearOfi
### Intelligent Maintenance Management System (CMMS)

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Framework-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <p><strong>GearGuard</strong> is a next-generation maintenance tracking solution designed to streamline asset management, schedule preventive maintenance, and optimize team workflows.</p>
</p>

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 🚀 Features

### 🏭 Asset Management
*   **Comprehensive Inventory**: Track detailed equipment profiles including serial numbers, models, and locations.
*   **Lifecycle Tracking**: Monitor purchase dates, warranty expiry, and operational status (Active/Scrapped).
*   **Document Vault**: (Coming Soon) Store manuals, invoices, and compliance docs per asset.

### 🔧 Intelligent Maintenance
*   **Smart Scheduling**: Create **Preventive** (recurring) and **Corrective** (one-off) maintenance requests.
*   **Priority Matrix**: categorize requests by urgency (Low to Critical) with visual indicators.
*   **Status Workflow**: Kanban-style tracking from `New` → `In Progress` → `Repaired` or `Scrap`.

### 📊 Analytics & Reporting
*   **Interactive Dashboard**: Real-time overview of pending tasks, active equipment, and team load.
*   **PDF Exports**: One-click generation of Equipment, Cost, and Performance reports.
*   **Visual Charts**: Monthly cost trends and maintenance request volumes.

### 👥 Team Collaboration
*   **Role-Based Access**: Managers plan work; Technicians execute tasks.
*   **Team Assignment**: Organize technicians into specialized teams (e.g., Electrical, HVAC).

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18 (Vite) | High-performance SPA with TypeScript. |
| **UI Library** | Shadcn/UI + Tailwind | Modern, accessible, and responsive design system. |
| **Backend** | FastAPI (Python) | High-performance, async API with auto-generated docs. |
| **Database** | PostgreSQL / SQLite | Robust relational data storage (SQLAlchemy ORM). |
| **State** | React Context API | Lightweight global state management. |

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   PostgreSQL (Optional, defaults to SQLite)

### 1️⃣ Backend Setup (FastAPI)

```bash
# Navigate to backend
cd fast_backend

# Install dependencies
pip install -r requirements.txt
# OR manual install
pip install fastapi uvicorn sqlalchemy pydantic python-multipart passlib[bcrypt] jose python-jose[cryptography]

# (Optional) Seed the database with demo data
python seed.py

# Start the Server
python main.py
```
> **Backend runs at:** `http://127.0.0.1:8000`  
> **API Docs:** `http://127.0.0.1:8000/docs`

### 2️⃣ Frontend Setup (React)

```bash
# Navigate to frontend in a NEW terminal
cd Frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```
> **App runs at:** `http://localhost:5173`

---

## � Default Credentials

If you ran the `seed.py` script, use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| **Manager** | `manager@gearguard.com` | *check services.py* |
| **Technician** | `tech1@gearguard.com` | *check services.py* |

*(Note: Auth is currently simplified. Check `services.py` for specific implementation details if strict auth is enabled.)*

---

## 📂 Project Structure

```
GearGuard/
├── fast_backend/          # Python FastAPI Backend
│   ├── models.py          # SQLAlchemy Database Models
│   ├── schemas.py         # Pydantic Response/Request Schemas
│   ├── services.py        # Business Logic & CRUD
│   ├── main.py            # App Entry Point & Routing
│   └── seed.py            # Demo Data Generator
│
└── Frontend/              # React Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/ # Reusable UI Components
    │   │   ├── pages/      # Application Screens (Dashboard, Reports)
    │   │   └── contexts/   # Global State (Auth, Equipment)
    │   └── services/       # API Client (Axios/Fetch wrapper)
```

---

## 🏆 Hackathon Team

| Name | Role | GitHub |
|------|------|--------|
**Jaimin Trivedi** | front-end, database  | [@Jaimintrv21](https://github.com/Jaimintrv21) |
| **HItesh Kumar** | back-end | [@hitesh-kumar123](https://github.com/hitesh-kumar123) |
| **Shriyansh** | debugger and problem solving | [@shriyansh121](https://github.com/Mformann) |
| **Mann** |  documentation and  tester | [@Mformann](https://github.com/shriyansh121) |

---

<div align="center"

Built with ❤️ by the GearOfi Team

</div>
