# Razorpay Payment Integration

## Overview

Secure payment integration with Razorpay has been added to the checkout page. This allows customers to pay using multiple payment methods including UPI, Credit/Debit Cards, Net Banking, and Wallets.

## Changes Made

### 1. **index.html**

- Added Razorpay Checkout script to enable payment gateway functionality

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. **Environment Configuration (.env)**

- Added Razorpay Key ID configuration

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

**⚠️ Important:** Replace `your_razorpay_key_id_here` with your actual Razorpay Key ID from the Razorpay Dashboard.

### 3. **API Endpoints (backend.tsx)**

Added two new endpoints for payment processing:

- `CREATE_RAZORPAY_ORDER`: Creates a Razorpay order
- `VERIFY_RAZORPAY_PAYMENT`: Verifies payment signature after successful payment

### 4. **CheckoutPage.tsx**

Major updates to integrate Razorpay:

#### Added Features:

- **Razorpay Type Declarations**: Added TypeScript declarations for Razorpay window object
- **Shield Icon**: Added Shield icon from lucide-react for security badge
- **Enhanced handleCheckout Function**:
  - Creates Razorpay order via backend API
  - Opens Razorpay payment modal with pre-filled customer details
  - Handles payment success and verification
  - Handles payment cancellation
  - Navigates to orders page on successful payment

#### Security Features:

- **Secure Payment Badge**: Added a prominent badge highlighting Razorpay security
- **SSL Encryption Notice**: Displays security features to build customer trust
- **Payment Method Icons**: Shows supported payment methods (UPI, Cards, Net Banking, Wallets)

#### Payment Flow:

1. User clicks "Proceed to Payment" button
2. Backend creates a Razorpay order
3. Razorpay payment modal opens with:
   - Pre-filled customer name and phone
   - Order amount and details
   - Multiple payment options
4. After successful payment:
   - Payment signature is verified via backend
   - Order is confirmed
   - User is redirected to orders page

## Backend Requirements

Your backend needs to implement these two endpoints:

### 1. Create Razorpay Order

**Endpoint:** `POST /api/v1/payment/create-order`

**Request Body:**

```json
{
  "amount": 2500.0,
  "currency": "INR",
  "address_id": 123
}
```

**Response:**

```json
{
  "order_id": "order_8921223049xxx",
  "amount": 250000,
  "currency": "INR"
}
```

**Backend Implementation:**

- Use Razorpay SDK to create an order
- Amount should be in paise (multiply by 100)
- Store order details in database
- Return order_id to frontend

### 2. Verify Razorpay Payment

**Endpoint:** `POST /api/v1/payment/verify`

**Request Body:**

```json
{
  "razorpay_order_id": "order_8921223049xxx",
  "razorpay_payment_id": "pay_8921223049xxx",
  "razorpay_signature": "signature_string"
}
```

**Response:**

```json
{
  "status": "success",
  "order_id": 456
}
```

**Backend Implementation:**

- Verify signature using Razorpay SDK
- Update order status in database
- Clear user's cart
- Send order confirmation email
- Return success response

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate Test/Live API Keys
4. Copy the Key ID

### 2. Configure Frontend

1. Open `src/.env` file
2. Replace `your_razorpay_key_id_here` with your actual Razorpay Key ID
3. For testing, use Test Key ID
4. For production, use Live Key ID

### 3. Configure Backend

1. Install Razorpay SDK in your backend
   - Python: `pip install razorpay`
   - Node.js: `npm install razorpay`
2. Add Razorpay Key ID and Key Secret to backend environment variables
3. Implement the two required endpoints (create-order and verify)

### 4. Test Payment

1. Use Razorpay test credentials for testing
2. Test cards: 4111 1111 1111 1111 (any CVV, future expiry)
3. Test UPI: success@razorpay
4. Verify payment flow end-to-end

## Security Features

✅ **SSL Encryption**: All payment data is encrypted
✅ **Signature Verification**: Backend verifies payment authenticity
✅ **PCI DSS Compliant**: Razorpay handles sensitive card data
✅ **Secure Token**: Uses authentication token for API calls
✅ **No Card Storage**: Card details never touch your servers

## Payment Methods Supported

- 💳 **Credit/Debit Cards**: Visa, Mastercard, Amex, RuPay
- 📱 **UPI**: Google Pay, PhonePe, Paytm, BHIM
- 🏦 **Net Banking**: All major banks
- 👛 **Wallets**: Paytm, PhonePe, Amazon Pay, etc.
- 💰 **EMI**: Credit card EMI options

## UI/UX Enhancements

1. **Secure Payment Badge**: Prominent badge with Shield icon
2. **Payment Method Info**: Lists all supported payment methods
3. **Pre-filled Details**: Customer name and phone auto-filled
4. **Purple Theme**: Matches your site's luxury branding
5. **Error Handling**: Clear error messages for failed payments
6. **Success Feedback**: Toast notifications for payment status

## Testing Checklist

- [ ] Razorpay Key ID configured in .env
- [ ] Backend endpoints implemented
- [ ] Test payment with test card
- [ ] Test payment with test UPI
- [ ] Verify payment signature validation
- [ ] Check order creation after successful payment
- [ ] Test payment cancellation flow
- [ ] Verify cart clearing after payment
- [ ] Test with different payment methods
- [ ] Check mobile responsiveness

## Production Deployment

Before going live:

1. ✅ Replace Test Key ID with Live Key ID
2. ✅ Enable required payment methods in Razorpay Dashboard
3. ✅ Complete KYC verification on Razorpay
4. ✅ Set up webhook for payment notifications
5. ✅ Test with real payment (small amount)
6. ✅ Monitor payment logs and errors

## Support

For Razorpay integration issues:

- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For code issues:

- Check browser console for errors
- Verify API endpoints are working
- Check network tab for API responses
- Ensure Razorpay script is loaded
