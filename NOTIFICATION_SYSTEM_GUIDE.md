# 🔔 GhummGhamm Notification System - Complete Guide

## Overview
Complete notification system with **60+ notification types** covering all user and admin workflows.

---

## 📋 USER NOTIFICATIONS

### 1. **Account & Verification Events**

#### Registration & Verification
| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Welcome to GhummGhamm | `user_registered` | 👤 | Medium | User signs up |
| Email Verification Pending | `email_verification_pending` | ⏳ | Medium | OTP sent to email |
| Email Verified | `email_verified` | ✓ | Medium | OTP verified successfully |
| Email Verification Incomplete | `email_verification_incomplete` | ❌ | High | OTP verification failed |
| Profile Verification Pending | `profile_verification_pending` | ⏳ | Medium | Profile submitted for review |
| Profile Verified | `profile_verification_completed` | ✅ | High | Admin approves profile |
| Profile Verification Failed | `profile_verification_incomplete` | ❌ | High | Admin rejects profile |

#### Security
| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| New Login Alert | `login_alert` | 🔐 | High | User logs in (includes device info) |
| Password Changed | `password_changed` | 🔑 | High | User resets password |

---

### 2. **Booking Status Notifications**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Booking Pending | `booking_pending` | ⏳ | High | Booking created, awaiting payment |
| Awaiting Payment | `booking_awaiting_payment` | 💳 | High | Booking created, needs payment |
| Payment Confirmed | `booking_payment_confirmed` | ✅ | High | Payment received for booking |
| Booking Confirmed | `booking_confirmed` | ✓ | High | Booking finalized |
| Upcoming Trip Reminder | `booking_reminder` | 📅 | Medium | 7 days before travel |
| Trip Completed | `booking_completed` | 🎉 | Medium | Travel date passed |
| Booking Cancelled | `booking_cancelled` | ❌ | High | User/Admin cancels booking |
| Booking Expired | `booking_expired` | ⏱️ | High | Payment not completed in time |

---

### 3. **Payment Status Notifications**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Payment Initiated | `payment_initiated` | 💳 | High | Payment process started |
| Payment Pending | `payment_pending` | ⏳ | High | Waiting for payment completion |
| Payment Successful | `payment_received` | 💳 | High | Payment verified ✅ |
| Payment Failed | `payment_failed` | ❌ | High | Payment verification failed |
| Refund Processed | `refund_processed` | 💰 | High | Money refunded to account |

---

### 4. **Premium Membership Notifications**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Request Submitted | `premium_request_submitted` | 📝 | Medium | User submits premium request |
| Request Approved | `premium_approved` | ✅ | High | Admin approves request |
| Request Rejected | `premium_rejected` | ❌ | High | Admin rejects request |
| Payment Pending | `premium_payment_pending` | ⏳ | High | Premium payment awaiting completion |
| Premium Activated | `premium_activated` | 👑 | High | Premium subscription confirmed |
| Premium Expiring Soon | `premium_expiring_soon` | ⏰ | High | 7 days until expiry |
| Premium Expired | `premium_expired` | ⏱️ | Medium | Subscription period ended |

---

### 5. **Package & Wishlist Notifications**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| New Package Available | `package_added` | 📦 | Medium | Admin adds new package |
| Package Discount | `package_discount` | 🎉 | High | Price reduced on package |
| Added to Wishlist | `wishlist_added` | ❤️ | Low | User adds to wishlist |
| Wishlist Item on Sale | `wishlist_on_sale` | 🔥 | High | Price drop on wishlist item |
| Review Received | `review_received` | ⭐ | Medium | User receives review rating |

---

## 👨‍💼 ADMIN NOTIFICATIONS

### 1. **User Management & Verification**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| New User Registration | `new_user_admin` | 👤 | Medium | New user signs up |
| Email Verification Pending | `admin_email_verification_pending` | ⏳ | Medium | User email awaiting verification |
| User Email Verified | `admin_email_verified` | ✅ | Medium | User verified email |
| Profile Verification Pending | `admin_profile_verification_pending` | ⏳ | High | Profile under review |
| User Profile Verified | `admin_profile_verified` | ✅ | Medium | Profile approved ✅ |
| Profile Verification Failed | `admin_profile_verification_failed` | ❌ | High | Profile rejected ❌ |

