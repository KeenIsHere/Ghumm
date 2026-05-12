# GhummGhamm - Travel & Tour Management System

A full-stack web application for browsing, booking, and managing travel packages in Nepal. Built as a Final Year Project using the MERN stack.

## Features

- User registration and login with email OTP verification
- Browse and search trekking/travel packages
- Package detail view with reviews and ratings
- Booking system with cancellation support
- eSewa payment gateway integration
- Wishlist for saving favourite packages
- Premium membership tiers with discounts
- Notifications for booking updates
- Admin dashboard for managing users, packages, bookings, and payments

## Tech Stack

**Frontend:** React.js, Redux Toolkit, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js, JWT, Bcrypt  
**Database:** MongoDB, Mongoose  
**Email:** Brevo (SMTP)  
**Payment:** eSewa

## Project Structure

```
travelapp/
├── client/         # React frontend
├── server/         # Express backend
├── Scripts/        # Database and server startup scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create a `.env` file in `server/` based on `.env.example`

### Running the App

Start MongoDB (if running locally):
```
Scripts/Database/start-mongodb.bat
```

Start the backend server:
```
Scripts/Server/start-app.bat
```

Or manually:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Seeding

To seed initial package data:
```bash
cd server
node seed/seed.js
node seed/seedPremiumTiers.js
```

## Environment Variables

See `server/.env.example` for required environment variables including:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `BREVO_SMTP_*` - Email service credentials
- `ESEWA_*` - eSewa payment gateway keys
