# 🔐 Payment Validation - User Account & Profile Requirements

## Overview
Users must complete **account verification** and **profile setup** BEFORE they can make any payments (booking or premium).

This ensures:
✅ Valid email address (verified via OTP)  
✅ Complete user information (for payment records)  
✅ Secure payment transactions  
✅ Better user accountability  

---

## 📋 Required Fields for Payment

### Account Verification
- ✅ Email verified via OTP sent to inbox
- ✅ `isAccountVerified` flag set to `true`

### Profile Completion (Minimum Required)
- ✅ Full Name
- ✅ Email Address
- ✅ Phone Number
- ✅ Address
- ✅ City
- ✅ Country

---

## 🔄 Validation Flow

### Before Attempting Payment

```
User Clicks "Pay" or "Subscribe"
    ↓
System Checks:
1. Is account verified? (isAccountVerified = true)
   ├─ NO → Return error: "Please verify your email"
   └─ YES → Continue
    ↓
2. Is profile complete? (All required fields filled)
   ├─ NO → Return error: "Missing: name, phone, address..."
   └─ YES → Continue
    ↓
3. Proceed to Khalti Payment ✅
```

---

## 🚀 Implementation Changes

### Backend Middleware Added
**File**: `server/middleware/auth.js`

New middleware: `validateBeforePayment`
- Checks if `user.isAccountVerified === true`
- Checks if all required fields are filled
- Returns specific error messages for frontend

### Routes Updated
**Payment Routes**: `server/routes/paymentRoutes.js`
```javascript
// Added validateBeforePayment middleware
router.post('/initiate', auth, validateBeforePayment, initiatePayment);
```

**Premium Routes**: `server/routes/premiumRoutes.js`
```javascript
// Added validateBeforePayment middleware
router.post('/initiate-payment', auth, validateBeforePayment, initiatePayment);
router.post('/upgrade', auth, validateBeforePayment, initiatePremiumUpgrade);
```

---

## 📱 Frontend Integration

### Response Format When Validation Fails

**Missing Email Verification**:
```json
{
  "success": false,
  "message": "Please verify your email first. Check your inbox for OTP.",
  "requiresEmailVerification": true
}
```

**Missing Profile Fields**:
```json
{
  "success": false,
  "message": "Please complete your profile. Missing: phone, address, city",
  "requiresProfileCompletion": true,
  "missingFields": ["phone", "address", "city"]
}
```

### Frontend Steps

#### 1️⃣ Email Verification Flow
```javascript
// Step 1: Send OTP to email
POST /auth/send-verify-otp

// Step 2: Verify OTP
POST /auth/verify-email
Body: { otp: "123456" }

// User sees "Email verified ✅" message
```

#### 2️⃣ Profile Completion Flow
```javascript
// Update profile with required fields
PUT /users/profile
Body: {
  name: "User Name",
  phone: "9841234567",
  address: "123 Main St",
  city: "Kathmandu",
  country: "Nepal",
  // Optional
  bio: "Travel enthusiast",
  dateOfBirth: "1990-01-01",
  gender: "male"
}

// User sees "Profile updated ✅" message
```

#### 3️⃣ Payment Flow (After Verification)
```javascript
// Now user can proceed with booking or premium payment
POST /payments/initiate  // Booking payment
POST /premium/initiate-payment  // Premium payment

// Success! Payment portal opens
```

---

## 🧪 Testing the Validation

### Test Case 1: Unverified User
**Setup**:
- Create new account
- Don't verify email

**Action**:
- Try to book a package → Click "Proceed to Payment"

**Expected Result**: ❌
```
"Please verify your email first. Check your inbox for OTP."
```

**Solution**:
- Go to Profile → "Verify Email"
- Enter OTP from email
- Try payment again ✅

---

### Test Case 2: Incomplete Profile
**Setup**:
- Verify email ✅
- BUT don't fill phone/address/city/country

**Action**:
- Try to book a package → Click "Proceed to Payment"

**Expected Result**: ❌
```
"Please complete your profile. Missing: phone, address, city, country"
```

**Solution**:
- Go to Profile → Edit
- Fill all required fields
- Save ✅
- Try payment again ✅

---

### Test Case 3: Complete Profile
**Setup**:
- ✅ Email verified
- ✅ All profile fields filled

**Action**:
- Book package → Click "Proceed to Payment"

**Expected Result**: ✅
- Payment portal opens
- Khalti payment proceeds normally

---

## 📝 Required Endpoints (Already Exist)

### Email Verification
```
POST /auth/send-verify-otp
- Sends OTP to user email
- Requires: auth

POST /auth/verify-email
- Verifies OTP and sets isAccountVerified=true
- Body: { otp: "123456" }
- Requires: auth
```

### Profile Update
```
PUT /users/profile
- Updates user profile
- Body: { name, email, phone, address, city, country, bio, dateOfBirth, gender }
- Requires: auth
```

### Get User Profile
```
GET /users/profile
- Gets current user profile with all fields
- Requires: auth
```

---

## 🛡️ Database Schema

### User Model Fields

