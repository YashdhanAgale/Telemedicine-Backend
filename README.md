# Telemedicine Backend – Admin & Session API

This backend is built for the telemedicine admin panel project as described in the assessment. It handles doctor login, availability, pharmacy device registration, real-time session management, and admin-side monitoring APIs.

---

## 🔧 Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Cookie-based JWT authentication
- WebSocket (Socket.IO) for real-time updates

---

## 📦 Features Implemented

- Doctor register/login/logout
- Doctor availability toggle (with real-time socket event)
- Pharmacy device registration with GPS and unique device ID
- Start and end session between doctor and device
- Admin dashboard APIs:
  - Online doctors
  - Active sessions
  - Device map
- Role-restricted routes (only `admin@example.com` can access admin panel APIs)

---

## 🔐 Authentication

- JWT tokens are issued on login and stored in cookies.
- All secure routes are protected using a custom `authMiddleware`.
- Admin-only routes are guarded by `adminOnlyMiddleware` and restricted to a single hardcoded admin email (`admin@example.com`).

---

## ⚙️ Project Structure

/config → DB connection
/controllers → Route logic
/models → Mongoose schemas
/routes → Route handlers
/middlewares → Auth & role checks


yaml
Copy
Edit

---

## 🚀 Getting Started

1. Clone the repo:
```bash
git clone <your-repo-url>
cd telemedicine-backend
Install dependencies:

Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/telemedicine
JWT_SECRET=your_jwt_secret
Start the server:


🧪 Test Routes (Postman)
Postman collection: [Add your exported collection here if needed]

Some useful routes:

POST /api/doctor/login

PUT /api/doctor/availability

POST /api/pharmacy/register

POST /api/session/start

PUT /api/session/end/:sessionId

GET /api/session/my-sessions

GET /api/admin/online-doctors (admin only)

📡 Real-Time Events (WebSocket)
Socket.IO server is initialized with Express.

When a doctor toggles availability, a doctorStatusChanged event is emitted to all connected clients.

✅ Status
Backend fully functional and ready for frontend integration.

Clean, modular code with secure routing and error handling.