# GearGuard - Odoo Maintenance System

## Project Structure
- `Frontend/`: XML Views and Static files.
- `backend/`: Custom Odoo module containing Business Logic, Models, and Security.

## How to Run

### Prerequisites
- Odoo 16 or 17 (Community Edition).
- PostgreSQL running.

### Launch Command (Backend)
**Crucial Step**: You must run this command from your **Odoo Source/Installation Directory** (the folder containing `odoo-bin`), NOT from inside `D:\GearO5`.

1. **Open PowerShell**.
2. **Navigate to Odoo**:
   ```powershell
   # Example: cd C:\Odoo\server
   cd path\to\your\odoo\directory
   ```
3. **Run Server**:
   Point to your project folder using the full path:
   ```powershell
   python odoo-bin --addons-path="addons,d:\GearO5" -d gearguard_db -u backend
   ```

---

## How to Run - Frontend
The frontend is a React + Vite application.

### Prerequisites
- Node.js installed.

### Launch Command
1. **Navigate**: Open a new terminal and go to the Frontend directory:
    ```powershell
    cd d:\GearO5\Frontend
    ```
2. **Install Dependencies** (First time only):
    ```powershell
    npm install
    # or
    pnpm install
    ```
3. **Start Development Server**:
    ```powershell
    npm run dev
    ```
    The app will typically run at `http://localhost:5173`.

### Explanation
- `--addons-path="addons,d:\GearO5"`: Tells Odoo to look for modules in the default folder AND your project folder.
- `-d gearguard_db`: Uses (or creates) a database named `gearguard_db`.
- `-u backend`: Installs or updates your module named `backend`.