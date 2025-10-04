import random
import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_otp_email(to_email: str, otp: str):
  try:
    params = {
      "from": settings.RESEND_FROM_ADDRESS,
      "to": [to_email],
      "subject": "Your OTP Code",
      "html": f"""
        <h3>Your OTP Code</h3>
        <p>Use the following One-Time Password (OTP) to continue:</p>
        <div style="
          font-size: 2em;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 20px 0;
        ">{otp}</div>
        <p>This code will expire soon. If you did not request this, please ignore this email.</p>
      """
    }

    resend.Emails.send(params)
    print("OTP email sent successfully via Resend!")
  except Exception as e:
    print("Error sending OTP email with Resend:", e)
