# CRM – Full Stack Application

This repository contains a **full‑stack CRM application** with a **React (Vite) frontend** and a **Node.js + Express + PostgreSQL backend**.

---

## 📁 Project Structure

```
CRM/
│
├── backend/        # Node.js + Express API
│   ├── index.js
│   ├── migrate.js
│   ├── package.json
│   └── ...
│
├── frontend/       # React + Vite application
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── .gitignore
```

---

## 🚀 Prerequisites

Make sure you have the following installed:

* **Node.js** (v18+ recommended)
* **npm** (comes with Node)
* **PostgreSQL** (v13+ recommended)

---

## 🗄️ Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE crmdb;
```

2. Make sure PostgreSQL is running on your system.

---

## ⚙️ Backend Setup

### 1️⃣ Navigate to backend

```bash
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Create a file named **`.env`** inside the `backend` folder and add:

```env
DATABASE_URL=postgresql://postgres:asd@localhost:5432/crmdb

PORT=5000

JWT_SECRET=khefhei783483ncweduewr8rhruburh87

BREVO_USER=877bb6001@smtp-brevo.com
BREVO_PASS=xsmtpsib-59d21b3be7f7c7e96818ff4e7a51735b89d7ffb8b5af627ffa08e8fe7d195917-t1YPBmnGDKzET8jx
```

⚠️ **Important:** Replace credentials if required for production.

---

### 4️⃣ Run database migration

The migration script **creates tables and inserts a default Super Admin account**.

```bash
npm run migrate
```

✅ **Default Super Admin Credentials**

```
Email: manager@gmail.com
Password: asd
```

This account has **super admin access** (vertical_id = 1).

---

### 5️⃣ Start backend server

```bash
node index.js
```

Backend will run on:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup

### 1️⃣ Navigate to frontend

```bash
cd frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start development server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔐 Authentication & Roles

* Authentication uses **JWT tokens**
* Token is stored in **localStorage**
* Role access is controlled using `vertical_id`

| Role        | vertical_id |
| ----------- | ----------- |
| Super Admin | 1           |
| Others      | >1          |

Admin‑only routes are protected both **frontend (routing)** and **backend (API)**.

---

## 🧪 Common Scripts

### Backend

```bash
npm run migrate   # Run DB migrations + seed admin
```

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
```

---

## 📦 Tech Stack

### Frontend

* React 19
* Vite
* React Router DOM
* Tailwind CSS
* Axios
* React Toastify
* AOS Animations

### Backend

* Node.js
* Express
* PostgreSQL (pg)
* JWT Authentication
* bcryptjs
* Nodemailer (Brevo SMTP)
* Multer (file uploads)

---

## 🛡️ Notes

* Do **not** commit `.env` files
* Change admin credentials after first login
* For production, use proper secrets and environment variables

---

## ✅ You're Ready!

Login using the **Super Admin account**, access `/admin`, and start using the CRM.

If you face any issues, check backend logs and browser console for errors.

Happy coding 🚀
