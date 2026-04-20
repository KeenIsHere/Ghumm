# 📧 Email Migration: Mailtrap → Brevo

## Step-by-Step Setup Guide

### 🎯 What is Brevo?
Brevo (formerly Sendinblue) is an email marketing & transactional email platform that allows you to send emails directly to users' Gmail accounts and other email providers.

---

## 📋 Prerequisites

**Current Setup (Mailtrap)**:
```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=c3a953a2e8b3af
SMTP_PASS=4c629155030855
```

**New Setup (Brevo)**:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@gmail.com
SMTP_PASS=your-brevo-api-key
```

---

## 🚀 Step 1: Create Brevo Account

1. Go to **https://www.brevo.com/**
2. Click **"Sign Up"** → Choose **Free Plan** (or paid if needed)
3. Enter your email (can be your personal Gmail or business email)
4. Complete email verification
5. Create account with company info

---

## 🔑 Step 2: Get SMTP Credentials from Brevo

### Option A: Using API Key (Recommended)
1. Login to Brevo dashboard
2. Go to **Settings** → **SMTP & API**
3. Scroll down to **SMTP Configuration**
4. You'll see:
   ```
   Host: smtp-relay.brevo.com
   Port: 587
   Username: (usually your Brevo login email)
   Password: (Generate SMTP key)
   ```
5. Click **"Create SMTP Key"** if not existing
6. Copy the **SMTP username** and **SMTP password**

### Option B: Using Email (Alternative)
1. Go to **Settings** → **Users & Access**
2. Add your Gmail account as sender
3. Verify the Gmail address
4. Use your Gmail address as SMTP user

---

## 🔐 Step 3: Verify Sender Email in Brevo

**Important**: The email you use as `from` must be verified in Brevo!

1. Go to **Senders** → **Email Addresses**
2. Add your sender email (e.g., noreply@ghummghamm.com OR your Gmail)
3. Click verification link in email
4. Once verified, use it as sender

**Example**:
```
From: "GhummGhamm" <noreply@ghummghamm.com>
To: user@gmail.com
```

---

## 🛠️ Step 4: Update Configuration Files

### Update `.env` file
```bash
# OLD (Mailtrap)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=c3a953a2e8b3af
SMTP_PASS=4c629155030855

# NEW (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@gmail.com
SMTP_PASS=your-brevo-smtp-key
SENDER_EMAIL=noreply@ghummghamm.com
```

### Update `server/config/mailer.js`
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // smtp-relay.brevo.com
  port: process.env.SMTP_PORT,        // 587
  secure: false,
  auth: {
    user: process.env.SMTP_USER,      // Brevo email
    pass: process.env.SMTP_PASS,      // SMTP key
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"GhummGhamm" <${process.env.SENDER_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
```

---

## ✅ Step 5: Test Email Sending

### Create test file: `test-email.js`
```javascript
const sendEmail = require('./config/mailer');

// Test email
sendEmail(
  'your-gmail@gmail.com',
  'Test Email from GhummGhamm',
  `<h1>Hello!</h1><p>This is a test email from Brevo.</p>`
)
.then(() => console.log('✅ Email sent successfully!'))
.catch(err => console.error('❌ Error:', err));
```

### Run test:
```bash
node test-email.js
```

### Expected Result:
- ✅ Email arrives in Gmail inbox (NOT spam folder if domain verified)
- Subject: "Test Email from GhummGhamm"
- Sender: "GhummGhamm" with your verified email

---

## 📊 What Gets Sent to Users

### Email Verification OTP
```
Subject: Verify Your Email - GhummGhamm
From: GhummGhamm <noreply@ghummghamm.com>
To: user@gmail.com

Body:
Your OTP: 123456
Expires in: 24 hours
```

### Payment Confirmation
```
Subject: Payment Confirmation - GhummGhamm
From: GhummGhamm <noreply@ghummghamm.com>
To: user@gmail.com

Body:
Thank you for your booking!
Amount: Rs. 2,500
Reference: GGTT-123456
```

