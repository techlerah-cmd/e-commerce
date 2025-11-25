import secrets
from urllib.parse import quote_plus
import resend
from app.core.config import settings
from typing import List, Dict, Optional

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




def format_price(amount: float) -> str:
    """Simple formatter — adjust for localisation if needed."""
    return f"₹ {amount:,.2f}"

def send_order_confirmation_email(
    to_email: str,
    order_id: str,
    products: List[Dict],  # each dict: {"name": str, "quantity": int, "unit_price": float, "total_price": float}
    order_url: Optional[str] = None,
):
    """
    Sends an order confirmation email.

    Parameters
    - to_email: recipient email
    - order_id: your internal order identifier
    - products: list of product dicts with keys: name, quantity, unit_price, total_price
    - order_url: optional full URL to view order; if omitted, function will generate one from settings.FRONTEND_URL
    """
    if order_url is None:
        base = settings.FRONTEND_URL.rstrip("/")
        order_url = f"{base}/orders/{quote_plus(order_id)}"

    # compute totals (defensive: sum product total_price if provided, otherwise quantity * unit_price)
    order_total = 0.0
    for p in products:
        if "total_price" in p and p["total_price"] is not None:
            line_total = float(p["total_price"])
        else:
            line_total = float(p.get("quantity", 1)) * float(p.get("unit_price", 0.0))
        order_total += line_total

    # Build HTML rows for each product
    product_rows_html = ""
    for p in products:
        name = p.get("name", "Unknown product")
        qty = int(p.get("quantity", 1))
        unit = float(p.get("unit_price", 0.0))
        line_total = float(p.get("total_price", qty * unit))
        product_rows_html += f"""
        <tr>
          <td style="padding:8px; border:1px solid #e6e6e6;">{name}</td>
          <td style="padding:8px; border:1px solid #e6e6e6; text-align:center;">{qty}</td>
          <td style="padding:8px; border:1px solid #e6e6e6; text-align:right;">{format_price(unit)}</td>
          <td style="padding:8px; border:1px solid #e6e6e6; text-align:right;">{format_price(line_total)}</td>
        </tr>
        """

    html_body = f"""\
<!doctype html>
<html>
  <body style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
    <h2>Order confirmation — Order #{order_id}</h2>
    <p>Hi,</p>
    <p>Thank you for your order! Below is a summary of your purchase. You can view full details and track your order here:</p>

    <p style="margin: 18px 0;">
      <a href="{order_url}" target="_blank" rel="noopener noreferrer"
         style="display:inline-block; padding:12px 18px; border-radius:8px; text-decoration:none;
                font-weight:600; font-size:15px; background-color:#0b74ff; color:#ffffff;">
        View your order
      </a>
    </p>

    <table style="width:100%; border-collapse:collapse; max-width:720px;">
      <thead>
        <tr style="background:#f7f7f7;">
          <th style="padding:10px; border:1px solid #e6e6e6; text-align:left;">Product</th>
          <th style="padding:10px; border:1px solid #e6e6e6; text-align:center;">Qty</th>
          <th style="padding:10px; border:1px solid #e6e6e6; text-align:right;">Unit price</th>
          <th style="padding:10px; border:1px solid #e6e6e6; text-align:right;">Line total</th>
        </tr>
      </thead>
      <tbody>
        {product_rows_html}
        <tr>
          <td colspan="3" style="padding:10px; border:1px solid #e6e6e6; text-align:right; font-weight:700;">Order total</td>
          <td style="padding:10px; border:1px solid #e6e6e6; text-align:right; font-weight:700;">{format_price(order_total)}</td>
        </tr>
      </tbody>
    </table>

    <hr style="margin:20px 0;">
    <p style="font-size:13px; color:#666">If you have any questions, reply to this email or visit our support page.</p>
    <p style="font-size:12px; color:#999">This is an automated message — please do not reply directly if your support process uses a different channel.</p>
  </body>
</html>
"""

    # Plain text fallback
    text_lines = [
        f"Order confirmation — Order #{order_id}",
        "",
        "Items:",
    ]
    for p in products:
        name = p.get("name", "Unknown product")
        qty = int(p.get("quantity", 1))
        unit = float(p.get("unit_price", 0.0))
        line_total = float(p.get("total_price", qty * unit))
        text_lines.append(f"- {name}  x{qty}  @ {format_price(unit)}  = {format_price(line_total)}")
    text_lines.append("")
    text_lines.append(f"Order total: {format_price(order_total)}")
    text_lines.append("")
    text_lines.append(f"View your order: {order_url}")
    text_lines.append("")
    text_lines.append("If you have any questions, contact our support.")

    text_body = "\n".join(text_lines)

    params = {
        "from": settings.RESEND_FROM_ADDRESS,
        "to": [to_email],
        "subject": f"Your order #{order_id} — confirmation",
        "html": html_body,
        "text": text_body,
    }

    try:
        print(f"Sending order confirmation to {to_email} for order {order_id} -> {order_url}")
        resend.Emails.send(params)
        print("Order confirmation email sent successfully via Resend!")
        return True
    except Exception as e:
        print("Error sending order confirmation email with Resend:", e)
        return False