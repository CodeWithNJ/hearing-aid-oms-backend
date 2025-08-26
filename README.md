# Hearing Aid OMS Backend

Backend service for the **Hearing Aid Order Management System** built with **Node.js, Express, and MongoDB (Mongoose)**.  
This API handles authentication, customer management, and order operations for the system.

---

## 🚀 Features

- RESTful API built with **Express**
- Database integration with **MongoDB (Mongoose)**
- Authentication using **JWT (Access & Refresh tokens)**
- Secure password storage with **bcrypt**
- Middleware support: **CORS**, **Cookie-parser**
- Pagination with **mongoose-aggregate-paginate-v2**
- Environment-based configuration using **dotenv**
- Prettier for consistent code formatting

---

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (Access + Refresh tokens)
- **Other Libraries:**
  - bcryptjs
  - cors
  - cookie-parser
  - mongoose-aggregate-paginate-v2
  - dotenv
- **Dev Tools:**
  - nodemon
  - prettier

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/CodeWithNJ/hearing-aid-oms-backend.git
cd hearing-aid-oms-backend
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Environment Variables
```
PORT=8100
MONGODB_URI=mongodb://localhost:27017
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your-secret-access-token
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-secret-refresh-token
REFRESH_TOKEN_EXPIRY=10d
```
### 4️⃣ Run the Project
```
npm run dev
```

### 📂 Project Structure
```
hearing-aid-oms-backend/
│── src/
│   ├── index.js        # Entry point
│   ├── config/         # DB & environment configs
│   ├── routes/         # API route definitions
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── middlewares/    # Custom middlewares
│   └── utils/          # Helper functions
│
│── .env                # Environment variables (ignored)
│── .env.sample         # Sample env file
│── .gitignore          # Git ignore rules
│── package.json        # Dependencies & scripts
│── package-lock.json   # Dependency lock file
│── README.md           # Documentation
```
