# GhummGhamm Travel & Tour Management System - Comprehensive API Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [API Endpoints](#api-endpoints)
3. [Code Explanations by Feature](#code-explanations-by-feature)
4. [Testing Strategy](#testing-strategy)
5. [Test Cases](#test-cases)
6. [CRUD Access Matrix](#crud-access-matrix)

---

## System Overview

**GhummGhamm** is a comprehensive travel and tour management system built with:
- **Backend**: Node.js + Express.js + MongoDB
- **Frontend**: React.js + Vite + Redux
- **Authentication**: JWT-based with OTP verification
- **Payment**: eSewa integration
- **Key Features**: Packages, Bookings, Reviews, Wishlists, Premium Memberships, Admin Dashboard

---

## API Endpoints

### Base URL
```
http://localhost:5742/api
```

### 1. Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/auth/register` | Register new user | ❌ | ❌ |
| POST | `/auth/login` | Login user | ❌ | ❌ |
| POST | `/auth/logout` | Logout user | ✅ | ❌ |
| POST | `/auth/send-verify-otp` | Send OTP for email verification | ✅ | ❌ |
| POST | `/auth/verify-email` | Verify email with OTP | ✅ | ❌ |
| POST | `/auth/send-reset-otp` | Send password reset OTP | ❌ | ❌ |
| POST | `/auth/reset-password` | Reset password with OTP | ❌ | ❌ |
| GET | `/auth/check` | Check authentication status | ✅ | ❌ |

**Request/Response Examples:**

```json
// POST /auth/register
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "66c...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Package Routes (`/packages`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/packages` | Get all packages | ❌ | ❌ |
| GET | `/packages/:id` | Get package details | ❌ | ❌ |
| POST | `/packages` | Create new package | ✅ | ✅ |
| PUT | `/packages/:id` | Update package | ✅ | ✅ |
| DELETE | `/packages/:id` | Delete package | ✅ | ✅ |

**Request/Response Examples:**

```json
// GET /packages
Response (200):
{
  "success": true,
  "packages": [
    {
      "_id": "60d5ec49c1234567890abc1",
      "title": "Everest Base Camp Trek",
      "location": "Nepal",
      "difficulty": "Moderate",
      "duration": 14,
      "maxGroupSize": 20,
      "price": 45000,
      "premiumPrice": 40500,
      "isPremiumOnly": false,
      "availableSlots": 5,
      "averageRating": 4.5,
      "totalReviews": 23
    }
  ]
}

// POST /packages (Admin only)
Request Body:
{
  "title": "Manali Adventure",
  "description": "Adventure tour in Manali",
  "location": "Manali, HP",
  "difficulty": "Difficult",
  "duration": 7,
  "maxGroupSize": 15,
  "price": 35000,
  "premiumPrice": 31500,
  "isPremiumOnly": false,
  "includes": ["Accommodation", "Meals", "Guides"],
  "excludes": ["Travel Insurance"],
  "startDates": ["2024-05-01", "2024-05-15"]
}

Response (201):
{
  "success": true,
  "message": "Package created successfully",
  "package": { ... }
}
```

---

### 3. Booking Routes (`/bookings`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/bookings` | Create booking | ✅ | ❌ |
| GET | `/bookings/my` | Get user's bookings | ✅ | ❌ |
| GET | `/bookings/:id` | Get booking details | ✅ | ❌ |
| PUT | `/bookings/:id/cancel` | Cancel booking | ✅ | ❌ |

**Request/Response Examples:**

```json
// POST /bookings
Request Body:
{
  "packageId": "60d5ec49c1234567890abc1",
  "startDate": "2024-05-15",
  "numberOfPeople": 4,
  "specialRequests": "Need vegetarian meals",
  "contactPhone": "+977-9841234567"
}

Response (201):
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "60d5ec49c1234567890xyz1",
    "user": "60d5ec49c1234567890abc2",
    "package": "60d5ec49c1234567890abc1",
    "numberOfPeople": 4,
    "totalPrice": 180000,
    "status": "pending",
    "paymentStatus": "unpaid"
  }
}

// GET /bookings/my
Response (200):
{
  "success": true,
  "bookings": [
    {
      "_id": "60d5ec49c1234567890xyz1",
      "package": {
        "title": "Everest Base Camp Trek"
      },
      "startDate": "2024-05-15",
      "numberOfPeople": 4,
      "totalPrice": 180000,
      "status": "confirmed",
      "paymentStatus": "paid"
    }
  ]
}
```

---

### 4. Payment Routes (`/payments`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/payments/initiate` | Initiate payment | ✅ | ❌ |
| GET | `/payments/verify` | Verify payment | ✅ | ❌ |
| GET | `/payments/my` | Get user's payments | ✅ | ❌ |

**Request/Response Examples:**

```json
// POST /payments/initiate
Request Body:
{
  "bookingId": "60d5ec49c1234567890xyz1",
  "amount": 180000
}

Response (200):
{
  "success": true,
  "esewaUrl": "https://esewa.com.np/epay/main",
  "paymentData": {
    "merchantCode": "GHUMMGHAMM",
    "amount": 180000,
    "reference": "TXN123456",
    "bookingId": "60d5ec49c1234567890xyz1"
  }
}

// GET /payments/verify?ref=TXN123456
Response (200):
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "bookingId": "60d5ec49c1234567890xyz1",
    "amount": 180000,
    "status": "completed",
    "reference": "TXN123456"
  }
}
```

---

### 5. Review Routes (`/reviews`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/reviews` | Create review | ✅ | ❌ |
| GET | `/reviews/package/:packageId` | Get package reviews | ❌ | ❌ |
| DELETE | `/reviews/:id` | Delete review | ✅ | ❌ |

**Request/Response Examples:**

```json
// POST /reviews
Request Body:
{
  "packageId": "60d5ec49c1234567890abc1",
  "bookingId": "60d5ec49c1234567890xyz1",
  "rating": 5,
  "comment": "Amazing experience! Great guides and accommodation."
}

Response (201):
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "_id": "60d5ec49c1234567890rev1",
    "package": "60d5ec49c1234567890abc1",
    "user": "60d5ec49c1234567890abc2",
    "rating": 5,
    "comment": "Amazing experience! Great guides and accommodation.",
    "createdAt": "2024-04-19T10:30:00Z"
  }
}

// GET /reviews/package/60d5ec49c1234567890abc1
Response (200):
{
  "success": true,
  "reviews": [
    {
      "_id": "60d5ec49c1234567890rev1",
      "user": {
        "name": "John Doe",
        "profileImage": "..."
      },
      "rating": 5,
      "comment": "Amazing experience!",
      "createdAt": "2024-04-19T10:30:00Z"
    }
  ]
}
```

---

### 6. User Routes (`/users`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/users/profile` | Get user profile | ✅ | ❌ |
| PUT | `/users/profile` | Update user profile | ✅ | ❌ |
| POST | `/users/profile-picture` | Upload profile picture | ✅ | ❌ |
| PUT | `/users/theme` | Update theme preference | ✅ | ❌ |
| GET | `/users/rewards` | Get reward points | ✅ | ❌ |
| PUT | `/users/change-password` | Change password | ✅ | ❌ |
| POST | `/users/upgrade-premium` | Request premium upgrade | ✅ | ❌ |

**Request/Response Examples:**

```json
// GET /users/profile
Response (200):
{
  "success": true,
  "user": {
    "_id": "60d5ec49c1234567890abc2",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977-9841234567",
    "address": "Kathmandu",
    "city": "Kathmandu",
    "country": "Nepal",
    "isPremium": false,
    "theme": "light",
    "profileImage": "..."
  }
}

// PUT /users/profile
Request Body:
{
  "name": "John Doe",
  "phone": "+977-9841234567",
  "address": "New Address",
  "city": "Pokhara",
  "country": "Nepal",
  "bio": "Travel enthusiast"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}

// GET /users/rewards
Response (200):
{
  "success": true,
  "rewards": {
    "totalPoints": 500,
    "rewardTier": "gold",
    "redeemablePoints": 450,
    "history": [
      {
        "action": "Booking completed",
        "points": 100,
        "date": "2024-04-15"
      }
    ]
  }
}
```

---

### 7. Wishlist Routes (`/wishlist`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/wishlist` | Get wishlist | ✅ | ❌ |
| GET | `/wishlist/count` | Get wishlist count | ✅ | ❌ |
| GET | `/wishlist/check/:packageId` | Check if in wishlist | ✅ | ❌ |
| POST | `/wishlist/add` | Add to wishlist | ✅ | ❌ |
| POST | `/wishlist/remove` | Remove from wishlist | ✅ | ❌ |

**Request/Response Examples:**

```json
// GET /wishlist
Response (200):
{
  "success": true,
  "wishlist": [
    {
      "_id": "60d5ec49c1234567890abc1",
      "title": "Everest Base Camp Trek",
      "location": "Nepal",
      "price": 45000,
      "averageRating": 4.5
    }
  ]
}

// POST /wishlist/add
Request Body:
{
  "packageId": "60d5ec49c1234567890abc1"
}

Response (201):
{
  "success": true,
  "message": "Package added to wishlist",
  "wishlistCount": 5
}

// GET /wishlist/check/60d5ec49c1234567890abc1
Response (200):
{
  "success": true,
  "isInWishlist": true
}
```

---

### 8. Premium Routes (`/premium`)

#### Public Routes

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/premium/tiers` | Get all premium tiers | ❌ | ❌ |

#### User Routes

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/premium/subscription` | Get subscription details | ✅ | ❌ |
| POST | `/premium/request-plan` | Request premium plan | ✅ | ❌ |
| GET | `/premium/my-requests` | Get user's requests | ✅ | ❌ |
| GET | `/premium/request/:requestId` | Get request details | ✅ | ❌ |
| POST | `/premium/initiate-payment` | Initiate premium payment | ✅ | ❌ |
| POST | `/premium/upgrade` | Upgrade premium tier | ✅ | ❌ |
| POST | `/premium/verify-payment` | Verify premium payment | ✅ | ❌ |
| POST | `/premium/cancel` | Cancel subscription | ✅ | ❌ |
| POST | `/premium/add-rewards` | Add reward points | ✅ | ❌ |
| POST | `/premium/redeem-rewards` | Redeem reward points | ✅ | ❌ |

#### Admin Routes

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/premium/admin/pending-requests` | Get pending requests | ✅ | ✅ |
| POST | `/premium/admin/approve-request` | Approve request | ✅ | ✅ |
| POST | `/premium/admin/reject-request` | Reject request | ✅ | ✅ |
| GET | `/premium/admin/members` | Get premium members | ✅ | ✅ |
| GET | `/premium/admin/members/:memberId` | Get member details | ✅ | ✅ |
| POST | `/premium/admin/extend-membership` | Extend membership | ✅ | ✅ |
| POST | `/premium/admin/suspend-membership` | Suspend membership | ✅ | ✅ |
| GET | `/premium/admin/analytics` | Get analytics | ✅ | ✅ |

**Request/Response Examples:**

```json
// GET /premium/tiers
Response (200):
{
  "success": true,
  "tiers": [
    {
      "_id": "60d5ec49c1234567890tier1",
      "name": "Silver",
      "monthlyPrice": 1300,
      "annualPrice": 13000,
      "benefits": [
        "10% discount on all packages",
        "Priority customer support",
        "2x reward points"
      ]
    },
    {
      "_id": "60d5ec49c1234567890tier2",
      "name": "Gold",
      "monthlyPrice": 1700,
      "annualPrice": 17000,
      "benefits": [
        "15% discount on all packages",
        "24/7 priority support",
        "2x reward points",
        "Free travel insurance"
      ]
    }
  ]
}

// POST /premium/request-plan
Request Body:
{
  "tierName": "gold",
  "billingCycle": "monthly"
}

Response (201):
{
  "success": true,
  "message": "Premium request created successfully",
  "request": {
    "_id": "60d5ec49c1234567890req1",
    "userId": "60d5ec49c1234567890abc2",
    "tierName": "gold",
    "billingCycle": "monthly",
    "status": "pending"
  }
}

// GET /premium/subscription
Response (200):
{
  "success": true,
  "subscription": {
    "_id": "60d5ec49c1234567890sub1",
    "tierName": "gold",
    "billingCycle": "monthly",
    "monthlyPrice": 1700,
    "status": "active",
    "startDate": "2024-03-01",
    "expiryDate": "2025-03-01",
    "nextBillingDate": "2024-05-01",
    "currentRewardPoints": 450,
    "bookingDiscountsUsed": 3,
    "discountAmountSaved": 25000
  }
}
```

---

### 9. Admin Routes (`/admin`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/admin/dashboard` | Get dashboard stats | ✅ | ✅ |
| GET | `/admin/users` | Get all users | ✅ | ✅ |
| PUT | `/admin/users/:id/role` | Update user role | ✅ | ✅ |
| DELETE | `/admin/users/:id` | Delete user | ✅ | ✅ |
| GET | `/admin/bookings` | Get all bookings | ✅ | ✅ |
| PUT | `/admin/bookings/:id/status` | Update booking status | ✅ | ✅ |
| GET | `/admin/payments` | Get all payments | ✅ | ✅ |
| GET | `/admin/reviews` | Get all reviews | ✅ | ✅ |
| GET | `/admin/reports` | Get system reports | ✅ | ✅ |

**Request/Response Examples:**

```json
// GET /admin/dashboard
Response (200):
{
  "success": true,
  "dashboard": {
    "totalUsers": 234,
    "totalBookings": 567,
    "totalRevenue": 25000000,
    "pendingBookings": 45,
    "activeUsers": 89,
    "monthlyBookings": 120,
    "monthlyRevenue": 4500000
  }
}

// GET /admin/users
Response (200):
{
  "success": true,
  "users": [
    {
      "_id": "60d5ec49c1234567890abc2",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isPremium": false,
      "createdAt": "2024-01-15"
    }
  ]
}

// PUT /admin/users/:id/role
Request Body:
{
  "role": "admin"
}

Response (200):
{
  "success": true,
  "message": "User role updated successfully",
  "user": { ... }
}
```

---

### 10. Notification Routes (`/notifications`)

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/notifications` | Get notifications | ✅ | ❌ |
| GET | `/notifications/unread-count` | Get unread count | ✅ | ❌ |
| GET | `/notifications/recent-packages` | Get recent package notifications | ✅ | ❌ |
| PUT | `/notifications/:notificationId/read` | Mark as read | ✅ | ❌ |
| PUT | `/notifications/mark-all/read` | Mark all as read | ✅ | ❌ |
| DELETE | `/notifications/:notificationId` | Delete notification | ✅ | ❌ |
| DELETE | `/notifications` | Delete all notifications | ✅ | ❌ |

---

## Code Explanations by Feature

### 1. Authentication System

**Location**: [server/controllers/authController.js](server/controllers/authController.js)

**Key Components**:
- **JWT Token**: Issued upon successful login, stored in HTTP-only cookies
- **OTP Verification**: Two-step verification using OTP for email confirmation
- **Password Reset**: Secure password reset with OTP validation
- **Role-based Access**: User vs Admin distinction

**Features**:
```javascript
// Register: Creates new user with hashed password
// Login: Validates credentials, issues JWT token
// Verify Email: Two-step process - send OTP, verify with OTP
// Reset Password: Similar two-step process for security
```

**Security**:
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 24 hours
- OTP expires after 5 minutes
- Email verification prevents fake registrations

---

### 2. Package Management System

**Location**: [server/controllers/packageController.js](server/controllers/packageController.js)

**Key Components**:
- **CRUD Operations**: Create, Read, Update, Delete packages
- **Premium Packages**: Separate pricing for premium users
- **Availability Management**: Track available slots and start dates
- **Search & Filter**: Full-text search on title, location, description

**Features**:
```javascript
// getAllPackages: 
// - Search by title/location/description
// - Filter by difficulty, duration, price
// - Paginate results
// - Include ratings

// getPackage:
// - Fetch full package details
// - Include itinerary and images
// - Calculate average rating

// createPackage (Admin only):
// - Validate all required fields
// - Upload images
// - Set premium pricing

// updatePackage & deletePackage (Admin only):
// - Update package details
// - Manage availability
// - Soft delete (mark inactive)
```

**Data Structure**:
```javascript
{
  title, description, location, difficulty, duration,
  maxGroupSize, price, premiumPrice, isPremiumOnly,
  includes, excludes, itinerary, images, startDates,
  averageRating, totalReviews, availableSlots
}
```

---

### 3. Booking System

**Location**: [server/controllers/bookingController.js](server/controllers/bookingController.js)

**Key Components**:
- **Booking Creation**: Validate availability and capacity
- **Discount Application**: Premium member discounts automatically applied
- **Booking Status**: pending → confirmed → completed or cancelled
- **Cancellation Management**: Handle refunds and cancellation reasons

**Features**:
```javascript
// createBooking:
// - Check available slots
// - Apply premium discounts if user is premium
// - Calculate total price with discounts
// - Create payment record

// getMyBookings:
// - Fetch user's bookings with package details
// - Show payment status
// - Display booking timeline

// cancelBooking:
// - Initiate refund process
// - Update booking status
// - Record cancellation reason
// - Send notification

// getBooking:
// - Detailed booking information
// - Related package details
// - Payment information
```

**Discount Logic**:
```javascript
if (user.isPremium) {
  const tier = user.premiumTier; // 'silver', 'gold', 'platinum'
  const discountPercent = {
    'silver': 10,
    'gold': 15,
    'platinum': 20
  }[tier];
  discountAmount = totalPrice * (discountPercent / 100);
  finalPrice = totalPrice - discountAmount;
}
```

---

### 4. Payment System

**Location**: [server/controllers/paymentController.js](server/controllers/paymentController.js)

**Integration**: eSewa payment gateway

**Features**:
```javascript
// initiatePayment:
// - Generate unique transaction reference
// - Calculate amount from booking
// - Return eSewa redirect URL
// - Create payment record in database

// verifyPayment:
// - Receive verification from eSewa
// - Update payment status to 'completed'
// - Update booking payment status to 'paid'
// - Update booking status to 'confirmed'
// - Send confirmation email

// getMyPayments:
// - List all user's payments
// - Show transaction history
// - Payment status tracking
```

**Payment States**:
- `unpaid`: Payment not yet initiated
- `pending`: Payment initiated, waiting verification
- `paid`: Payment confirmed by eSewa
- `failed`: Payment failed
- `refunded`: Payment refunded

---

### 5. Review System

**Location**: [server/controllers/reviewController.js](server/controllers/reviewController.js)

**Features**:
```javascript
// createReview:
// - Only users with completed bookings can review
// - Store rating (1-5 stars) and comment
// - Update package average rating
// - Increment total reviews count

// getPackageReviews:
// - Fetch all reviews for a package
// - Include user details (name, profile image)
// - Sort by date (newest first)
// - No authentication required

// deleteReview:
// - Users can delete their own reviews
// - Admins can delete any review
// - Recalculate package average rating
```

**Rating Calculation**:
```javascript
// When new review created or deleted:
averageRating = (sum of all ratings) / (total reviews count)
```

---

### 6. Wishlist System

**Location**: [server/controllers/wishlistController.js](server/controllers/wishlistController.js)

**Features**:
```javascript
// addToWishlist:
// - Add package to user's wishlist
// - Check for duplicates (prevent duplicate entries)
// - Return updated wishlist count

// removeFromWishlist:
// - Remove package from wishlist
// - Update wishlist count

// getWishlist:
// - Fetch all packages in user's wishlist
// - Include package details and pricing

// isInWishlist:
// - Check if specific package is in user's wishlist
// - Boolean response

// getWishlistCount:
// - Return total items in wishlist
// - Used for UI badge counter
```

---

### 7. User Management

**Location**: [server/controllers/userController.js](server/controllers/userController.js)

**Features**:
```javascript
// getProfile:
// - Fetch current user's profile data
// - Include premium status and rewards

// updateProfile:
// - Update user information (name, phone, address, bio, etc.)
// - Validate email uniqueness if changing email

// uploadProfilePicture:
// - Store base64 image or image URL
// - Update user's profileImage field

// updateTheme:
// - Change theme preference (light/dark)
// - Store in user document

// changePassword:
// - Validate current password
// - Hash new password
// - Update in database

// getRewards:
// - Calculate total reward points
// - Show reward history
// - Display redeemable points

// upgradeToPremium:
// - Initiate premium upgrade process
// - Create premium request
// - Trigger admin notification
```

---

### 8. Premium Membership System

**Location**: [server/controllers/premiumController.js](server/controllers/premiumController.js)

**Tiers**:
1. **Silver**: ₹1,300/month (₹13,000/year)
   - 10% discount on packages
   - 2x reward points
   - Priority support

2. **Gold**: ₹1,700/month (₹17,000/year)
   - 15% discount on packages
   - 2x reward points
   - Free travel insurance
   - Exclusive packages

3. **Platinum**: ₹2,500/month (₹25,000/year)
   - 20% discount on packages
   - 3x reward points
   - VIP support
   - Exclusive + extended itineraries

**Features**:
```javascript
// getAllTiers: Fetch all available tiers (public)

// requestPremiumPlan: User requests upgrade
// - Create PremiumRequest record
// - Set status to 'pending'
// - Notify admin

// getUserSubscription: Get active subscription details

// initiatePayment: Start premium payment

// verifyPremiumPayment: Activate subscription after payment

// cancelSubscription: User cancels premium

// addRewardPoints: Add points for completed bookings
// - Silver: 1x multiplier
// - Gold: 2x multiplier
// - Platinum: 3x multiplier

// redeemRewardPoints: User redeems points as discount

// Admin routes:
// - Approve/reject premium requests
// - Manage premium members
// - Extend/suspend memberships
// - View analytics
```

**Reward Points Logic**:
```javascript
// On booking completion:
const basePoints = bookingValue / 100; // ₹100 = 1 point
const multiplier = tierMultiplier[tier]; // 1, 2, or 3
const totalPoints = basePoints * multiplier;
```

---

### 9. Admin Dashboard

**Location**: [server/controllers/adminController.js](server/controllers/adminController.js)

**Features**:
```javascript
// getDashboard:
// - Total users count
// - Total bookings count
// - Total revenue
// - Pending bookings
// - Active users (last 7 days)
// - Monthly statistics

// getAllUsers:
// - List all users with details
// - Filter by role/premium status
// - Pagination support

// updateUserRole:
// - Change user role between 'user' and 'admin'
// - Audit log this action

// deleteUser:
// - Remove user account
// - Handle cascading deletions (bookings, reviews, etc.)

// getAllBookings:
// - View all system bookings
// - Filter by status
// - Pagination

// updateBookingStatus:
// - Change booking status
// - Update related package slots
// - Send notifications

// getAllPayments:
// - View transaction history
// - Filter by status/date

// getAllReviews:
// - Monitor all reviews
// - Flag inappropriate content

// getReports:
// - Generate business analytics
// - Revenue reports
// - User behavior analytics
```

---

### 10. Notification System

**Location**: [server/controllers/notificationController.js](server/controllers/notificationController.js)

**Types of Notifications**:
- Booking confirmations
- Payment confirmations
- Review replies
- Premium membership updates
- New package releases
- System announcements

**Features**:
```javascript
// getNotifications:
// - Fetch user's notification list
// - Include unread status
// - Paginate results

// getUnreadCount:
// - Quick count of unread notifications
// - Used for UI badge

// markAsRead:
// - Mark single notification as read

// markAllAsRead:
// - Mark all notifications as read

// deleteNotification:
// - Remove single notification

// deleteAllNotifications:
// - Clear all notifications

// getRecentPackages:
// - Get notifications about new/updated packages
// - Used for "What's New" feature
```

---

## Testing Strategy

### Overview
Comprehensive testing approach covering multiple levels to ensure system reliability, security, and performance.

### 1. White Box Testing

**Definition**: Testing internal code logic, conditions, and paths without relying on user interface.

**Focus Areas**:

#### Authentication Logic
```
- Password hashing verification
- JWT token generation and validation
- OTP generation and expiration
- Role-based access control
- Email verification flow
```

#### Booking System Logic
```
- Discount calculation for premium users
- Availability slot management
- Price calculation with discounts
- Status state transitions (pending → confirmed → completed)
- Refund logic for cancellations
```

#### Premium Tier Logic
```
- Reward points calculation based on tier
- Discount multipliers (10%, 15%, 20%)
- Membership expiry and renewal logic
- Billing cycle management
```

#### Validation Logic
```
- Input validation for all endpoints
- Schema validation against MongoDB models
- Error handling and error messages
- Edge cases (empty fields, invalid IDs, etc.)
```

---

### 2. Black Box Testing

**Definition**: Testing functionality from user perspective without knowledge of internal code.

**Scenarios**:

#### User Journey 1: Package Booking
```
1. User browses packages
2. User filters by difficulty/price/location
3. User views package details
4. User creates booking
5. User initiates payment
6. User verifies payment
7. User receives confirmation
8. User writes review
```

#### User Journey 2: Premium Membership
```
1. User views premium tiers
2. User requests premium upgrade
3. Admin approves request
4. User initiates payment
5. User completes payment
6. User receives premium benefits (discounts, rewards)
7. User views reward history
8. User redeems reward points
```

#### Admin Journey: System Management
```
1. Admin logs in
2. Admin views dashboard statistics
3. Admin manages users and bookings
4. Admin approves premium requests
5. Admin manages premium members
6. Admin generates reports
```

---

### 3. Unit Testing

**Components to Test**:

#### Authentication Unit Tests
```javascript
✓ Register with valid credentials
✓ Register with duplicate email
✓ Login with correct password
✓ Login with incorrect password
✓ Verify email with correct OTP
✓ Verify email with expired OTP
✓ Reset password flow
✓ JWT token expiration
```

#### Booking Unit Tests
```javascript
✓ Create booking with available slots
✓ Create booking exceeds max group size
✓ Create booking insufficient slots
✓ Cancel booking within policy
✓ Calculate discount for premium user (silver 10%)
✓ Calculate discount for premium user (gold 15%)
✓ Calculate discount for premium user (platinum 20%)
✓ Calculate final price with discount
```

#### Package Unit Tests
```javascript
✓ Create package with valid data
✓ Create package missing required fields
✓ Update package details
✓ Delete package (soft delete)
✓ Calculate average rating
✓ Handle package images upload
✓ Search packages by text
✓ Filter packages by criteria
```

#### Premium Unit Tests
```javascript
✓ Calculate reward points (tier multiplier)
✓ Apply discount based on tier
✓ Renew subscription on billing date
✓ Suspend membership on non-payment
✓ Redeem reward points
```

---

### 4. API Testing

**Tools**: Postman, Jest with Supertest

#### Authentication Endpoints
```javascript
POST /api/auth/register
- Valid registration
- Duplicate email error
- Missing required fields
- Password requirements

POST /api/auth/login
- Valid credentials
- Invalid email/password
- Account not verified

POST /api/auth/send-verify-otp
- Send OTP successfully
- Resend OTP

POST /api/auth/verify-email
- Valid OTP
- Expired OTP
- Invalid OTP
```

#### Package Endpoints
```javascript
GET /api/packages
- Fetch all packages
- Pagination
- Search functionality
- Filter by difficulty

GET /api/packages/:id
- Valid package ID
- Invalid package ID

POST /api/packages (Admin)
- Create with valid data
- Create without auth
- Create without admin role

PUT /api/packages/:id (Admin)
- Update existing package
- Update invalid ID

DELETE /api/packages/:id (Admin)
- Delete existing package
- Delete invalid ID
```

#### Booking Endpoints
```javascript
POST /api/bookings (Auth required)
- Create valid booking
- Insufficient slots error
- Unauthorized (no token)

GET /api/bookings/my (Auth required)
- Get user's bookings
- Unauthorized access

PUT /api/bookings/:id/cancel (Auth required)
- Cancel existing booking
- Cancel already cancelled
- Unauthorized cancellation
```

#### Payment Endpoints
```javascript
POST /api/payments/initiate (Auth required)
- Initiate valid payment
- Invalid booking ID
- Already paid booking

GET /api/payments/verify (Auth required)
- Valid verification
- Invalid reference
- Duplicate verification
```

#### Premium Endpoints
```javascript
GET /api/premium/tiers
- Fetch all tiers (public)

POST /api/premium/request-plan (Auth required)
- Valid tier request
- Already subscribed user
- Invalid tier name

POST /api/premium/verify-payment (Auth required)
- Valid payment verification
- Activate subscription

POST /api/premium/cancel (Auth required)
- Cancel active subscription
- Already cancelled error
```

#### Admin Endpoints
```javascript
GET /api/admin/dashboard (Admin only)
- Access as admin
- Unauthorized (non-admin)

GET /api/admin/users (Admin only)
- Fetch all users
- Unauthorized access

PUT /api/admin/users/:id/role (Admin only)
- Update user role
- Invalid user ID
```

---

### 5. System Testing

**Integration Tests**:

#### Complete Booking Flow
```
1. User registers → Auth system
2. User logs in → JWT issued
3. User browses packages → Package system
4. User creates booking → Booking system
5. System applies discount → Premium system
6. User initiates payment → Payment system
7. Payment verified → Booking confirmed
8. User reviews package → Review system
9. Admin views report → Admin system
```

#### Premium Upgrade Flow
```
1. User requests premium → Premium system
2. Admin approves request → Notification system
3. User initiates payment → Payment system
4. Payment verified → Premium activated
5. User gets discounts → Booking system applies discount
6. User earns rewards → Reward system
7. User views analytics → Dashboard system
```

#### Performance Tests
```
- Load test: 100 concurrent users
- Response time: < 500ms for GET requests
- Response time: < 1000ms for POST requests
- Database query optimization
- Image upload handling (base64 optimization)
```

#### Security Tests
```
- SQL injection prevention
- XSS protection via input validation
- CSRF token validation
- Password strength requirements
- JWT token expiration
- Rate limiting on auth endpoints
- Authorization checks on protected routes
```

---

## Test Cases

### Test Case Tables

#### TC-001: Authentication - Registration

| Field | Value |
|-------|-------|
| **Test ID** | TC-001 |
| **Feature** | User Registration |
| **Module** | Authentication |
| **Objective** | Verify user can register with valid credentials |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Navigate to registration page | - | Registration form displayed |
| 2 | Enter valid name | "John Doe" | Name accepted |
| 3 | Enter valid email | "john@example.com" | Email accepted |
| 4 | Enter password | "SecurePass123" | Password accepted (meets requirements) |
| 5 | Click register button | - | User created, JWT issued |
| 6 | Verify database entry | - | User record created with hashed password |

**Expected Result**: User successfully registered and logged in
**Actual Result**: ✓ Pass / ✗ Fail
**Notes**: Password must be min 8 chars with uppercase, lowercase, number

---

#### TC-002: Authentication - Duplicate Email

| Field | Value |
|-------|-------|
| **Test ID** | TC-002 |
| **Feature** | User Registration |
| **Module** | Authentication |
| **Objective** | Verify system prevents duplicate email registration |
| **Test Type** | Negative |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Register first user | "john@example.com" | User created successfully |
| 2 | Attempt register second user | "john@example.com" | Error message: "Email already registered" |
| 3 | Check database | - | Only one user with this email |
| 4 | Verify response status | - | HTTP 400 (Bad Request) |

**Expected Result**: Registration rejected with appropriate error
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-003: Booking - Premium Discount (Silver)

| Field | Value |
|-------|-------|
| **Test ID** | TC-003 |
| **Feature** | Premium Booking Discount |
| **Module** | Bookings & Premium |
| **Objective** | Verify 10% discount applied for Silver tier users |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as silver tier user | Valid credentials | User logged in |
| 2 | Select package | Price: ₹100,000 | Package selected |
| 3 | Create booking | 1 person | Booking created |
| 4 | Verify original price | - | ₹100,000 displayed |
| 5 | Verify discount applied | - | Discount: ₹10,000 (10%) |
| 6 | Verify final price | - | Final: ₹90,000 |
| 7 | Check booking record | - | discountApplied: 10, discountAmount: 10000 |

**Expected Result**: 10% discount correctly calculated and applied
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-004: Booking - Premium Discount (Gold)

| Field | Value |
|-------|-------|
| **Test ID** | TC-004 |
| **Feature** | Premium Booking Discount |
| **Module** | Bookings & Premium |
| **Objective** | Verify 15% discount applied for Gold tier users |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as gold tier user | Valid credentials | User logged in |
| 2 | Select package | Price: ₹100,000 | Package selected |
| 3 | Create booking | 1 person | Booking created |
| 4 | Verify discount applied | - | Discount: ₹15,000 (15%) |
| 5 | Verify final price | - | Final: ₹85,000 |

**Expected Result**: 15% discount correctly calculated
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-005: Booking - Premium Discount (Platinum)

| Field | Value |
|-------|-------|
| **Test ID** | TC-005 |
| **Feature** | Premium Booking Discount |
| **Module** | Bookings & Premium |
| **Objective** | Verify 20% discount applied for Platinum tier users |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as platinum tier user | Valid credentials | User logged in |
| 2 | Select package | Price: ₹100,000 | Package selected |
| 3 | Create booking | 1 person | Booking created |
| 4 | Verify discount applied | - | Discount: ₹20,000 (20%) |
| 5 | Verify final price | - | Final: ₹80,000 |

**Expected Result**: 20% discount correctly calculated
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-006: Booking - Insufficient Slots

| Field | Value |
|-------|-------|
| **Test ID** | TC-006 |
| **Feature** | Booking Validation |
| **Module** | Bookings |
| **Objective** | Verify booking rejected when insufficient slots |
| **Test Type** | Negative |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Select package | availableSlots: 2 | Package selected |
| 2 | Attempt booking | numberOfPeople: 5 | Error: "Insufficient available slots" |
| 3 | Verify booking not created | - | No booking record created |
| 4 | Check response status | - | HTTP 400 (Bad Request) |

**Expected Result**: Booking rejected with error message
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-007: Payment - Successful Verification

| Field | Value |
|-------|-------|
| **Test ID** | TC-007 |
| **Feature** | Payment Verification |
| **Module** | Payments |
| **Objective** | Verify eSewa payment verification and booking confirmation |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Create booking | Valid package & user | Booking created (status: pending) |
| 2 | Initiate payment | Valid amount | eSewa URL generated |
| 3 | Complete payment on eSewa | - | Redirect with ref code |
| 4 | Verify payment | Reference code | Payment verified, status: paid |
| 5 | Check booking status | - | Updated to: confirmed |
| 6 | Check payment record | - | paymentStatus: paid |
| 7 | Verify email sent | - | Confirmation email received |

**Expected Result**: Payment verified, booking confirmed
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-008: Premium Request - Admin Approval

| Field | Value |
|-------|-------|
| **Test ID** | TC-008 |
| **Feature** | Premium Upgrade |
| **Module** | Premium |
| **Objective** | Verify user can request and admin can approve premium upgrade |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as regular user | Valid credentials | User logged in, isPremium: false |
| 2 | Request premium | Tier: Gold | Request created, status: pending |
| 3 | Check admin notifications | - | Admin sees pending request |
| 4 | Admin approves request | Request ID | Request status: approved |
| 5 | User initiates payment | Gold tier monthly | Payment initiated |
| 6 | User verifies payment | eSewa ref | Subscription activated |
| 7 | Check user record | - | isPremium: true, premiumTier: gold |
| 8 | Check discounts applied | New booking | 15% discount applied |

**Expected Result**: Premium upgrade successful
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-009: Reward Points - Calculation by Tier

| Field | Value |
|-------|-------|
| **Test ID** | TC-009 |
| **Feature** | Reward Points |
| **Module** | Premium |
| **Objective** | Verify reward points calculated correctly by tier |
| **Test Type** | Positive |
| **Priority** | Medium |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Complete booking (Silver) | Amount: ₹100,000 | Points: 1,000 (1x multiplier) |
| 2 | Complete booking (Gold) | Amount: ₹100,000 | Points: 2,000 (2x multiplier) |
| 3 | Complete booking (Platinum) | Amount: ₹100,000 | Points: 3,000 (3x multiplier) |
| 4 | Check reward history | - | All points recorded correctly |

**Expected Result**: Reward points calculated with correct multipliers
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-010: Review - Only Completed Bookings

| Field | Value |
|-------|-------|
| **Test ID** | TC-010 |
| **Feature** | Review System |
| **Module** | Reviews |
| **Objective** | Verify only users with completed bookings can review |
| **Test Type** | Positive |
| **Priority** | Medium |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | User with pending booking | Tries to review | Error: "Booking not completed" |
| 2 | User with confirmed booking | Tries to review | Error: "Booking not completed" |
| 3 | User with completed booking | Creates review | Review created successfully |
| 4 | Check package rating | - | Rating updated in package |

**Expected Result**: Only completed bookings can be reviewed
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-011: Wishlist - Add and Remove

| Field | Value |
|-------|-------|
| **Test ID** | TC-011 |
| **Feature** | Wishlist |
| **Module** | Wishlist |
| **Objective** | Verify package can be added/removed from wishlist |
| **Test Type** | Positive |
| **Priority** | Medium |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Check initial wishlist | - | Empty wishlist |
| 2 | Add package | Package ID | Package added, count: 1 |
| 3 | Add same package again | Package ID | Duplicate prevented, count: 1 |
| 4 | Add different package | Different Package ID | Package added, count: 2 |
| 5 | Remove package | Package ID | Package removed, count: 1 |
| 6 | Verify removal | - | Package no longer in wishlist |

**Expected Result**: Wishlist operations successful
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-012: Admin - User Role Update

| Field | Value |
|-------|-------|
| **Test ID** | TC-012 |
| **Feature** | Admin Management |
| **Module** | Admin |
| **Objective** | Verify admin can update user roles |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as admin | Valid admin credentials | Admin logged in |
| 2 | Select user | Regular user | User selected |
| 3 | Update role | role: "admin" | Role updated successfully |
| 4 | Check user record | - | User's role updated to "admin" |
| 5 | Verify new user | Login as new admin | Can access admin routes |

**Expected Result**: User role successfully updated
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-013: Authorization - Non-Admin Access

| Field | Value |
|-------|-------|
| **Test ID** | TC-013 |
| **Feature** | Authorization |
| **Module** | Admin |
| **Objective** | Verify non-admin users cannot access admin endpoints |
| **Test Type** | Negative |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Login as regular user | Valid user credentials | User logged in |
| 2 | Attempt access admin dashboard | GET /api/admin/dashboard | Error: "Unauthorized - Admin only" |
| 3 | Attempt create package | POST /api/packages | Error: "Unauthorized - Admin only" |
| 4 | Attempt update user role | PUT /api/admin/users/:id/role | Error: "Unauthorized - Admin only" |
| 5 | Verify response status | - | HTTP 403 (Forbidden) |

**Expected Result**: Non-admin users blocked from admin operations
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-014: Search - Package Full Text Search

| Field | Value |
|-------|-------|
| **Test ID** | TC-014 |
| **Feature** | Package Search |
| **Module** | Packages |
| **Objective** | Verify full text search works across title, location, description |
| **Test Type** | Positive |
| **Priority** | Medium |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Search by title | "Everest" | All Everest packages returned |
| 2 | Search by location | "Nepal" | All Nepal packages returned |
| 3 | Search by description | "adventure" | All adventure packages returned |
| 4 | Search non-existent | "xyz" | No results |

**Expected Result**: Full text search returns correct results
**Actual Result**: ✓ Pass / ✗ Fail

---

#### TC-015: Notification - Email Verification

| Field | Value |
|-------|-------|
| **Test ID** | TC-015 |
| **Feature** | Email Notifications |
| **Module** | Notifications |
| **Objective** | Verify OTP email is sent for email verification |
| **Test Type** | Positive |
| **Priority** | High |

| Step | Action | Input | Expected Output |
|------|--------|-------|-----------------|
| 1 | Register new user | Valid email | User created |
| 2 | User requests verify OTP | - | Email sent with OTP |
| 3 | Check email | - | OTP received in mailbox |
| 4 | Verify email with OTP | OTP code | Email verification successful |
| 5 | Check user record | - | isAccountVerified: true |

**Expected Result**: Verification email sent and OTP validated successfully
**Actual Result**: ✓ Pass / ✗ Fail

---

## CRUD Access Matrix

### Comprehensive Access Control Matrix

| Resource | Operation | Public | User | Admin | Notes |
|----------|-----------|--------|------|-------|-------|
| **Users** | | | | | |
| | CREATE (Register) | ✓ | ✗ | ✗ | Anyone can register |
| | READ (Profile) | ✗ | ✓* | ✓* | Only own profile or admin |
| | UPDATE (Profile) | ✗ | ✓* | ✓ | Users update own, admins update any |
| | DELETE | ✗ | ✗ | ✓ | Admin only |
| **Packages** | | | | | |
| | CREATE | ✗ | ✗ | ✓ | Admin only |
| | READ (List) | ✓ | ✓ | ✓ | Public access |
| | READ (Detail) | ✓ | ✓ | ✓ | Public access |
| | UPDATE | ✗ | ✗ | ✓ | Admin only |
| | DELETE | ✗ | ✗ | ✓ | Admin only (soft delete) |
| **Bookings** | | | | | |
| | CREATE | ✗ | ✓ | ✗ | Authenticated users only |
| | READ (Own) | ✗ | ✓* | ✓ | Users see own, admin sees all |
| | READ (All) | ✗ | ✗ | ✓ | Admin only |
| | UPDATE (Cancel) | ✗ | ✓* | ✓ | Users cancel own, admin cancels any |
| | DELETE | ✗ | ✗ | ✓ | Admin only |
| **Payments** | | | | | |
| | CREATE (Initiate) | ✗ | ✓ | ✗ | Authenticated users only |
| | READ (Own) | ✗ | ✓* | ✓ | Users see own, admin sees all |
| | VERIFY | ✗ | ✓ | ✓ | Payment gateway or admin |
| | DELETE | ✗ | ✗ | ✓ | Admin only |
| **Reviews** | | | | | |
| | CREATE | ✗ | ✓ | ✗ | Authenticated users only |
| | READ (All) | ✓ | ✓ | ✓ | Public access |
| | UPDATE | ✗ | ✓* | ✓ | Users update own, admins update any |
| | DELETE (Own) | ✗ | ✓* | ✓ | Users delete own, admins delete any |
| **Wishlists** | | | | | |
| | CREATE (Add) | ✗ | ✓ | ✗ | Authenticated users only |
| | READ | ✗ | ✓* | ✓* | Users see own, admins can view user data |
| | UPDATE (Remove) | ✗ | ✓* | ✓ | Users update own, admins can remove |
| | DELETE (Clear) | ✗ | ✓* | ✓ | Users clear own |
| **Premium Subscriptions** | | | | | |
| | CREATE (Request) | ✗ | ✓ | ✗ | Authenticated users only |
| | READ (Own) | ✗ | ✓* | ✓ | Users see own, admins see all |
| | READ (All) | ✗ | ✗ | ✓ | Admin only |
| | UPDATE (Cancel) | ✗ | ✓* | ✓ | Users cancel own, admins manage all |
| | EXTEND (Admin) | ✗ | ✗ | ✓ | Admin only |
| | SUSPEND (Admin) | ✗ | ✗ | ✓ | Admin only |
| **Premium Requests** | | | | | |
| | CREATE (Request) | ✗ | ✓ | ✗ | Authenticated users only |
| | READ (Own) | ✗ | ✓* | ✓ | Users see own, admins see all |
| | APPROVE | ✗ | ✗ | ✓ | Admin only |
| | REJECT | ✗ | ✗ | ✓ | Admin only |
| **Notifications** | | | | | |
| | READ (Own) | ✗ | ✓* | ✓* | Users see own |
| | UPDATE (Mark Read) | ✗ | ✓* | ✓* | Users manage own |
| | DELETE (Own) | ✗ | ✓* | ✓* | Users delete own |
| **Admin Functions** | | | | | |
| | VIEW Dashboard | ✗ | ✗ | ✓ | Admin only |
| | MANAGE Users | ✗ | ✗ | ✓ | Admin only |
| | MANAGE Bookings | ✗ | ✗ | ✓ | Admin only |
| | VIEW Reports | ✗ | ✗ | ✓ | Admin only |

### Legend
- ✓ = **Allowed** (Full Access)
- ✗ = **Denied** (No Access)
- ✓* = **Conditional** (Restricted by ownership or role)

### Detailed Access Rules

#### User Records
```
- Public User: Can register (no auth needed)
- Authenticated User:
  - READ: Own profile only
  - UPDATE: Own profile only
- Admin:
  - READ: Any user profile
  - UPDATE: Any user profile
  - DELETE: Any user
```

#### Package Records
```
- Public Access:
  - VIEW all packages (list & detail)
  - SEARCH packages
- Authenticated User:
  - Same as public (no special access)
- Admin:
  - CREATE: New packages
  - UPDATE: Any package
  - DELETE: Any package (soft delete - mark inactive)
```

#### Booking Records
```
- Public: No access
- Authenticated User:
  - CREATE: New bookings
  - READ: Own bookings only
  - CANCEL: Own bookings only
- Admin:
  - CREATE: None (users create, admins manage)
  - READ: All bookings
  - UPDATE: Any booking status
  - DELETE: Any booking
```

#### Payment Records
```
- Public: No access
- Authenticated User:
  - CREATE: Initiate own payments
  - VERIFY: Own payments (with eSewa callback)
  - READ: Own payment history
- Admin:
  - READ: All payments
  - VERIFY: Manage payment verification
  - DELETE: Any payment record
```

#### Review Records
```
- Public: VIEW all reviews (no auth needed)
- Authenticated User:
  - CREATE: Only after completed booking
  - UPDATE/DELETE: Own reviews only
- Admin:
  - CREATE: Can create reviews
  - UPDATE: Any review
  - DELETE: Any review
```

#### Wishlist Records
```
- Public: No access
- Authenticated User:
  - CREATE/UPDATE/DELETE: Own wishlist only
  - READ: Own wishlist only
- Admin:
  - READ: User wishlists (for admin panel)
  - MANAGE: Can manage user wishlists
```

#### Premium Subscription Records
```
- Public: VIEW premium tiers only
- Authenticated User:
  - REQUEST: Premium upgrade
  - READ: Own subscription
  - CANCEL: Own subscription
- Admin:
  - REQUEST: Can create for users
  - READ: All subscriptions
  - UPDATE: All subscriptions
  - EXTEND: Membership extensions
  - SUSPEND: Membership suspension
```

#### Admin Dashboard Records
```
- Public: No access
- Authenticated User: No access
- Admin:
  - VIEW: Dashboard statistics
  - MANAGE: All system resources
  - GENERATE: Reports and analytics
  - AUDIT: System activities
```

---

## Field-Level Access Control

### User Profile Fields
```
Public Readable:
  - name
  - profileImage
  - bio

User (Own Profile):
  - email
  - phone
  - address
  - city
  - country
  - dateOfBirth
  - gender
  - isPremium
  - theme
  - createdAt

User (Cannot Access):
  - password (never)
  - resetOtp (never)
  - verifyOtp (never)

Admin (All Fields):
  - All fields readable
  - Can update any field
```

### Package Fields
```
Public Readable:
  - title, description, location
  - difficulty, duration, maxGroupSize
  - price, premiumPrice
  - averageRating, totalReviews
  - images, coverImage
  - startDates, availableSlots

Admin Can Update:
  - All public fields
  - isPremiumOnly
  - includes, excludes
  - itinerary
  - isActive
```

### Booking Fields
```
Owner (User) Can View:
  - All fields of own bookings

Owner (User) Cannot View:
  - Other users' bookings

Admin Can View:
  - All booking fields
  - All user bookings
```

---

## Summary

This comprehensive documentation covers:

1. **40+ API Endpoints** organized by feature modules
2. **Request/Response Examples** for real-world integration
3. **10 Feature Modules** with detailed code explanations
4. **Complete Testing Strategy** covering 5 levels of testing
5. **15+ Test Cases** with detailed step-by-step scenarios
6. **CRUD Access Matrix** with 30+ resource types
7. **Field-Level Access Control** for sensitive data protection

### Key Statistics
- **Total API Endpoints**: 40+
- **Test Cases**: 15+ detailed scenarios
- **Resource Types**: 30+
- **Authentication Methods**: JWT + OTP
- **User Roles**: 2 (User, Admin)
- **Premium Tiers**: 3 (Silver, Gold, Platinum)
- **Access Control Levels**: 3 (Public, User, Admin)

---

**Last Updated**: April 19, 2026
**Version**: 1.0
**Maintained By**: Development Team
