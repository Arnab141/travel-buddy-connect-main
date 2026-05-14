url= https://travel-buddy-connect-main.vercel.app/


# 🌍 TravelBuddy — Shared Travel Coordination Platform

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green" />
  <img src="https://img.shields.io/badge/React-Frontend-blue" />
  <img src="https://img.shields.io/badge/Node.js-Backend-brightgreen" />
  <img src="https://img.shields.io/badge/MongoDB-Database-success" />
  <img src="https://img.shields.io/badge/Socket.io-RealTime-black" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
</p>

<p align="center">
  <b>A Full-Stack MERN Travel Coordination Platform</b><br/>
  Connect travelers, create trips, join travel groups, chat in real time, and travel together safely & affordably.
</p>

---

# 🔗 Live Demo

👉 https://travel-buddy-connect-main.vercel.app/

---

# 📖 About The Project

TravelBuddy is a modern web-based travel coordination platform designed to help travelers connect with people who share similar travel destinations, schedules, and interests.

Traditional travel applications mainly focus on ticket booking or hotel reservations, but they often fail to provide proper coordination between travelers. TravelBuddy solves this problem by allowing users to:

- Create travel plans
- Discover shared trips
- Send join requests
- Communicate in real time
- Coordinate group travel efficiently

The platform focuses on:

- 🌍 Social Travel
- 💰 Affordable Group Trips
- 🛡 Safer Coordination
- ⚡ Real-Time Communication

---

# ✨ Main Features

## 🔐 Authentication System

- User Signup & Login
- JWT-Based Authentication
- Password Hashing using bcrypt.js
- Protected Routes
- Secure Session Management

---

## 🌍 Trip Management

Users can:

- Create travel plans
- Add destination details
- Mention budget & travel dates
- Add traveler preferences
- Manage created trips

---

## 🔎 Trip Discovery

Travelers can:

- Browse all available trips
- Search travel destinations
- View trip details
- Explore travel groups

---

## 🤝 Join Request System

- Send join requests
- Host can accept/reject requests
- Real-time request updates
- Request management dashboard

---

## 💬 Real-Time Chat

Implemented using Socket.io

Features include:

- Instant messaging
- Real-time communication
- Group chat support
- Live event updates

---

## 🔔 Notification System

Users receive:

- Join request notifications
- Acceptance/rejection updates
- Chat notifications
- Travel updates

---

## 📱 Fully Responsive UI

Optimized for:

- Desktop
- Tablet
- Mobile Devices

Built using Tailwind CSS for clean and modern UI design.

---

# 🛠 Tech Stack

# Frontend Technologies

| Technology | Purpose |
|------------|----------|
| React.js | Frontend Library |
| Vite | Fast Build Tool |
| React Router DOM | Routing |
| Tailwind CSS | Styling |
| Axios | API Handling |
| Socket.io Client | Real-Time Communication |

---

# Backend Technologies

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | REST API Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt.js | Password Security |
| Socket.io | Real-Time Events |

---

# ☁ Deployment & Hosting

| Service | Usage |
|---------|-------|
| Vercel | Frontend Deployment |
| Render / Node Server | Backend Hosting |
| MongoDB Atlas | Cloud Database |

---

# 📂 Project Structure

```bash
TravelBuddy/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── requestController.js
│   │   ├── messageController.js
│   │   └── notificationController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── JoinRequest.js
│   │   ├── Message.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── messageRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── socket/
│   │   └── socket.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    │
    ├── public/
    │
    ├── src/
    │   │
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env
    ├── package.json
    └── vite.config.js
```

---

# 🚀 Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/travelbuddy.git
cd travelbuddy
```

---

# 2️⃣ Install Frontend Dependencies

```bash
npm install
```

---

# 3️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

# ⚙ Environment Variables

# Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

---

# ▶ Running The Project

# Run Backend

```bash
cd backend
npm run dev
```

---

# Run Frontend

```bash
npm run dev
```

---

# 🌐 API Endpoints

# Authentication Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/profile` | Get User Profile |

