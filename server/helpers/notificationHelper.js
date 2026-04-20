const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../config/mailer');

/**
 * Create a user notification
 */
const createUserNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      userId,
      ...notificationData,
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Error creating user notification:', err);
  }
};

/**
 * Create admin notification and send email
 */
const createAdminNotification = async (notificationData, adminEmailContent) => {
  try {
    // Get all admins
    const admins = await User.find({ role: 'admin' });

    // Create in-app notifications for all admins
    for (const admin of admins) {
      const notification = new Notification({
        userId: admin._id,
        isAdminNotification: true,
        priority: 'high',
        ...notificationData,
      });
      await notification.save();
    }

    // Send emails to all admins
    if (adminEmailContent && adminEmailContent.recipients.length > 0) {
      for (const admin of admins) {
        try {
          await sendEmail(
            admin.email,
            adminEmailContent.subject,
            adminEmailContent.html
          );
        } catch (emailErr) {
          console.error(`Failed to send admin email to ${admin.email}:`, emailErr);
        }
      }
    }

    return true;
  } catch (err) {
    console.error('Error creating admin notification:', err);
  }
};

/**
 * Notification templates
 */
const NotificationTemplates = {
  // Account Events
  userRegistered: (userName) => ({
    type: 'user_registered',
    title: '👤 Welcome to GhummGhamm!',
    message: `Welcome ${userName}! Your account has been created successfully.`,
    icon: 'user',
    color: 'blue',
    priority: 'medium',
  }),

  emailVerified: () => ({
    type: 'email_verified',
    title: '✓ Email Verified',
    message: 'Your email has been successfully verified. You can now make bookings and enjoy all features.',
    icon: 'check',
    color: 'green',
    priority: 'medium',
  }),

  loginAlert: (device) => ({
    type: 'login_alert',
    title: '🔐 New Login',
    message: `You signed in to your GhummGhamm account${device ? ` from ${device}` : ''}. If this wasn't you, change your password immediately.`,
    icon: 'lock',
    color: 'yellow',
    priority: 'high',
    data: { loginDevice: device },
  }),

  passwordChanged: () => ({
    type: 'password_changed',
    title: '🔑 Password Changed',
    message: 'Your password has been successfully changed.',
    icon: 'lock',
    color: 'orange',
    priority: 'high',
  }),

  // Booking Events
  bookingConfirmed: (packageName, bookingRef, travelDate) => ({
    type: 'booking_confirmed',
    title: '✓ Booking Confirmed',
    message: `Your booking for ${packageName} on ${travelDate} is confirmed! Reference: ${bookingRef}`,
    icon: 'check',
    color: 'green',
    priority: 'high',
    data: { bookingReference: bookingRef },
  }),

  bookingCancelled: (packageName, bookingRef) => ({
    type: 'booking_cancelled',
    title: '❌ Booking Cancelled',
    message: `Your booking for ${packageName} (${bookingRef}) has been cancelled.`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  bookingReminder: (packageName, travelDate, daysLeft) => ({
    type: 'booking_reminder',
    title: '📅 Upcoming Trip Reminder',
    message: `Your trip to ${packageName} is ${daysLeft} days away on ${travelDate}. Prepare your bags!`,
    icon: 'bell',
    color: 'blue',
    priority: 'medium',
  }),

  // Booking Status Updates (User)
  bookingPending: (packageName, bookingRef) => ({
    type: 'booking_pending',
    title: '⏳ Booking Pending',
    message: `Your booking for ${packageName} (${bookingRef}) is pending. Complete payment to confirm.`,
    icon: 'clock',
    color: 'orange',
    priority: 'high',
    data: { bookingReference: bookingRef, status: 'pending' },
  }),

  bookingAwaitingPayment: (packageName, amount, bookingRef) => ({
    type: 'booking_awaiting_payment',
    title: '💳 Awaiting Payment',
    message: `Your booking for ${packageName} is awaiting payment of Rs. ${amount}. Reference: ${bookingRef}`,
    icon: 'credit-card',
    color: 'orange',
    priority: 'high',
    data: { bookingReference: bookingRef, amount },
  }),

  bookingPaymentConfirmed: (packageName, bookingRef) => ({
    type: 'booking_payment_confirmed',
    title: '✅ Payment Confirmed',
    message: `Payment confirmed for ${packageName}. Your booking (${bookingRef}) is confirmed!`,
    icon: 'check',
    color: 'green',
    priority: 'high',
    data: { bookingReference: bookingRef },
  }),

  bookingCompleted: (packageName, bookingRef) => ({
    type: 'booking_completed',
    title: '🎉 Trip Completed',
    message: `Thank you! Your trip to ${packageName} (${bookingRef}) has been completed. Please share your review!`,
    icon: 'star',
    color: 'green',
    priority: 'medium',
    data: { bookingReference: bookingRef, status: 'completed' },
  }),

  bookingExpired: (packageName, bookingRef) => ({
    type: 'booking_expired',
    title: '⏱️ Booking Expired',
    message: `Your booking for ${packageName} (${bookingRef}) has expired and been automatically cancelled.`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
    data: { bookingReference: bookingRef, status: 'expired' },
  }),

  // Payment Status Updates (User)
  paymentInitiated: (amount, bookingRef) => ({
    type: 'payment_initiated',
    title: '💳 Payment Initiated',
    message: `Payment of Rs. ${amount} initiated for booking ${bookingRef}. Please complete the process.`,
    icon: 'credit-card',
    color: 'blue',
    priority: 'high',
    data: { amount, bookingReference: bookingRef, status: 'initiated' },
  }),

  paymentPending: (amount, bookingRef) => ({
    type: 'payment_pending',
    title: '⏳ Payment Pending',
    message: `Payment of Rs. ${amount} is pending for booking ${bookingRef}. Complete it to confirm your booking.`,
    icon: 'clock',
    color: 'orange',
    priority: 'high',
    data: { amount, bookingReference: bookingRef, status: 'pending' },
  }),

  // Verification Status Updates (User)
  emailVerificationPending: () => ({
    type: 'email_verification_pending',
    title: '⏳ Email Verification Pending',
    message: 'Your email verification is pending. Check your inbox for the verification link.',
    icon: 'mail',
    color: 'orange',
    priority: 'medium',
    data: { status: 'pending' },
  }),

  emailVerificationIncomplete: (reason) => ({
    type: 'email_verification_incomplete',
    title: '❌ Email Verification Incomplete',
    message: `Email verification could not be completed. ${reason || 'Please try again.'}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
    data: { status: 'failed', reason },
  }),

  profileVerificationPending: () => ({
    type: 'profile_verification_pending',
    title: '⏳ Profile Verification Pending',
    message: 'Your profile details are being verified. This may take up to 24 hours.',
    icon: 'user',
    color: 'orange',
    priority: 'medium',
    data: { status: 'pending' },
  }),

  profileVerificationCompleted: () => ({
    type: 'profile_verification_completed',
    title: '✅ Profile Verified',
    message: 'Your profile has been successfully verified! You can now book premium packages.',
    icon: 'check',
    color: 'green',
    priority: 'high',
    data: { status: 'completed' },
  }),

  profileVerificationIncomplete: (reason) => ({
    type: 'profile_verification_incomplete',
    title: '❌ Profile Verification Failed',
    message: `Profile verification failed. ${reason || 'Please check your details and try again.'}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
    data: { status: 'failed', reason },
  }),

  // Premium Status Updates (User)
  premiumRequestSubmitted: (tier, billingCycle) => ({
    type: 'premium_request_submitted',
    title: '📝 Premium Request Submitted',
    message: `Your request for ${tier} premium (${billingCycle}) has been submitted. Admin will review shortly.`,
    icon: 'document',
    color: 'blue',
    priority: 'medium',
    data: { tierName: tier, billingCycle, status: 'pending' },
  }),

  premiumPaymentPending: (tier, amount, billingCycle) => ({
    type: 'premium_payment_pending',
    title: '💳 Premium Payment Pending',
    message: `Your ${tier} premium subscription (${billingCycle}) payment of Rs. ${amount} is awaiting completion.`,
    icon: 'credit-card',
    color: 'orange',
    priority: 'high',
    data: { tierName: tier, amount, status: 'payment_pending' },
  }),
  paymentSuccess: (amount, bookingRef) => ({
    type: 'payment_received',
    title: '💳 Payment Successful',
    message: `Payment of Rs. ${amount} received for booking ${bookingRef}. Thank you!`,
    icon: 'credit-card',
    color: 'green',
    priority: 'high',
    data: { amount, bookingReference: bookingRef },
  }),

  paymentFailed: (reason) => ({
    type: 'payment_failed',
    title: '❌ Payment Failed',
    message: `Your payment failed. Reason: ${reason}. Please try again.`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  refundProcessed: (amount, reason) => ({
    type: 'refund_processed',
    title: '💰 Refund Processed',
    message: `Refund of Rs. ${amount} has been processed. Reason: ${reason}`,
    icon: 'credit-card',
    color: 'green',
    priority: 'high',
    data: { amount },
  }),

  // Premium Events
  premiumActivated: (tier, discount, expiryDate) => ({
    type: 'premium_activated',
    title: '👑 Premium Activated',
    message: `Welcome to ${tier} tier! Enjoy ${discount}% discount on all packages. Valid until ${expiryDate}.`,
    icon: 'star',
    color: 'purple',
    priority: 'high',
  }),

  premiumApproved: (tier, billingCycle) => ({
    type: 'premium_approved',
    title: '✅ Premium Request Approved',
    message: `Your request for ${tier} (${billingCycle}) premium membership has been approved! Proceed to payment to activate.`,
    icon: 'check',
    color: 'green',
    priority: 'high',
  }),

  premiumRejected: (tier, rejectionReason) => ({
    type: 'premium_rejected',
    title: '❌ Premium Request Rejected',
    message: `Your request for ${tier} premium membership was not approved.${rejectionReason ? ` Reason: ${rejectionReason}` : ' Contact support for details.'}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  premiumPaymentCompleted: (tier, discount, expiryDate) => ({
    type: 'premium_payment_completed',
    title: '💳 Premium Subscription Active',
    message: `Your ${tier} premium subscription is now active! Enjoy ${discount}% discount until ${expiryDate}.`,
    icon: 'credit-card',
    color: 'green',
    priority: 'high',
  }),

  premiumExpiringSOon: (daysLeft, tier) => ({
    type: 'premium_expiring_soon',
    title: '⏰ Premium Expiring Soon',
    message: `Your ${tier} premium membership expires in ${daysLeft} days. Renew now to keep your benefits!`,
    icon: 'alert',
    color: 'orange',
    priority: 'high',
  }),

  premiumExpired: () => ({
    type: 'premium_expired',
    title: '⏱️ Premium Expired',
    message: 'Your premium membership has expired. Upgrade again to enjoy exclusive benefits.',
    icon: 'alert',
    color: 'red',
    priority: 'medium',
  }),

  // Package Events
  packageAdded: (packageName, price) => ({
    type: 'package_added',
    title: '📦 New Package Available',
    message: `Check out "${packageName}" starting at Rs. ${price}!`,
    icon: 'package',
    color: 'blue',
    priority: 'medium',
  }),

  packageDiscount: (packageName, discount) => ({
    type: 'package_discount',
    title: '🎉 Special Discount',
    message: `${packageName} is now on sale with ${discount}% discount!`,
    icon: 'gift',
    color: 'orange',
    priority: 'high',
  }),

  wishlistAdded: (packageName) => ({
    type: 'wishlist_added',
    title: '❤️ Added to Wishlist',
    message: `${packageName} has been added to your wishlist. Check it out later!`,
    icon: 'heart',
    color: 'red',
    priority: 'low',
  }),

  reviewReceived: (packageName, rating) => ({
    type: 'review_received',
    title: '⭐ New Review',
    message: `You received a ${rating}-star review for ${packageName}`,
    icon: 'star',
    color: 'orange',
    priority: 'medium',
  }),

  // Admin Events
  adminNewBooking: (userName, packageName, amount) => ({
    type: 'new_booking_admin',
    title: '📋 New Booking Received',
    message: `${userName} booked "${packageName}" for Rs. ${amount}`,
    icon: 'alert',
    color: 'blue',
    priority: 'high',
  }),

  adminPaymentReceived: (userName, amount, bookingRef) => ({
    type: 'payment_received_admin',
    title: '💰 Payment Received',
    message: `${userName} paid Rs. ${amount} for booking ${bookingRef}`,
    icon: 'credit-card',
    color: 'green',
    priority: 'high',
  }),

  adminNewUser: (userName, userEmail) => ({
    type: 'new_user_admin',
    title: '👤 New User Registration',
    message: `${userName} (${userEmail}) has signed up for GhummGhamm`,
    icon: 'user',
    color: 'blue',
    priority: 'medium',
  }),

  adminSuspiciousActivity: (description) => ({
    type: 'suspicious_activity',
    title: '⚠️ Suspicious Activity',
    message: description,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  adminPremiumApproved: (userName, tier, billingCycle) => ({
    type: 'admin_premium_approved',
    title: '✅ Premium Request Approved',
    message: `${userName} was approved for ${tier} (${billingCycle}). They can now proceed to payment.`,
    icon: 'check',
    color: 'green',
    priority: 'high',
  }),

  adminPremiumRejected: (userName, tier) => ({
    type: 'admin_premium_rejected',
    title: '❌ Premium Request Rejected',
    message: `${userName}'s request for ${tier} premium membership was rejected.`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  adminPremiumPaymentReceived: (userName, tier, amount, billingCycle) => ({
    type: 'admin_premium_payment_received',
    title: '💳 Premium Payment Received',
    message: `${userName} paid Rs. ${amount} for ${tier} premium (${billingCycle})`,
    icon: 'credit-card',
    color: 'purple',
    priority: 'high',
  }),

  // Admin Booking Status Notifications
  adminBookingPending: (userName, packageName, bookingRef, amount) => ({
    type: 'admin_booking_pending',
    title: '⏳ Booking Pending Payment',
    message: `${userName}'s booking for ${packageName} (${bookingRef}) is pending payment of Rs. ${amount}`,
    icon: 'clock',
    color: 'orange',
    priority: 'high',
  }),

  adminBookingAwaitingPayment: (userName, packageName, bookingRef, amount) => ({
    type: 'admin_booking_awaiting_payment',
    title: '💳 Awaiting Booking Payment',
    message: `${userName} has a booking (${bookingRef}) awaiting payment of Rs. ${amount} for ${packageName}`,
    icon: 'credit-card',
    color: 'orange',
    priority: 'high',
  }),

  adminBookingPaymentConfirmed: (userName, packageName, bookingRef, amount) => ({
    type: 'admin_booking_payment_confirmed',
    title: '✅ Booking Payment Confirmed',
    message: `${userName}'s payment of Rs. ${amount} confirmed for booking ${bookingRef}`,
    icon: 'check',
    color: 'green',
    priority: 'high',
  }),

  adminBookingCompleted: (userName, packageName, bookingRef) => ({
    type: 'admin_booking_completed',
    title: '🎉 Booking Completed',
    message: `${userName}'s trip to ${packageName} (${bookingRef}) has been completed`,
    icon: 'star',
    color: 'green',
    priority: 'medium',
  }),

  adminBookingCancelled: (userName, packageName, bookingRef, reason) => ({
    type: 'admin_booking_cancelled',
    title: '❌ Booking Cancelled',
    message: `${userName}'s booking (${bookingRef}) for ${packageName} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  adminBookingExpired: (userName, packageName, bookingRef) => ({
    type: 'admin_booking_expired',
    title: '⏱️ Booking Expired',
    message: `${userName}'s booking (${bookingRef}) for ${packageName} has expired and been auto-cancelled`,
    icon: 'alert',
    color: 'red',
    priority: 'medium',
  }),

  // Admin Payment Status Notifications
  adminPaymentInitiated: (userName, amount, bookingRef) => ({
    type: 'admin_payment_initiated',
    title: '💳 Payment Initiated',
    message: `${userName} initiated payment of Rs. ${amount} for booking ${bookingRef}`,
    icon: 'credit-card',
    color: 'blue',
    priority: 'high',
  }),

  adminPaymentPending: (userName, amount, bookingRef) => ({
    type: 'admin_payment_pending',
    title: '⏳ Payment Pending',
    message: `${userName} has a pending payment of Rs. ${amount} for booking ${bookingRef}`,
    icon: 'clock',
    color: 'orange',
    priority: 'high',
  }),

  adminPaymentFailed: (userName, amount, bookingRef, reason) => ({
    type: 'admin_payment_failed',
    title: '❌ Payment Failed',
    message: `${userName}'s payment of Rs. ${amount} for booking ${bookingRef} failed.${reason ? ` Reason: ${reason}` : ''}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  adminRefundProcessed: (userName, amount, bookingRef, reason) => ({
    type: 'admin_refund_processed',
    title: '💰 Refund Processed',
    message: `Refund of Rs. ${amount} processed for ${userName}'s booking ${bookingRef}.${reason ? ` Reason: ${reason}` : ''}`,
    icon: 'credit-card',
    color: 'green',
    priority: 'high',
  }),

  // Admin Verification Status Notifications
  adminUserEmailVerificationPending: (userName, userEmail) => ({
    type: 'admin_email_verification_pending',
    title: '⏳ Email Verification Pending',
    message: `${userName} (${userEmail}) email verification is pending`,
    icon: 'mail',
    color: 'orange',
    priority: 'medium',
  }),

  adminUserEmailVerified: (userName, userEmail) => ({
    type: 'admin_email_verified',
    title: '✅ User Email Verified',
    message: `${userName} (${userEmail}) has verified their email address`,
    icon: 'check',
    color: 'green',
    priority: 'medium',
  }),

  adminUserProfileVerificationPending: (userName, userEmail) => ({
    type: 'admin_profile_verification_pending',
    title: '⏳ Profile Verification Pending',
    message: `${userName} (${userEmail}) profile verification is pending review`,
    icon: 'user',
    color: 'orange',
    priority: 'high',
  }),

  adminUserProfileVerified: (userName, userEmail) => ({
    type: 'admin_profile_verified',
    title: '✅ User Profile Verified',
    message: `${userName} (${userEmail}) profile has been verified successfully`,
    icon: 'check',
    color: 'green',
    priority: 'medium',
  }),

  adminUserProfileVerificationFailed: (userName, userEmail, reason) => ({
    type: 'admin_profile_verification_failed',
    title: '❌ Profile Verification Failed',
    message: `${userName} (${userEmail}) profile verification failed.${reason ? ` Reason: ${reason}` : ''}`,
    icon: 'alert',
    color: 'red',
    priority: 'high',
  }),

  // Admin Premium Status Notifications
  adminPremiumRequestSubmitted: (userName, tier, billingCycle) => ({
    type: 'admin_premium_request_submitted',
    title: '📝 New Premium Request',
    message: `${userName} submitted a request for ${tier} premium (${billingCycle}) membership`,
    icon: 'document',
    color: 'blue',
    priority: 'high',
  }),

  adminPremiumPaymentPending: (userName, tier, amount, billingCycle) => ({
    type: 'admin_premium_payment_pending',
    title: '💳 Premium Payment Pending',
    message: `${userName}'s premium payment of Rs. ${amount} for ${tier} (${billingCycle}) is pending`,
    icon: 'credit-card',
    color: 'orange',
    priority: 'high',
  }),

  adminPremiumExpiringSoon: (userName, tier, daysLeft) => ({
    type: 'admin_premium_expiring_soon',
    title: '⏰ Premium Expiring Soon',
    message: `${userName}'s ${tier} premium membership expires in ${daysLeft} days`,
    icon: 'alert',
    color: 'orange',
    priority: 'medium',
  }),

  adminPremiumExpired: (userName, tier) => ({
    type: 'admin_premium_expired',
    title: '⏱️ Premium Expired',
    message: `${userName}'s ${tier} premium membership has expired`,
    icon: 'alert',
    color: 'red',
    priority: 'medium',
  }),
};

/**
 * Email templates for admin notifications
 */
const AdminEmailTemplates = {
  newBooking: (userName, packageName, amount, bookingRef) => ({
    subject: '📋 New Booking - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #667eea; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>New Booking Received</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 User:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">📦 Package:</span>
                      <span class="value">${packageName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">💰 Amount:</span>
                      <span class="value">Rs. ${amount}</span>
                  </div>
                  <div class="detail">
                      <span class="label">🔖 Reference:</span>
                      <span class="value">${bookingRef}</span>
                  </div>
                  <p style="margin-top: 20px; color: #999;">
                      Please review the booking in the admin dashboard.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),

  paymentReceived: (userName, amount, bookingRef) => ({
    subject: '💰 Payment Received - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #10b981; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
              .amount { font-size: 24px; color: #10b981; font-weight: bold; text-align: center; margin: 15px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Payment Received</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 From:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="amount">Rs. ${amount}</div>
                  <div class="detail">
                      <span class="label">🔖 Booking Reference:</span>
                      <span class="value">${bookingRef}</span>
                  </div>
                  <p style="margin-top: 20px; color: #999;">
                      Payment has been successfully received and processed.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),

  newUser: (userName, userEmail) => ({
    subject: '👤 New User Registration - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #3b82f6; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #3b82f6; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>New User Registration</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 Name:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">📧 Email:</span>
                      <span class="value">${userEmail}</span>
                  </div>
                  <p style="margin-top: 20px; color: #999;">
                      A new user has registered on GhummGhamm.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),

  premiumApproved: (userName, tier, billingCycle) => ({
    subject: '✅ Premium Request Approved - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #10b981; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>✅ Premium Request Approved</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 User:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">👑 Tier:</span>
                      <span class="value">${tier}</span>
                  </div>
                  <div class="detail">
                      <span class="label">📅 Billing Cycle:</span>
                      <span class="value">${billingCycle}</span>
                  </div>
                  <p style="margin-top: 20px; color: #666;">
                      This user's premium membership request has been approved and they can now proceed to payment.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),

  premiumRejected: (userName, tier, rejectionReason) => ({
    subject: '❌ Premium Request Rejected - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #ef4444; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #ef4444; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>❌ Premium Request Rejected</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 User:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">👑 Requested Tier:</span>
                      <span class="value">${tier}</span>
                  </div>
                  ${rejectionReason ? `<div class="detail">
                      <span class="label">📝 Reason:</span>
                      <span class="value">${rejectionReason}</span>
                  </div>` : ''}
                  <p style="margin-top: 20px; color: #666;">
                      This user's premium membership request has been rejected.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),

  premiumPaymentReceived: (userName, tier, amount, billingCycle) => ({
    subject: '💳 Premium Payment Received - GhummGhamm Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
              .header { background: #8b5cf6; color: white; padding: 15px; border-radius: 5px; text-align: center; }
              .content { padding: 20px; }
              .detail { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #8b5cf6; }
              .label { font-weight: bold; color: #333; }
              .value { color: #666; }
              .amount { font-size: 28px; color: #8b5cf6; font-weight: bold; text-align: center; margin: 15px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>💳 Premium Payment Received</h2>
              </div>
              <div class="content">
                  <div class="detail">
                      <span class="label">👤 User:</span>
                      <span class="value">${userName}</span>
                  </div>
                  <div class="detail">
                      <span class="label">👑 Tier:</span>
                      <span class="value">${tier}</span>
                  </div>
                  <div class="amount">Rs. ${amount}</div>
                  <div class="detail">
                      <span class="label">📅 Billing Cycle:</span>
                      <span class="value">${billingCycle}</span>
                  </div>
                  <p style="margin-top: 20px; color: #666;">
                      Premium subscription payment has been successfully received and processed.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `,
  }),
};

module.exports = {
  createUserNotification,
  createAdminNotification,
  NotificationTemplates,
  AdminEmailTemplates,
};