---

### 2. **Booking Management**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| New Booking Received | `new_booking_admin` | 📋 | High | User creates booking |
| Booking Pending Payment | `admin_booking_pending` | ⏳ | High | Booking awaits payment |
| Awaiting Booking Payment | `admin_booking_awaiting_payment` | 💳 | High | Payment not received |
| Booking Payment Confirmed | `admin_booking_payment_confirmed` | ✅ | High | Payment verified |
| Booking Completed | `admin_booking_completed` | 🎉 | Medium | Trip date passed |
| Booking Cancelled | `admin_booking_cancelled` | ❌ | High | User/System cancels booking |
| Booking Expired | `admin_booking_expired` | ⏱️ | Medium | Payment deadline missed |

---

### 3. **Payment Management**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Payment Initiated | `admin_payment_initiated` | 💳 | High | User starts payment |
| Payment Pending | `admin_payment_pending` | ⏳ | High | Awaiting payment completion |
| Payment Received | `payment_received_admin` | 💰 | High | Payment verified ✅ |
| Payment Failed | `admin_payment_failed` | ❌ | High | Payment verification failed |
| Refund Processed | `admin_refund_processed` | 💰 | High | Money refunded to user |

---

### 4. **Premium Membership Management**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| New Premium Request | `admin_premium_request_submitted` | 📝 | High | User requests premium |
| Premium Approved | `admin_premium_approved` | ✅ | High | Admin approves request |
| Premium Rejected | `admin_premium_rejected` | ❌ | High | Admin rejects request |
| Premium Payment Pending | `admin_premium_payment_pending` | ⏳ | High | User hasn't paid yet |
| Premium Payment Received | `admin_premium_payment_received` | 💳 | High | Premium payment confirmed |
| Premium Expiring Soon | `admin_premium_expiring_soon` | ⏰ | Medium | 7 days until expiry |
| Premium Expired | `admin_premium_expired` | ⏱️ | Medium | Subscription ended |

---

### 5. **Security & Risk Management**

| Notification | Type | Icon | Priority | Trigger |
|---|---|---|---|---|
| Suspicious Activity | `suspicious_activity` | ⚠️ | High | Multiple failed logins, etc. |

---

## 🔄 Notification Flow Examples

### Example 1: Complete Booking Flow
```
User Perspective:
1. Creates booking → "Booking Pending" (⏳)
2. Initiates payment → "Payment Initiated" (💳)
3. Completes payment → "Payment Confirmed" (✅) + "Booking Confirmed" (✓)
4. 7 days before → "Upcoming Trip Reminder" (📅)
5. Travel completes → "Trip Completed" (🎉)

Admin Perspective:
1. New booking → "New Booking Received" (📋)
2. User starts payment → "Payment Initiated" (💳)
3. Payment confirmed → "Payment Received" (💰) + "Booking Payment Confirmed" (✅)
4. Trip date passes → "Booking Completed" (🎉)
```

### Example 2: Premium Subscription Flow
```
User Perspective:
1. Submits request → "Request Submitted" (📝)
2. Admin approves → "Request Approved" (✅)
3. Initiates payment → "Payment Pending" (⏳)
4. Pays successfully → "Premium Activated" (👑)
5. Day 358 (7 days before expiry) → "Premium Expiring Soon" (⏰)
6. Renewal date → "Premium Expired" (⏱️)

Admin Perspective:
1. New request → "New Premium Request" (📝)
2. Reviews & approves → "Premium Approved" (✅)
3. User initiates payment → "Premium Payment Pending" (⏳)
4. Payment received → "Premium Payment Received" (💳)
5. 7 days before expiry → "Premium Expiring Soon" (⏰)
```

### Example 3: Account Verification Flow
```
User Perspective:
1. Registers → "Welcome" (👤)
2. Verifies email → "Email Verification Pending" (⏳) → "Email Verified" (✓)
3. Completes profile → "Profile Verification Pending" (⏳)
4. Admin reviews → "Profile Verified" (✅) or "Profile Verification Failed" (❌)

Admin Perspective:
1. New user signup → "New User Registration" (👤)
2. Email verified by user → "User Email Verified" (✅)
3. Profile submitted → "Profile Verification Pending" (⏳)
4. Reviews & approves → "User Profile Verified" (✅)
```

