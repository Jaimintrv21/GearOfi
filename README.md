# GearO5 - Maintenance Management System

This project contains a **React Frontend** and a standalone **FastAPI Backend**.
(The Odoo backend is deprecated).

## 🚀 How to Run

You need two terminal windows open: one for the Backend, one for the Frontend.

### 1. Run Backend (FastAPI)
This handles the logic, database (in-memory), and API.

1.  Open **Terminal 1**.
2.  Go to the backend folder:
    ```powershell
    cd d:\GearO5\fast_backend
    ```
3.  Install requirements (if not done):
    ```powershell
    pip install fastapi uvicorn
    ```
4.  Run the server:
    ```powershell
    # Simple run
    python main.py
    
    # Or with auto-reload (for development)
    python -m uvicorn main:app --reload
    ```
    *Server runs at: http://localhost:8000*
    *Swagger Docs: http://localhost:8000/docs*

---

### 2. Run Frontend (React)
This is the User Interface.

1.  Open **Terminal 2**.
2.  Go to the frontend folder:
    ```powershell
    cd d:\GearO5\Frontend
    ```
3.  Install dependencies (first time only):
    ```powershell
    npm install
    ```
4.  Run the dev server:
    ```powershell
    npm run dev
    ```
    *App runs at: http://localhost:5173*

## 🔄 Integration
The Frontend automatically connects to `http://localhost:8000`.
- **Note**: Since the backend uses an **in-memory database**, all data (teams, equipment, requests) will be reset if you restart the Python backend.

## 📂 Project Structure
- `fast_backend/`: Python API, Models, Logic.
- `Frontend/`: React Application.
- `backend/`: (Legacy) Odoo module - ignore this.