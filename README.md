# Ventry Backend

This is the back-end for the Ventry project, a sign-in and sign-up system with an invite-only access code flow. It is built using **Node.js**, **Express**, **TypeORM**, **PostgreSQL**, and **JWT** for authentication.

## Features
- **Invite-Only Logic**: Users must provide a valid access code to sign up.
- **JWT Authentication**: Secure user authentication with JSON Web Tokens.
- **PostgreSQL Database**: Stores users and access codes using TypeORM.
- **API Endpoints**:
  - `POST /api/v1/auth/signup`: Register a new user with an access code.
  - `POST /api/v1/auth/login`: Authenticate a user and return a JWT token.
  - `GET /api/v1/auth/me`: Get the authenticated user's details (protected route).
  - `GET /api/v1/auth/validate-access-code?code=<code>`: Validate an access code.

## Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** (v8 or higher)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:peterchijioke/ventry-backend.git
cd ventry-backend

```

### 2. Install Dependencies
```bash
npm install

### 3. Set Up Environment Variables
```bash
Create a .env file in the root directory and add the following:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ventry
NODE_ENV=development
PORT=9000
JWT_SECRET=hgfcvghjhgghvbjhvgcfxchjg987656yuyfghscd23
INVITE_ONLY=true  
ACCESS_CODE=SECRET1515
```

### 4. Set Up PostgreSQL
```bash
Ensure PostgreSQL is running on your machine.
The database (ventry) will be created automatically when you run the project (see server.ts).

### 5. Run the Project
```bash
npm start
```

### API Endpoints
```bash
POST /api/v1/auth/signup

{
  "email": "testuser@example.com",
  "password": "password123",
  "accessCode": "ABC-123"
}

POST /api/v1/auth/login

{
  "email": "testuser@example.com",
  "password": "password123"
}