### Premium Subscription
```
Subject: Welcome to Premium - GhummGhamm
From: GhummGhamm <noreply@ghummghamm.com>
To: user@gmail.com

Body:
Your premium subscription is active!
Tier: Silver
Expires: 2026-05-20
Discount: 15%
```

---

## 🎯 Brevo Features (Free Plan)

| Feature | Free Plan | Limits |
|---------|-----------|--------|
| Monthly Emails | Unlimited | Send to 300 contacts/month |
| API Access | ✅ Yes | Same limits |
| Transactional | ✅ Yes | Unlimited after first 300 |
| Support | Email | Basic |
| Price | FREE | $0/month |

---

## 🔧 Complete Configuration Checklist

- [ ] Create Brevo account (https://www.brevo.com)
- [ ] Get SMTP credentials from Brevo
- [ ] Verify sender email in Brevo (Settings → Senders)
- [ ] Update `.env` file with Brevo details
- [ ] Update `server/config/mailer.js`
- [ ] Test email sending with test script
- [ ] Verify email arrives in Gmail inbox
- [ ] Delete test script
- [ ] Restart server: `npm run dev`

---

## 📝 Your Configuration Template

**Copy and update this in your `.env`**:

```bash
# === BREVO EMAIL CONFIGURATION ===
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASS=xsmtpXXXXXXXXXXXXXXXXXXXXXXX
SENDER_EMAIL=noreply@ghummghamm.com

# Replace with:
# SMTP_USER = Your Brevo login email or generated SMTP user
# SMTP_PASS = Your SMTP password from Brevo Settings
# SENDER_EMAIL = Your verified sender email in Brevo
```

---

## 🚨 Troubleshooting

### Issue: "Authentication failed"
**Solution**: Double-check SMTP user and password in Brevo settings

### Issue: "Email goes to spam"
**Solution**: 
1. Verify domain in Brevo (Settings → Domains)
2. Add SPF & DKIM records to DNS
3. Use verified sender email

### Issue: "Email not received"
**Solution**:
1. Check Brevo dashboard → Logs for bounced emails
2. Verify recipient email is correct
3. Check spam folder
4. Verify sender email is registered in Brevo

### Issue: "530 Unauthorized"
**Solution**: 
1. Ensure port is 587 (not 465)
2. Check `secure: false` in transporter
3. Verify SMTP credentials are correct

---

## 🎛️ Advanced: Domain Verification

For professional emails (noreply@yourdomain.com):

1. In Brevo: **Settings** → **Domains**
2. Add your domain
3. Add SPF record to your DNS:
   ```
   v=spf1 include:mail.brevo.com ~all
   ```
4. Add DKIM record (provided by Brevo)
5. Wait for verification (usually 5-30 minutes)

---

## 📚 Environment Variables Summary

**Before (Mailtrap)**:
```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=c3a953a2e8b3af
SMTP_PASS=4c629155030855
```

**After (Brevo)**:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xsmtpXXXXXXXXXXXXXXXXXXXXXX
SENDER_EMAIL=noreply@ghummghamm.com
```

---

## ✨ Benefits of Brevo

✅ **Free transactional emails** (unlimited after 300/month)  
✅ **High deliverability** to Gmail, Outlook, etc.  
✅ **Email templates** available in dashboard  
✅ **Campaign analytics** - see open rates, clicks  
✅ **Webhook support** - track email events  
✅ **No credit card** needed for free plan  

---

## 📞 Next Steps

1. **Create Brevo account** - Takes 5 minutes
2. **Get SMTP credentials** - Copy from settings
3. **Update .env file** - Replace Mailtrap values
4. **Update mailer.js** - Add SENDER_EMAIL
5. **Test sending** - Run test-email.js
6. **Restart server** - `npm run dev`
7. **Test full flow** - Register user → OTP email arrives ✅

---

**Ready?** Let me help you implement this! 🚀