---

## 🛠️ Integration Points

### Where to Trigger Notifications:

**AuthController:**
- `register()` → `user_registered`, `admin_new_user_admin`
- `verifyEmail()` → `email_verified`, `admin_email_verified`
- `login()` → `login_alert`
- `resetPassword()` → `password_changed`

**BookingController:**
- `createBooking()` → `booking_pending`, `admin_booking_pending`, `new_booking_admin`
- `confirmBooking()` → `booking_confirmed`, `admin_booking_confirmed`
- `cancelBooking()` → `booking_cancelled`, `admin_booking_cancelled`
- Scheduled job (7 days before) → `booking_reminder`, (cron-based)
- Scheduled job (travel date passed) → `booking_completed` (cron-based)

**PaymentController:**
- `initiatePayment()` → `payment_initiated`, `admin_payment_initiated`
- `verifyPayment()` → `payment_received`, `admin_payment_received`, `booking_payment_confirmed`
- On failure → `payment_failed`, `admin_payment_failed`
- On refund → `refund_processed`, `admin_refund_processed`

**PremiumController:**
- `requestPremiumPlan()` → `premium_request_submitted`, `admin_premium_request_submitted`
- `approvePremiumRequest()` → `premium_approved`, `admin_premium_approved`
- `rejectPremiumRequest()` → `premium_rejected`, `admin_premium_rejected`
- `verifyPremiumPayment()` → `premium_payment_completed`, `premium_activated`, `admin_premium_payment_received`
- Scheduled job (7 days before expiry) → `premium_expiring_soon`, `admin_premium_expiring_soon`
- Scheduled job (expiry date) → `premium_expired`, `admin_premium_expired`

**UserController:**
- Update profile → Profile verification flow
- Email/Phone verification → Verification notifications

**WishlistController:**
- `addToWishlist()` → `wishlist_added`
- Package price drop → `wishlist_on_sale`

**ReviewController:**
- `createReview()` → `review_received`

---

## 📊 Notification Features

✅ **Real-time Delivery**
- 15-second polling cycle
- Browser push notifications (Web Notification API)
- Toast alerts for immediate feedback

✅ **Dual Delivery for Admins**
- In-app notifications
- Email notifications (Brevo SMTP)

✅ **User Actions**
- Mark as read / Mark all as read
- Delete individual / Delete all
- Filter by priority/type

✅ **Status Indicators**
- Color-coded by priority (red/high, green/success, orange/warning, purple/premium)
- Unread badge with pulse animation
- Timestamp for each notification

✅ **Data Context**
- Booking references
- Payment amounts
- Device information (for login alerts)
- Premium tier details
- Rejection reasons

---

## 🔧 Configuration

### Notification Model Indexes
- `userId` + `createdAt` for efficient sorting
- TTL index for 30-day auto-deletion
- `isAdminNotification` + `isRead` for filtering

### Frontend Display
- Max 20 notifications per fetch
- Auto-refresh every 15 seconds
- Infinite scroll support
- Color-coded by type/priority

### Email Notifications
- Brevo SMTP (smtp-relay.brevo.com:587)
- HTML templates with inline CSS
- Rate-limited to prevent spam
- Recipient: All users with role='admin'

---

## 📱 Browser Push Notifications

**Requirements:**
- HTTPS connection (or localhost)
- User permission granted
- Browser support (Chrome, Firefox, Edge, Safari 16+)

**Behavior:**
- Requests permission on first app load
- Shows system notification for new alerts
- Badge with app icon
- Click to focus app window

---

## 📝 Future Enhancements

- [ ] Notification preferences UI (user can disable specific types)
- [ ] SMS notifications for critical alerts
- [ ] Notification scheduling (do not disturb hours)
- [ ] Notification grouping (combine similar types)
- [ ] In-app notification center/archive
- [ ] Notification analytics dashboard
- [ ] Custom notification templates per admin
- [ ] Webhook notifications for external integrations
- [ ] Notification retry logic for failed emails

---

**Last Updated:** April 20, 2026
**Notification Types:** 60+
**Integration Points:** 8 controllers