---

# Trip Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/trips` | Get All Trips |
| POST | `/api/trips` | Create New Trip |
| GET | `/api/trips/:id` | Get Single Trip |
| PUT | `/api/trips/:id` | Update Trip |
| DELETE | `/api/trips/:id` | Delete Trip |

---

# Join Request Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/requests` | Send Join Request |
| PUT | `/api/requests/:id` | Accept/Reject Request |
| GET | `/api/requests/user` | User Requests |

---

# Message Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/messages/:roomId` | Get Messages |
| POST | `/api/messages` | Send Message |

---

# Notification Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/notifications` | Get Notifications |

---

# 🔄 Application Workflow

```text
User Registration/Login
          ↓
Create Travel Plan
          ↓
Other Users Browse Trips
          ↓
Send Join Request
          ↓
Host Accepts/Rejects
          ↓
Real-Time Chat Starts
          ↓
Travel Coordination Completed
```

---

# 🏗 Architecture Overview

TravelBuddy follows a modern MERN architecture:

- React.js handles frontend UI
- Node.js & Express.js manage backend APIs
- MongoDB stores application data
- Socket.io enables real-time communication
- JWT secures authentication

---

# 🔐 Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Secure Token Verification
- Input Validation
- Role-Based Authorization

---

# ⚡ Real-Time Features

Powered by Socket.io

Includes:

- Instant messaging
- Live notifications
- Online communication
- Dynamic updates without refresh

---

# 📸 Screenshots

## Home Page

<img width="100%" alt="TravelBuddy Home" src="https://via.placeholder.com/1200x600.png?text=TravelBuddy+Home+Page"/>

---

## Trip Dashboard

<img width="100%" alt="Trip Dashboard" src="https://via.placeholder.com/1200x600.png?text=Trip+Dashboard"/>

---

## Chat System

<img width="100%" alt="Chat System" src="https://via.placeholder.com/1200x600.png?text=Real+Time+Chat"/>

---

# 👨‍💻 Team Members

| Name | Role |
|------|------|
| Arnab Pramanik | Backend Developer |
| Ashish Mehra | Full-Stack Developer |
| Ayush Jagota | Frontend Developer |
| Arup Maiti | MERN Stack Developer |

---

# 🎓 Academic Information

| Field | Details |
|------|----------|
| University | Chitkara University |
| Department | Computer Science Engineering |
| Project Type | Copyright Project |
| Status | Final Submission (Viva Ready) |
| Supervisor | Dr. Monika Aggarwal |

---

# 🚀 Future Enhancements

- 📍 Live GPS Tracking
- 💳 Shared Expense Payment Gateway
- 🤖 AI-Based Trip Recommendations
- 📷 Photo & Video Sharing
- ⭐ Ratings & Reviews
- 📱 Mobile Application
- 🌐 Multi-Language Support
- 🧠 AI Travel Assistant

---

# 📝 Learning Outcomes

This project helped in understanding:

- MERN Stack Development
- REST API Design
- Authentication Systems
- Real-Time WebSocket Communication
- Database Design
- Responsive UI Development
- Deployment & Hosting

---

# 🤝 Contribution

Contributions are welcome.

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push code
5. Open Pull Request

---

# 📄 License

MIT License © 2026 TravelBuddy Team

---

# © Copyright Notice

```text
Copyright © 2026 TravelBuddy Team
All Rights Reserved.

This project, source code, architecture, documentation,
and implementation are protected under copyright law.

Unauthorized copying, distribution, modification,
or commercial usage without permission is prohibited.
```

---

# ❤️ Final Note

TravelBuddy is designed to create a smarter, safer, and more social travel experience by connecting travelers through real-time collaboration and shared trip coordination.

This project demonstrates practical implementation of modern web technologies using the MERN stack along with scalable real-time systems.

---

# ⭐ Support

If you like this project:

⭐ Star the repository  
🍴 Fork the project  
🛠 Contribute to improve it

---
