# 🛍️ Multi-Vendor E-Commerce Platform

A full-stack **multi-vendor e-commerce platform** built with React.js, Node.js, Express.js, and MongoDB.

The platform provides separate workflows for **customers, sellers, and administrators**, including product management, orders, coupons, payments, dashboards, and **real-time customer–seller messaging using Socket.IO**.

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* Secure authentication
* Browse products and categories
* View product details
* Add products to cart
* Checkout and order placement
* Stripe payment integration
* View order history
* Manage customer profile
* Contact sellers
* Real-time customer–seller messaging
* View conversations and message history

### 🏪 Seller Features

* Seller registration and login
* Seller authentication
* Seller dashboard
* Create products
* Update and manage products
* Manage product inventory
* View and manage orders
* Create discount coupons
* Manage seller profile
* Communicate with customers
* Real-time messaging with customers

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Manage customers
* Manage sellers
* Manage products
* Manage orders
* Monitor platform activity
* Dashboard data visualization

---

# 💬 Real-Time Messaging

The platform includes a **customer–seller messaging system powered by Socket.IO**.

This allows customers and sellers to communicate through the application without relying only on traditional request/response flows.

### Messaging Features

* Customer → Seller messaging
* Seller → Customer messaging
* Real-time message communication
* Conversation management
* Message history
* Sender and receiver information
* Message timestamps
* Customer inbox
* Seller inbox
* Dashboard-based messaging interface

### Communication Flow

```text
┌──────────────┐
│   Customer   │
└──────┬───────┘
       │
       │ Message
       ▼
┌──────────────┐
│  Socket.IO   │
│   Server     │
└──────┬───────┘
       │
       │ Real-Time Event
       ▼
┌──────────────┐
│    Seller    │
└──────────────┘
```

---

# 💳 Payment Integration

The platform integrates **Stripe** into the checkout/payment workflow.

The payment integration allows customers to proceed through the payment flow while the backend handles payment-related operations.

> Secret keys and sensitive credentials are stored through environment variables and are not committed to the repository.

---

# 🧑‍💻 Tech Stack

## Frontend

* React.js
* JavaScript
* React Router
* Redux
* Axios
* Tailwind CSS
* Material UI
* React Icons
* Timeago.js

## Backend

* Node.js
* Express.js
* REST APIs
* MongoDB
* Mongoose
* JWT Authentication
* Cookie-based Authentication

## Real-Time Communication

* Socket.IO

## Payment

* Stripe

## Development Tools

* Git
* GitHub
* Postman
* VS Code
* npm

---

# 🏗️ Project Architecture

The application follows a separate **frontend and backend architecture**.

```text
ecommerce-multivendor/
│
├── backend/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── Assets/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── static/
│       ├── App.js
│       └── index.js
│
├── .gitignore
└── README.md
```

---

# 🔧 Backend Architecture

The backend is responsible for:

* Authentication
* Authorization
* Customer management
* Seller management
* Product APIs
* Order APIs
* Coupon APIs
* Payment-related operations
* Conversation APIs
* Messaging functionality
* Database operations
* Protected routes

The backend follows a controller-based structure to separate API logic into manageable modules.

---

# 🎨 Frontend Architecture

The frontend provides different interfaces for each type of user.

```text
Frontend
│
├── Customer
│   ├── Home
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   ├── Orders
│   └── Messages
│
├── Seller
│   ├── Dashboard
│   ├── Products
│   ├── Orders
│   ├── Coupons
│   └── Messages
│
└── Admin
    ├── Dashboard
    ├── Users
    ├── Sellers
    ├── Products
    └── Orders
```

---

# 🔐 Authentication & Authorization

The application uses authentication and role-based authorization to provide different functionality to:

* Customers
* Sellers
* Administrators

Protected routes restrict access to authorized users and prevent users from accessing functionality belonging to other roles.

Authentication credentials and sensitive configuration values are managed through environment variables.

---

# 📦 Main Modules

