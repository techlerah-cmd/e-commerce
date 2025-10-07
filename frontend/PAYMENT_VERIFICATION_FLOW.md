# Payment Verification Flow Documentation

## Overview

This document explains the complete payment verification flow after a customer completes payment through Razorpay.

## Flow Diagram

```
User clicks "Proceed to Payment"
         ↓
Backend creates Razorpay order
         ↓
Razorpay modal opens
         ↓
User completes payment
         ↓
Redirect to Payment Verification Page
         ↓
Auto-verify every 10 seconds (3 min timeout)
         ↓
    ┌────────────┴────────────┐
    ↓                         ↓
SUCCESS                   FAILED/TIMEOUT
    ↓                         ↓
Thank You Screen      Failed Screen with Support Info
```

## Payment Verification Page Features

### 1. **Automatic Verification**

- Polls backend every **10 seconds** to check payment status
- Continues for **3 minutes** (180 seconds)
- Shows real-time countdown timer

### 2. **Three Possible States**

#### A. Verifying State (Initial)

**Features:**

- ⏳ Animated loading spinner with clock icon
- ⏱️ Countdown timer (3:00 → 0:00)
- 📊 Progress bar showing time remaining
- 🔢 Transaction ID display with copy button
- 📈 Attempt counter showing verification attempts
- ℹ️ Info message to keep user informed

**UI Elements:**

```
- Animated loader (spinning)
- "Verifying Payment" heading
- Countdown: 2:45 (with progress bar)
- Transaction ID: pay_xxxxx (with copy button)
- Verification attempt: 3
- Info: "Don't close this page"
```

#### B. Success State

**Features:**

- ✅ Green success icon with animation
- 🎉 "Thank You for Your Order!" message
- 📦 Order ID and Transaction ID display
- 📧 Email confirmation notice
- 🔘 Action buttons:
  - "View My Orders" (primary)
  - "Continue Shopping" (secondary)

**Triggers:**

- Backend returns status code **200**
- Payment verified successfully

#### C. Failed/Timeout State

**Features:**

- ❌ Red error icon
- ⚠️ Clear error message
- 📋 Transaction ID with copy button
- 💡 Important notice for successful payments
- 🔘 Action buttons:
  - "Retry Verification" (primary)
  - "Contact Support" (secondary)
  - "Back to Cart" (tertiary)
- 📞 Support contact information

**Triggers:**

- Timer reaches 0:00 (timeout)
- Backend returns non-200 status
- Verification fails after multiple attempts

## Technical Implementation

### Route Configuration

**Path:** `/checkout/payment-verification`

**Protected:** Yes (requires authentication)

**State Required:**

```typescript
{
  transaction_id: string; // Required
}
```

### API Integration

#### Verification Endpoint

**Endpoint:** `POST /api/v1/payment/verify`

**Request:**

```json
{
  "transaction_id": "pay_8921223049xxx"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "order_id": "ORD123456",
  "message": "Payment verified successfully"
}
```

**Failed Response (400/404):**

```json
{
  "status": "failed",
  "message": "Payment verification failed"
}
```

### Verification Logic

```typescript
// Verification runs every 10 seconds
const verifyPayment = async () => {
  const response = await makeApiCall(
    "POST",
    API_ENDPOINT.VERIFY_RAZORPAY_PAYMENT,
    { transaction_id: transactionId },
    "application/json",
    authToken,
    "verifyPayment"
  );

  if (response.status === 200) {
    setVerificationStatus("success");
    // Show success screen
  }
};

// Initial verification + polling every 10s
verifyPayment();
setInterval(verifyPayment, 10000);
```

### Timer Logic

```typescript
// 3-minute countdown (180 seconds)
const [timeRemaining, setTimeRemaining] = useState(180);

// Countdown every second
setInterval(() => {
  setTimeRemaining((prev) => {
    if (prev <= 1) {
      setVerificationStatus("timeout");
      return 0;
    }
    return prev - 1;
  });
}, 1000);

// Format: "2:45"
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
```

## User Experience Flow

### Happy Path (Success)

1. User completes payment on Razorpay
2. Redirected to verification page
3. See "Verifying Payment" with countdown
4. Backend confirms payment (usually within 5-10 seconds)
5. Success screen appears
6. User can view orders or continue shopping

### Delayed Verification Path

1. User completes payment on Razorpay
2. Redirected to verification page
3. See countdown timer and verification attempts
4. Multiple verification attempts (every 10s)
5. Eventually succeeds within 3 minutes
6. Success screen appears

### Failed/Timeout Path

1. User completes payment on Razorpay
2. Redirected to verification page
3. Verification attempts fail or timeout
4. Failed screen appears with:
   - Transaction ID for reference
   - Option to retry verification
   - Support contact information
   - Clear instructions for next steps

## Backend Requirements

### 1. Create Order Endpoint

**Endpoint:** `POST /api/v1/order/place-order/payment-request`

**Response must include:**

