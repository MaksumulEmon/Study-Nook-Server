# StudyNook Server

Backend server for the **StudyNook – Library Study Room Booking Platform**.
This server handles authentication, room management, booking logic, conflict checking, and MongoDB database operations.

---

# 🚀 Live Server

Add your deployed server URL here:

```bash
https://studynook-server-one.vercel.app/
```

---

# 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* JOSE JWT Verify
* dotenv
* cors

---

# ✨ Features

* Secure JWT authentication middleware
* HTTP-only token verification
* Add, update, and delete study rooms
* Advanced room search & filtering
* Booking conflict prevention system
* Booking count increment system
* Protected private API routes
* MongoDB query operators support
* Responsive REST API structure
* Owner-only room management system

---

# 📦 Installed Packages

```bash
npm install express mongodb dotenv cors jose-cjs
```

---


# ▶️ Run Locally

Clone the project:

```bash
https://github.com/MaksumulEmon/Study-Nook-Server.git
```

Go to the project directory:

```bash
cd studynook-server
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
nodemon index.js
```

---

# 📁 API Endpoints

## Rooms

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| GET    | `/room`     | Get all rooms   |
| GET    | `/room/:id` | Get single room |
| POST   | `/room`     | Add new room    |
| PATCH  | `/room/:id` | Update room     |
| DELETE | `/room/:id` | Delete room     |

---

## Booking

| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | `/booking`            | Create booking    |
| GET    | `/booking/:userId`    | Get user bookings |
| DELETE | `/booking/:bookingId` | Cancel booking    |

---

# 🔍 Search & Filter Support

Supports MongoDB operators:

* `$regex` → Room name search
* `$in` → Amenities filtering

Example:

```bash
/api/room?search=quiet&amenities=Wi-Fi,Projector
```

---

# 🔐 Authentication

Protected routes use JWT verification middleware.

Features:

* Token verification
* Unauthorized access protection
* Owner authorization checking
* Private route security

---

# 📚 Advanced Booking Logic

StudyNook prevents duplicate bookings using:

* Date matching
* Time slot conflict detection
* MongoDB query validation

This ensures:

* No overlapping bookings
* Accurate booking count
* Safe reservation handling

---

# 👨‍💻 Developer

Developed by **Md Maksumul Haque Emon**

Frontend Repository:

```bash
https://github.com/MaksumulEmon/Study-Nook
```

Backend Repository:

```bash
https://github.com/MaksumulEmon/Study-Nook-Server
```

---

