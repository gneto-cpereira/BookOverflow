# BookOverflow 📚
(*ON GOING PROJECT*)

A minimalist and intelligent personal library manager, focused on mobility and effortless data entry.
## 🌟 Core Features
This map provides an instant overview of everything the application can currently do:
- **Inventory Management (CRUD)**: View, add, edit, and remove books through a dynamic tabular interface.
- **ISBN Barcode Scanner**: Integrated scanner that utilizes the mobile device's camera to capture ISBNs in real-time.
- **Smart Auto-fill**: Intelligent metadata fetching from multiple sources (Google Books + Open Library) to automatically populate title and author fields via ISBN.
- **Mobile Experience (PWA)**: Fully installable on the home screen, featuring custom icons and standalone display mode.
- **Secure Infrastructure**: Remote access via HTTPS through Cloudflare Tunnels, allowing the use of the mobile camera while the server runs locally.
## 🏗️ Project Architecture
The project is designed with a clear separation of concerns to facilitate maintenance:

| **Component** | **Technology**    | **Responsibility**                                      |
| ------------- | ----------------- | ------------------------------------------------------- |
| **Frontend**  | Vite + Vanilla JS | Reactive UI, PWA configuration, and scanner logic.      |
| **Backend**   | Node.js + Express | REST API and bridge to external book databases.         |
| **Database**  | PostgreSQL        | Persistent storage for the personal library collection. |

## 🛠️ Technical Stack & Organization
The application is fully **containerized** to ensure it runs consistently across any machine:
- **Runtime**: Docker & Docker Compose.
- **UI/UX**: SweetAlert2 (Modals) and Grid.js (Tables).
- **Scanner**: Html5-QRCode.
Key File Structure:
- `/frontend/public`: PWA static assets (`manifest.json`, icons).
- `/frontend/src/components`: Visual logic for Modals and Tables.
- `/backend`: API routes and database connection logic.

## 🚦 Development Status (DoD Compliance)
Each item below represents a completed and documented increment, fulfilling the project's **Definition of Done**:
1. [x] **System Integrated**
2. [x] **Tested and Functional**
3. [x] **Clean and Documented Code**
4. [x] **Documented on readme**

## 📦 Getting Started
1. Ensure you have **Docker** installed.
2. In the project root, run:
```
docker compose up -d --build
```
3. Access the app at `http://localhost:5173` on your PC.
4. To use the PWA and camera features on mobile, a secure tunnel (HTTPS) is required.

(*ON GOING PROJECT*)