**Email Verification**:
```javascript
isAccountVerified: { type: Boolean, default: false }  // NEW VALIDATION
verifyOtp: { type: String, default: '' }
verifyOtpExpireAt: { type: Number, default: 0 }
```

**Required Profile Fields**:
```javascript
name: { type: String, required: true }          // ✅ CHECKED
email: { type: String, required: true }         // ✅ CHECKED
phone: { type: String, default: '' }            // ✅ CHECKED
address: { type: String, default: '' }          // ✅ CHECKED
city: { type: String, default: '' }             // ✅ CHECKED
country: { type: String, default: '' }          // ✅ CHECKED

// Optional
bio: { type: String, default: '' }
dateOfBirth: { type: Date, default: null }
gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' }
profileImage: { type: String, default: '' }
```

---

## 🔍 Validation Rules in Middleware

```javascript
// Check 1: Email Verified
if (!req.user.isAccountVerified) {
  return error: "Please verify your email first"
}

// Check 2: Name
if (!req.user.name || req.user.name.trim() === '') {
  return error: "Name is required"
}

// Check 3: Phone
if (!req.user.phone || req.user.phone.trim() === '') {
  return error: "Phone is required"
}

// Check 4: Address
if (!req.user.address || req.user.address.trim() === '') {
  return error: "Address is required"
}

// Check 5: City
if (!req.user.city || req.user.city.trim() === '') {
  return error: "City is required"
}

// Check 6: Country
if (!req.user.country || req.user.country.trim() === '') {
  return error: "Country is required"
}

// All checks pass → Proceed to payment ✅
```

---

## 💡 Frontend Implementation Guide

### UI Flow for Profile Completion

**If user tries to pay without verification:**

```
User clicks "Pay"
    ↓
Backend returns validation error
    ↓
Frontend shows:
┌─────────────────────────────────────┐
│ ⚠️ Complete Setup Required           │
├─────────────────────────────────────┤
│                                     │
│ Email Verification:                 │
│ ☐ Not verified - VERIFY NOW         │
│                                     │
│ Required Profile Fields:            │
│ ☐ Phone Number                      │
│ ☐ Address                           │
│ ☐ City                              │
│ ☐ Country                           │
│                                     │
│ [Complete Profile] [Verify Email]   │
└─────────────────────────────────────┘
```

---

## ✅ Checklist for Production

- [x] Backend validation middleware added
- [x] Routes updated to include validation
- [x] Error responses formatted for frontend
- [x] All required endpoints exist
- [x] Database schema supports validation
- [ ] Frontend updated to show validation errors
- [ ] Frontend UI for profile completion added
- [ ] Email verification flow tested
- [ ] Payment flow after verification tested

---

## 🚨 Edge Cases

### Case 1: User Had Account Before Update
**Solution**: Set `isAccountVerified = true` for existing users in migration

### Case 2: User Partially Filled Profile
**Solution**: Show missing fields and allow partial save (form validation on frontend)

### Case 3: Profile Fields With Spaces Only
**Solution**: `.trim()` before validation checks

### Case 4: User Changes Email
**Solution**: When email changes, require re-verification

---

## 📞 Error Messages for Frontend

| Error Code | Message | Action |
|------------|---------|--------|
| EMAIL_NOT_VERIFIED | "Please verify your email first. Check your inbox for OTP." | Show verify email button |
| PROFILE_INCOMPLETE | "Please complete your profile. Missing: phone, address, city" | Show profile edit form with missing fields highlighted |
| INVALID_DATA | "One or more fields contain invalid data" | Validate input format |
| SERVER_ERROR | "Validation error" | Show generic error, try again |

---

## 🔗 API Endpoints Reference

```bash
# Verify Email
POST http://localhost:5742/auth/send-verify-otp
Authorization: Bearer <token>

POST http://localhost:5742/auth/verify-email
Authorization: Bearer <token>
Body: { "otp": "123456" }

# Update Profile
PUT http://localhost:5742/users/profile
Authorization: Bearer <token>
Body: {
  "name": "John Doe",
  "phone": "9841234567",
  "address": "123 Main St",
  "city": "Kathmandu",
  "country": "Nepal"
}

# Get Profile
GET http://localhost:5742/users/profile
Authorization: Bearer <token>

# Book with Validation
POST http://localhost:5742/payments/initiate
Authorization: Bearer <token>
Body: { "bookingId": "...", "method": "khalti" }
# Returns: { success: false, requiresEmailVerification: true }
# OR: { success: false, requiresProfileCompletion: true, missingFields: [...] }
# OR: { success: true, khaltiData: { payment_url: "..." } }
```

---

## 📚 Files Modified

1. **server/middleware/auth.js** - Added `validateBeforePayment` middleware
2. **server/routes/paymentRoutes.js** - Added validation to payment routes
3. **server/routes/premiumRoutes.js** - Added validation to premium routes

---

## 🎯 Benefits

✅ **Security**: Verified users only  
✅ **Accountability**: Complete user information for payments  
✅ **Compliance**: Email verification ensures reachability  
✅ **User Experience**: Clear error messages guide users to complete setup  
✅ **Data Quality**: Ensures database has complete user records  

---

**Status**: ✅ COMPLETE - Ready for Frontend Implementation
