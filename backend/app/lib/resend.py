import secrets
from urllib.parse import quote_plus
import resend
from app.core.config import settings

# configure
resend.api_key = settings.RESEND_API_KEY

def send_reset_link(to_email: str, token: str):
    """
    Sends a password reset email with a CTA button linking to:
      {FRONTEND_URL}/forgot-password?token={token}
    """
    frontend_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={quote_plus(token)}"
    try:
        html_body = f"""\
<!doctype html>
<html>
  <body>
    <p>Hi,</p>
    <p>You (or someone using this email) requested a password reset for your Lerah account.
       Click the button below to reset your password. This link will expire soon.</p>

    <p style="text-align:center; margin: 24px 0;">
      <a href="{frontend_url}" target="_blank" rel="noopener noreferrer"
         style="display:inline-block; padding:14px 22px; border-radius:8px; text-decoration:none;
                font-weight:600; font-size:16px; background-color:#0b74ff; color:#ffffff;">
        Reset your password
      </a>
    </p>

    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
    <p><a href="{frontend_url}" target="_blank" rel="noopener noreferrer">{frontend_url}</a></p>

    <hr>
    <p style="font-size:12px; color:#666">If you did not request a password reset, you can safely ignore this email.</p>
  </body>
</html>
"""

        # Plain text fallback
        text_body = f"""
Hi,

You requested a password reset for your Lerah account.
Open this link to reset your password (expires soon):

{frontend_url}

If you did not request this, ignore this email.
"""

        params = {
            "from": settings.RESEND_FROM_ADDRESS,
            "to": [to_email],
            "subject": "Reset your Lerah password",
            "html": html_body,
            "text": text_body
        }
        print(frontend_url)
        resend.Emails.send(params)
        print("Password reset email sent successfully via Resend!")
    except Exception as e:
        print("Error sending password reset email with Resend:", e)
