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
  - `GET /api/validate-access-code?code=<code>`: Validate an access code.

## Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** (v8 or higher)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-backend-repo-url>
cd ventry-backend