```json
{
  "key": "rzp_test_xxxxx",
  "amount": 2500,
  "currency": "INR",
  "razorpay_order_id": "order_xxxxx",
  "transaction_id": "TXN_xxxxx" // Important: Used for verification
}
```

### 2. Verify Payment Endpoint

**Endpoint:** `POST /api/v1/payment/verify`

**Request:**

```json
{
  "transaction_id": "TXN_xxxxx"
}
```

**Backend Logic:**

1. Find transaction by transaction_id
2. Check if payment is completed
3. Verify Razorpay signature (if not already verified)
4. Update order status
5. Clear user's cart
6. Send confirmation email
7. Return success response

**Important:** This endpoint should be **idempotent** (safe to call multiple times)

## Security Considerations

### 1. Transaction ID Validation

- Verify transaction belongs to authenticated user
- Check transaction hasn't been verified already
- Prevent replay attacks

### 2. Rate Limiting

- Limit verification attempts per transaction
- Prevent abuse of verification endpoint

### 3. Timeout Handling

- 3-minute timeout prevents infinite polling
- User can manually retry if needed

### 4. State Protection

- Route requires authentication
- Redirects to cart if no transaction_id
- Validates state before processing

## Error Handling

### No Transaction ID

```typescript
if (!state || !state.transaction_id) {
  toast.error("No transaction found");
  navigate("/cart");
}
```

### Verification Timeout

```typescript
if (timeRemaining <= 0) {
  setVerificationStatus("timeout");
  // Show failed screen with retry option
}
```

### Network Errors

```typescript
try {
  await verifyPayment();
} catch (error) {
  console.error("Verification error:", error);
  setAttemptCount((prev) => prev + 1);
  // Continue polling until timeout
}
```

## UI/UX Best Practices

### 1. **Keep User Informed**

- Show countdown timer
- Display verification attempts
- Provide clear status messages

### 2. **Prevent User Actions**

- Warn not to close the page
- Disable back button during verification
- Show loading states

### 3. **Provide Options**

- Retry verification button
- Contact support link
- Copy transaction ID easily

### 4. **Visual Feedback**

- Animated loaders
- Progress bars
- Color-coded states (green=success, red=failed)

## Testing Checklist

- [ ] Payment completes and redirects to verification page
- [ ] Countdown timer works correctly (3:00 → 0:00)
- [ ] Verification polling happens every 10 seconds
- [ ] Success screen appears when backend returns 200
- [ ] Failed screen appears on timeout
- [ ] Transaction ID can be copied
- [ ] Retry verification button works
- [ ] Navigation to orders page works
- [ ] Navigation to cart works if no transaction_id
- [ ] Support contact information is correct
- [ ] Mobile responsive design
- [ ] Loading states are visible
- [ ] Error messages are clear

## Configuration

### Timing Settings

```typescript
const VERIFICATION_INTERVAL = 10000; // 10 seconds
const VERIFICATION_TIMEOUT = 180; // 3 minutes (180 seconds)
```

### Customization

You can adjust these values in `PaymentVerification.tsx`:

- Change polling interval (default: 10 seconds)
- Change timeout duration (default: 3 minutes)
- Customize success/failed messages
- Update support contact information

## Support Information

Update the support contact in the failed screen:

```typescript
<p>Need help? Email us at support@lerahsaree.com</p>
<p>or call +91-8921223049</p>
```

Replace with your actual support email and phone number.

## Integration with Checkout

### CheckoutPage.tsx Changes

```typescript
handler: function (response: any) {
  toast.success("Payment completed! Verifying...");
  navigate("/checkout/payment-verification", {
    state: {
      transaction_id: transactionData.transaction_id || response.razorpay_payment_id,
    },
  });
}
```

### Backend Response Format

Ensure your backend returns `transaction_id` in the order creation response:

```json
{
  "transaction_id": "TXN_12345", // This is passed to verification page
  "razorpay_order_id": "order_xxxxx",
  "amount": 2500,
  "currency": "INR",
  "key": "rzp_test_xxxxx"
}
```

## Troubleshooting

### Issue: Verification never succeeds

**Solution:** Check backend verification endpoint is working and returning 200 status

### Issue: Timer doesn't countdown

**Solution:** Check useEffect dependencies and interval cleanup

### Issue: Redirects to cart immediately

**Solution:** Ensure transaction_id is passed in navigation state

### Issue: Multiple verification calls

**Solution:** Check interval cleanup in useEffect return function

### Issue: Success screen doesn't show order ID

**Solution:** Ensure backend returns order_id in verification response

## Future Enhancements

1. **Webhook Integration**: Use Razorpay webhooks for instant verification
2. **Push Notifications**: Notify user when payment is verified
3. **Email Verification**: Send verification link via email
4. **SMS Alerts**: Send order confirmation via SMS
5. **Order Tracking**: Add real-time order tracking link
6. **Payment Receipt**: Generate and download payment receipt

## Conclusion

This payment verification flow provides a robust, user-friendly experience for confirming payments after Razorpay checkout. The automatic polling, countdown timer, and clear status messages keep users informed throughout the process, while the retry and support options handle edge cases gracefully.
