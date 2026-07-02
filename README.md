# 🏦 Backend Ledger

A scalable banking ledger backend built using **Node.js**, **Express.js**, and **MongoDB**. The project demonstrates secure authentication, immutable ledger entries, atomic money transfers using MongoDB transactions, and idempotent transaction handling.

---

## 🚀 Features

- 🔐 JWT Authentication
- 🍪 Cookie-based Login
- 🚪 Secure Logout using Token Blacklisting
- 👤 User Registration & Login
- 🏦 Account Creation
- 📒 Immutable Ledger Entries
- 💸 Double Entry Bookkeeping
- 🔄 MongoDB Multi-Document Transactions
- ⚡ Idempotent Money Transfers
- 📊 Dynamic Balance Calculation using Aggregation
- 📧 Email Notifications using Nodemailer OAuth2
- 📁 Modular MVC Architecture

---

# 🏗️ Project Architecture

```
Client
   │
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Models
   │
   ▼
MongoDB
```

The project follows a clean MVC architecture where routes handle incoming requests, controllers implement business logic, models interact with MongoDB, and services manage email notifications.

---

# 💰 Banking Workflow

```
Create Transaction
        │
        ▼
Validate Accounts
        │
        ▼
Check Balance
        │
        ▼
Start MongoDB Session
        │
        ▼
Create Transaction (PENDING)
        │
        ▼
Create Debit Ledger
        │
        ▼
Create Credit Ledger
        │
        ▼
Update Transaction → COMPLETED
        │
        ▼
Commit Transaction
```

If any step fails, the transaction is rolled back using MongoDB transactions.

---

# 📒 Ledger Design

The application follows an **append-only ledger system**.

Instead of updating account balances directly:

- Every debit creates a DEBIT ledger entry.
- Every credit creates a CREDIT ledger entry.
- Account balance is calculated dynamically using MongoDB Aggregation.

This approach prevents balance inconsistencies and follows real-world banking principles.

---

# 🔐 Authentication

- User Registration
- User Login
- JWT Token Generation
- Cookie-based Authentication
- Protected Routes
- Logout using Token Blacklisting

---

# 🔄 Idempotency

Each transaction requires a unique **Idempotency Key**.

If the same request is received multiple times:

- Completed transaction → rejected
- Pending transaction → rejected
- Failed transaction → new key required

This prevents duplicate money transfers.

---

# 📊 Account Balance

Balances are **never stored** inside the Account document.

Instead they are calculated from Ledger entries using MongoDB Aggregation.

Example:

```
Balance = Total Credits − Total Debits
```

---

# 📧 Email Notifications

The project sends emails using Gmail OAuth2.

Current notifications include:

- Welcome Email
- Successful Transaction Email
- Failed Transaction Email

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Cookie Parser | Cookie Management |
| Nodemailer | Email Service |
| OAuth2 | Gmail Authentication |

---

# 📂 Folder Structure

```
backend-ledger
│
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   └── services
│
├── server.js
├── package.json
└── README.md
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|----------|--------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/logout |

---

## Accounts

| Method | Endpoint |
|----------|------------------------------|
| POST | /api/accounts |
| GET | /api/accounts |
| GET | /api/accounts/balance/:accountId |

---

## Transactions

| Method | Endpoint |
|----------|---------------------------------------|
| POST | /api/transactions |
| POST | /api/transactions/system/intial-funds |

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/amanmissra302/BACKEND-LEDGER.git
```

Go inside the project

```bash
cd BACKEND-LEDGER
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

EMAIL_USER=your_email

CLIENT_ID=your_client_id

CLIENT_SECRET=your_client_secret

REFRESH_TOKEN=your_refresh_token
```

Run the server

```bash
npm run dev
```

---

# 🚀 Future Improvements

- Refresh Tokens
- Role-Based Access Control
- Transaction Reversal APIs
- Rate Limiting
- Swagger API Documentation
- Docker Support
- Redis-based Token Blacklisting
- Unit & Integration Tests

---

# 👨‍💻 Author

**Aman Kumar Mishra**

Backend Developer | Node.js | Express.js | MongoDB

---

## ⭐ If you found this project useful, consider giving it a star.
