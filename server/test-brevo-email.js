const { sendEmail, otpTemplate, paymentTemplate, premiumTemplate } = require('./config/mailer');
require('dotenv').config({ path: '.env' });

console.log('🧪 Testing SendGrid Email Configuration...\n');

// Debug: Log environment variables
console.log('📋 DEBUG Environment Variables:');
console.log(`   SMTP_HOST value: "${process.env.SMTP_HOST}"`);
console.log(`   SMTP_HOST type: ${typeof process.env.SMTP_HOST}`);
console.log(`   SMTP_HOST length: ${(process.env.SMTP_HOST || '').length}`);
console.log();

// Test 1: OTP Verification Email
const testOTPEmail = async () => {
  try {
    console.log('📧 Test 1: Sending OTP Verification Email...');
    const otp = '123456';
    const userName = 'Test User';
    const htmlContent = otpTemplate(otp, userName);
    
    await sendEmail(
      'kiss.miss3669.photo@gmail.com',
      '🔐 Verify Your Email - GhummGhamm',
      htmlContent
    );
    console.log('✅ OTP Email sent successfully!\n');
  } catch (error) {
    console.error('❌ OTP Email failed:', error.message, '\n');
  }
};

// Test 2: Payment Confirmation Email
const testPaymentEmail = async () => {
  try {
    console.log('📧 Test 2: Sending Payment Confirmation Email...');
    const bookingDetails = {
      userName: 'Test User',
      packageName: 'Nepal Adventure Trek',
      travelDate: 'May 15, 2026',
      travelers: 2,
      bookingRef: 'GGTT-12345-98765',
      amount: '2,500'
    };
    const htmlContent = paymentTemplate(bookingDetails);
    
    await sendEmail(
      'kiss.miss3669.photo@gmail.com',
      '✓ Booking Confirmed - GhummGhamm',
      htmlContent
    );
    console.log('✅ Payment Email sent successfully!\n');
  } catch (error) {
    console.error('❌ Payment Email failed:', error.message, '\n');
  }
};

// Test 3: Premium Subscription Email
const testPremiumEmail = async () => {
  try {
    console.log('📧 Test 3: Sending Premium Subscription Email...');
    const premiumDetails = {
      userName: 'Test User',
      tier: 'gold',
      billingCycle: 'monthly',
      expiryDate: 'May 20, 2026',
      discount: 20
    };
    const htmlContent = premiumTemplate(premiumDetails);
    
    await sendEmail(
      'kiss.miss3669.photo@gmail.com',
      '👑 Welcome to Premium! - GhummGhamm',
      htmlContent
    );
    console.log('✅ Premium Email sent successfully!\n');
  } catch (error) {
    console.error('❌ Premium Email failed:', error.message, '\n');
  }
};

// Run all tests
const runTests = async () => {
  console.log('═══════════════════════════════════════════════');
  console.log('  SENDGRID EMAIL CONFIGURATION TEST');
  console.log('═══════════════════════════════════════════════\n');
  
  console.log('📋 Configuration:');
  console.log(`   SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP User: ${process.env.SMTP_USER}`);
  console.log(`   Sender Email: ${process.env.SENDER_EMAIL}`);
  console.log(`   Sender Name: ${process.env.SENDER_NAME}\n`);
  
  await testOTPEmail();
  await testPaymentEmail();
  await testPremiumEmail();
  
  console.log('═══════════════════════════════════════════════');
  console.log('✅ All tests completed!');
  console.log('📧 Check your Gmail inbox for test emails');
  console.log('═══════════════════════════════════════════════\n');
};

runTests().catch(error => {
  console.error('❌ Test Error:', error);
  process.exit(1);
});
