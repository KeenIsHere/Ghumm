# Khalti Payment Gateway Integration Guide

## Overview
This document outlines the complete integration of Khalti payment gateway as a replacement for eSewa in the GhummGhamm travel booking application.

## Changes Made

### 1. Backend Payment Controller (`server/controllers/paymentController.js`)
**Changes:**
- Replaced eSewa HMAC-based signature generation with Khalti API integration
- Updated `initiatePayment()` function to:
  - Convert amount from NPR to Paisa (multiply by 100)
  - Send POST request to Khalti's `/epayment/initiate/` endpoint
  - Return `khaltiData` with `pidx`, `payment_url`, and `expires_at`
- Updated `verifyPayment()` function to:
  - Accept Khalti callback parameters (`pidx`, `status`, `transaction_id`)
  - Call Khalti's `/epayment/lookup/` API to verify payment status
  - Only mark payment as "completed" when Khalti status is "Completed"

### 2. Premium Controller (`server/controllers/premiumController.js`)
**Changes:**
- Updated imports to use `axios` instead of `crypto`
- Added Khalti API configuration (endpoints and headers)
- Updated `initiatePayment()` to:
  - Generate `purchaseOrderId` instead of `transactionUuid`
  - Create Khalti payment requests with proper payload
  - Store `khaltiRefId` (pidx) in subscription
- Updated `initiatePremiumUpgrade()` to use Khalti
- Updated `verifyPremiumPayment()` to:
  - Accept `khaltiRefId` and `khaltiStatus` instead of `esewaRefId`
  - Store Khalti transaction reference

### 3. Database Models

#### PremiumSubscription Model (`server/models/PremiumSubscription.js`)
**Changes:**
- Replaced `esewaRefId: String` with `khaltiRefId: String`
- Updated payment method comments to reference Khalti instead of eSewa

### 4. Frontend Components

#### PaymentPremium.jsx (`client/src/pages/PaymentPremium.jsx`)
**Changes:**
- Removed eSewa form submission logic
- Updated to check for `khaltiData` instead of `esewaData`
- Changed redirect mechanism from form submission to direct URL redirect:
  ```javascript
  window.location.href = data.khaltiData.payment_url;
  ```

#### PaymentSuccess.jsx (`client/src/pages/PaymentSuccess.jsx`)
**Changes:**
- Updated callback parameter handling from `transaction_uuid` to `pidx`
- Updated to send `khaltiRefId` and `khaltiStatus` to verification endpoint
- Updated response data structure handling

#### MyBookings.jsx (`client/src/pages/MyBookings.jsx`)
**Changes:**
- Updated `handlePay()` function to use Khalti instead of eSewa
- Removed form creation and submission logic
- Simplified to direct URL redirect

#### Landing.jsx (`client/src/pages/Landing.jsx`)
**Changes:**
- Updated feature description from "Pay securely with eSewa" to "Pay securely with Khalti"

### 5. Seed Data (`server/seed/seed.js`)
**Changes:**
- Updated sample payment method from `'esewa'` to `'khalti'`

## Environment Variables Required

Add the following environment variables to your `.env` file:

```env
# Khalti Configuration
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_ENV=sandbox  # Use 'sandbox' for testing, 'production' for live

# Callback URLs
CLIENT_URL=http://localhost:5173  # Your client URL
```

## Getting Khalti Credentials

### For Sandbox Testing:
1. Visit: https://test-admin.khalti.com/#/join/merchant
2. Sign up as a merchant
3. Use OTP: `987654` for sandbox environment
4. Retrieve your `live_secret_key` from the merchant dashboard
5. Copy the key to your `.env` file as `KHALTI_SECRET_KEY`

**Test Credentials:**
- Khalti IDs: 9800000000, 9800000001, 9800000002, 9800000003, 9800000004, 9800000005
- MPIN: 1111
- OTP: 987654

### For Production:
1. Visit: https://admin.khalti.com
2. Complete merchant onboarding
3. Retrieve your production `live_secret_key`
4. Update `.env` with production key and set `KHALTI_ENV=production`

## API Endpoints

### Khalti Endpoints:

**Sandbox:**
- Base URL: https://dev.khalti.com/api/v2
- Initiate Payment: POST `/epayment/initiate/`
- Verify Payment: POST `/epayment/lookup/`

**Production:**
- Base URL: https://khalti.com/api/v2
- Initiate Payment: POST `/epayment/initiate/`
- Verify Payment: POST `/epayment/lookup/`

## Request/Response Examples

### 1. Initiate Payment Request

**Endpoint:** POST `/epayment/initiate/`

**Headers:**
```
Authorization: Key {KHALTI_SECRET_KEY}
Content-Type: application/json
```

**Payload:**
```json
{
  "return_url": "http://localhost:5173/payment/success",
  "website_url": "http://localhost:5173",
  "amount": 50000,  // Amount in paisa (500 rupees)
  "purchase_order_id": "GGTT-64a8b9c2f3e4d5c6b7a8b9c0-1234567890",
  "purchase_order_name": "Mount Everest Trek",
  "customer_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9800000123"
  },
  "merchant_username": "ghummghamm",
  "merchant_extra": "{\"bookingId\": \"64a8b9c2f3e4d5c6b7a8b9c0\"}"
}
```

