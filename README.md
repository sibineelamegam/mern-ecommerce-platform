# 🛒 E-Commerce Web Application

A secure, full-featured e-commerce web application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB**. Supports role-based access (admin/customer), product & category management, cart & wishlist, and order processing.

**Tech Stack:** Frontend: React, Vite, MUI, React Router | Backend: Node.js, Express, MongoDB (Mongoose) | Auth: JWT (Access & Refresh Tokens in HTTP-only Cookies) | Security: Role-based access, CORS, Secure Cookies | API: RESTful

**Roles:** Customer (view products, manage own profile, cart, wishlist, orders) | Admin (full control over users, products, categories, orders)

**Frontend Features:** Secure login/logout with token refresh, dashboards for Customer/Admin, role-based routing, Context API for auth state, product listing, details, cart, wishlist, checkout, admin management pages

**Backend Token Strategy:** Access Token (short-lived JWT for API calls), Refresh Token (long-lived in HTTP-only secure cookie), auto-refresh on frontend load

**Public Routes:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/products/:id?`, `/product/:id`

**Authenticated Customer Routes:** `/customer/profile`, `/customer/cart`, `/customer/wishlist`, `/customer/checkout`, `/customer/orders`, `/customer/orders/:id`

**Authenticated Admin Routes:** `/dashboard`, `/admin/profile`, `/admin/users`, `/admin/products`, `/admin/categories`, `/admin/orders`

## Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

**.env (backend):**

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**.env (frontend):**

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_UPLOADS_BASE_URL=http://localhost:5000/uploads
```

Frontend runs at: `http://localhost:5173`

### Dev Scripts

**Backend:** `npm run dev` (dev server)
**Frontend:** `npm run dev` (Vite dev)

### 📡 API Endpoints

#### 🔐 Auth

- `POST /api/auth/register` – 📝 Register user
- `POST /api/auth/login` – 🔑 Login user
- `POST /api/auth/logout` – 🚪 Logout user
- `GET /api/auth/refresh` – ♻️ Refresh token
- `POST /api/auth/forgot-password` – ✉️ Forgot password
- `POST /api/auth/reset-password` – 🔄 Reset password

#### 👤 Users

- `GET /api/users` – 👥 Admin: get all users
- `GET /api/users/:id` – 👤 Admin: get single user
- `PUT /api/users/:id` – ✏️ Admin: update user
- `DELETE /api/users/:id` – 🗑️ Admin: delete user
- `GET /api/users/profile/me` – 🧑 Get logged-in user profile
- `PUT /api/users/profile/me` – ✏️ Update logged-in user profile

#### 🗂 Categories

- `GET /api/categories` – 📂 Get all categories
- `GET /api/categories/:id` – 📄 Get single category
- `POST /api/categories` – ➕ Admin: create category
- `PUT /api/categories/:id` – ✏️ Admin: update category
- `DELETE /api/categories/:id` – 🗑️ Admin: delete category

#### 📦 Products

- `GET /api/products` – 📦 Get all products
- `GET /api/products/:id` – 📄 Get product by ID
- `POST /api/products` – ➕ Admin: create product
- `PUT /api/products/:id` – ✏️ Admin: update product
- `DELETE /api/products/:id` – 🗑️ Admin: delete product

#### 🛒 Cart & Wishlist

- `/api/cart` – 🛒 CRUD cart items (logged-in users)
- `/api/wishlist` – 💖 CRUD wishlist items (logged-in users)

#### 📦 Orders

- `GET /api/orders/my` – 🧾 Get orders for logged-in user
- `POST /api/orders` – 🛍️ Place order
- `GET /api/orders/:id` – 📄 Get order by ID  
- `GET /api/orders` – 🗂️ Admin: Get all orders
- `PUT /api/orders/:id` – ✏️ Admin: Update order status


### Project Structure

```
backend/
├─ config
├─ controllers/
├─ models/
├─ routes/
├─ middleware/
├─ utils/
├─ uploads/
├─ server.js
frontend/
├─ src/
│  ├─ api/
│  ├─ components/
│  ├─ context/
│  ├─ hooks/
│  ├─ pages/
│  ├─ routes/
│  ├─ styles/
│  ├─ theme.js
│  ├─ app.jsx
│  └─ main.jsx 
├─ package.json
├─ vite.config.js
```

**This project uses ES Modules. Make sure "type": "module" is set in your backend/package.json:** 

```
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

**E-Commerce Web Application:** Tokens stored in HTTP-only cookies, CORS configured, role checks enforced on frontend/backend, auto-refresh access tokens silently on frontend load.