```text
                    Multi-Vendor E-Commerce
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
     Customer              Seller                Admin
        │                     │                     │
   ┌────┼────┐          ┌─────┼─────┐        ┌─────┼─────┐
   │    │    │          │     │     │        │     │     │
Products Cart Orders  Products Orders Coupons Users Products Orders
   │
   └──────────────┐
                  │
             Messaging
                  │
              Socket.IO
                  │
        ┌─────────┴─────────┐
        │                   │
     Customer             Seller
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB
* Git

Check your installed versions:

```bash
node -v
npm -v
git --version
```

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/im-amna/ecommerce-multivendor.git
```

```bash
cd ecommerce-multivendor
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_API_KEY=your_stripe_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

> Use the exact environment variable names required by the application code.

### Security

Never commit the following to GitHub:

* Database credentials
* JWT secrets
* Stripe secret keys
* SMTP passwords
* API keys
* Other private credentials

---

# ▶️ Running the Application

## Start Backend

From the `backend` directory:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

From the `frontend` directory:

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 📸 Screenshots

Screenshots of the major application modules will be added below.

## 🏠 Customer Interface

| Homepage          | Product Details   |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

## 🛒 Shopping & Checkout

| Cart              | Checkout          |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

## 🏪 Seller Dashboard

| Seller Dashboard  | Create Product    |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

## 📦 Order Management

| Seller Orders     | Admin Orders      |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

## 🎟️ Coupon Management

| Create Coupon     | Coupon Management |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

## 💬 Real-Time Messaging

| Customer Messages | Seller Messages   |
| ----------------- | ----------------- |
| 📷 Add Screenshot | 📷 Add Screenshot |

---

# 🧠 Key Engineering Work

This project provided practical experience in building and debugging a multi-role full-stack application.

Key areas include:

* Built REST APIs using Node.js and Express.js
* Connected the React frontend with backend APIs
* Implemented authentication and authorization
* Implemented role-based customer, seller, and admin workflows
* Used Redux for frontend state management
* Integrated MongoDB with Mongoose
* Integrated Stripe into the payment workflow
* Implemented customer–seller messaging using Socket.IO
* Built product management functionality
* Built order management functionality
* Implemented seller coupon functionality
* Developed separate dashboards for different user roles
* Managed asynchronous API requests
* Debugged frontend/backend integration issues
* Used Git and GitHub for version control

---

# 🐛 Debugging & Problem Solving

During development, several frontend and backend integration problems were identified and resolved.

Examples include:

* API error handling issues
* Authentication and login request errors
* Product creation API errors
* Dashboard data handling problems
* Order management/DataGrid issues
* Messaging and conversation data handling
* Frontend/backend route mismatches
* Payment integration configuration issues
* Socket-based messaging integration issues

The debugging process involved tracing errors from the frontend UI through API requests and backend controllers to identify and resolve root causes.

---

# 📚 Learning Outcomes

Through this project, I gained practical experience with:

* Full-stack JavaScript development
* React application architecture
* REST API development
* MongoDB database integration
* Authentication and authorization
* Role-based application design
* Redux state management
* Real-time communication with Socket.IO
* Stripe payment integration
* Multi-vendor system architecture
* Debugging frontend/backend applications
* Git and GitHub workflows

---

# 🔮 Future Improvements

Possible future improvements include:

* Advanced product search and filtering
* Enhanced seller analytics
* Improved real-time notification system
* More advanced WebSocket event handling
* Order tracking
* Image upload and cloud storage
* Automated testing
* API documentation
* Production deployment
* Performance optimization
* Additional security hardening

---

# 👩‍💻 Author

## Amna Naveed

**BS Information Technology Student | Aspiring Software Engineer / Full-Stack Developer**

GitHub:
https://github.com/im-amna

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

# 🙏 Credits

The initial project structure and learning reference were based on an open-source multi-vendor e-commerce tutorial/reference implementation.

The project was subsequently customized, debugged, extended, and integrated during development, including work on authentication, dashboards, product and order management, coupons, payments, and customer–seller messaging.