**Success Response:**
```json
{
  "pidx": "bZQLD9wRVWo4CdESSfuSsB",
  "payment_url": "https://test-pay.khalti.com/?pidx=bZQLD9wRVWo4CdESSfuSsB",
  "expires_at": "2024-04-20T20:30:00+05:45",
  "expires_in": 1800
}
```

### 2. Payment Callback (Return URL)

**Parameters received at return_url:**
```
?pidx=bZQLD9wRVWo4CdESSfuSsB
&txnId=4H7AhoXDJWg5WjrcPT9ixW
&amount=50000
&total_amount=50000
&status=Completed
&mobile=9800000123
&tidx=4H7AhoXDJWg5WjrcPT9ixW
&purchase_order_id=GGTT-64a8b9c2f3e4d5c6b7a8b9c0-1234567890
&purchase_order_name=Mount Everest Trek
&transaction_id=4H7AhoXDJWg5WjrcPT9ixW
```

### 3. Verify Payment Request

**Endpoint:** POST `/epayment/lookup/`

**Headers:**
```
Authorization: Key {KHALTI_SECRET_KEY}
Content-Type: application/json
```

**Payload:**
```json
{
  "pidx": "bZQLD9wRVWo4CdESSfuSsB"
}
```

**Success Response (Completed):**
```json
{
  "pidx": "bZQLD9wRVWo4CdESSfuSsB",
  "total_amount": 50000,
  "status": "Completed",
  "transaction_id": "GFq9PFS7b2iYvL8Lir9oXe",
  "fee": 0,
  "refunded": false
}
```

## Payment Status Handling

| Status | Action | Code |
|--------|--------|------|
| Completed | Provide service to user | 200 |
| Pending | Hold transaction, contact support | 200 |
| Initiated | Payment not started | 200 |
| User canceled | User canceled payment | 400 |
| Expired | Payment link expired (60 min) | 400 |
| Refunded | Refund processed | 200 |

**Important:** Only status "Completed" should be treated as successful payment.

## Application Flow

### Booking Payment Flow:
1. User clicks "Pay Now" on a booking
2. MyBookings.jsx calls `/payments/initiate` with booking ID
3. Payment controller initiates Khalti payment
4. User is redirected to `payment_url` on Khalti's portal
5. User completes payment on Khalti
6. User is redirected back to `/payment/success` with `pidx` parameter
7. PaymentSuccess.jsx verifies payment with backend
8. Payment controller calls Khalti lookup API to confirm status
9. If confirmed, booking status changes to "paid" and "confirmed"

### Premium Subscription Flow:
1. User selects premium tier and billing cycle
2. Premium tier must be approved by admin first
3. User is redirected to PaymentPremium.jsx
4. Premium controller initiates Khalti payment
5. User is redirected to Khalti payment portal
6. After payment, user returns to `/payment/success?type=premium`
7. PaymentSuccess.jsx verifies premium payment
8. Premium subscription is activated
9. User receives confirmation email

## Testing

### Test Booking Payment:
1. Set `KHALTI_ENV=sandbox` in `.env`
2. Navigate to a package and click "Book Now"
3. Complete booking form
4. Click "Pay Now"
5. Use test Khalti ID: `9800000000`, MPIN: `1111`, OTP: `987654`
6. Verify payment success

### Test Premium Subscription:
1. Navigate to `/premium`
2. Select a tier and billing cycle
3. Admin must approve the request first
4. Once approved, click to pay
5. Complete Khalti payment flow
6. Verify premium status in profile

## Troubleshooting

### Common Issues:

1. **Authorization Error (401)**
   - Check if `KHALTI_SECRET_KEY` is correct
   - Ensure "Key " prefix is included in Authorization header
   - Verify key is for the correct environment (sandbox vs production)

2. **Amount Validation Error**
   - Amount must be in paisa (multiply NPR by 100)
   - Minimum amount: 1000 paisa (10 rupees)
   - Amount must be an integer

3. **Payment Not Verified**
   - Always use Khalti lookup API to verify status
   - Never rely solely on callback status
   - Payment link expires in 60 minutes

4. **CORS Issues**
   - Ensure `CLIENT_URL` is correctly configured
   - Khalti redirect uses GET request, ensure your return_url accepts GET

## Rollback to eSewa

If you need to revert to eSewa:
1. Restore original payment controller from git history
2. Restore original premium controller
3. Revert PremiumSubscription model changes
4. Update frontend components to use eSewa form submission
5. Configure eSewa environment variables instead of Khalti

## References

- Khalti Documentation: https://docs.khalti.com/khalti-epayment/
- Khalti Merchant Portal: https://admin.khalti.com
- Khalti Sandbox Portal: https://test-admin.khalti.com

## Support

For issues with Khalti integration:
- Check official documentation at docs.khalti.com
- Contact Khalti support: support@khalti.com
- Review Khalti API errors for specific guidance
