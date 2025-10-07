from fastapi import APIRouter,Depends,HTTPException,BackgroundTasks
from app.app_users.schemas import *
from app.core.deps import get_current_user,get_db
from app.core.security import create_access_token
from sqlalchemy.orm import Session
import app.app_users.crud as crud_auth 
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings
from app.common.utils import generate_otp
from app.lib.resend import send_reset_link
from app.app_users.models import User
import resend
from fastapi_limiter.depends import RateLimiter
from datetime import timedelta
from app.core.security import create_access_token,decode_token
app = APIRouter()


@app.get('/verify-me',response_model=UserResponse)
def verify_me(user = Depends(get_current_user)):
  return user

@app.post('/login',response_model=LoginResponse,dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def login(data:LoginRequest,db:Session=Depends(get_db)):
  user = crud_auth.get_user_by_email(db,data.email)
  if not user or not crud_auth.verify_password(data.password,user.password):
    raise HTTPException(detail="Invalid Email or password",status_code=400)
  token = create_access_token({'sub':data.email})
  return { 'user':user,'token':token }

@app.post('/google-login',dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def google_login(data:GoogleLoginRequest,db:Session=Depends(get_db)):
  idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
  user_email = idinfo["email"]
  user_full_name = idinfo.get("name")  
  user = crud_auth.get_user_by_email(db,user_email)
  # Create user if not exists
  if not user:
    user = crud_auth.create_user(db,user_email)
    crud_auth.update_user_data(db,user,{'full_name':user_full_name})
  token = create_access_token(data={'sub':user_email})
  return {'token':token,'user':user} 

@app.post('/forgot-password',response_model=ForgotPasswordResponse,dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def forgot_password(data:ForgotPassword,background_tasks: BackgroundTasks,db:Session=Depends(get_db)):
  """
  Used to sent new otp and also resend otp
  """
  email = data.email
  user:User = crud_auth.get_user_by_email(db,email)
  if not user:
    raise HTTPException(status_code=404,detail="User not found")
  token = create_access_token({'sub':user.email},expires_delta=timedelta(minutes=30))
  background_tasks.add_task(send_reset_link,email,token)
  return {'token':token}
  

@app.post('/reset-password',dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def reset_password(data:ForgotPasswordPasswordReset,db:Session=Depends(get_db)):
  email = decode_token(data.token)
  if not email:
    raise HTTPException(detail='Token is expired or Invalid',status_code=400)
  user = crud_auth.get_user_by_email(db,email)
  if not user:
    raise HTTPException(detail="User Not Found",status_code=404)
  # update password
  print('password ->',data.password)
  crud_auth.update_user_password(db,user,data.password)
  return {'detail':"Password updated"} 

@app.post('/address',response_model=AddressResponse,dependencies=[Depends(RateLimiter(times=20, seconds=60))])
def create_address(data:AddressCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
  # check user hae address 
  if not user.address:
    # create new address
    db_address  = crud_auth.create_address(db,data,user)
  else:
    # update it
    db_address = crud_auth.update_address(db,data,user.address)
  return db_address

@app.put('/address',response_model=AddressResponse,dependencies=[Depends(RateLimiter(times=20, seconds=60))])
def update_address(data:AddressCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
  # check user hae address 
  if not user.address:
    # create new address
    db_address  = crud_auth.create_address(db,data,user)
  else:
    # update it
    db_address = crud_auth.update_address(db,data,user.address)
  return db_address

@app.get('/address',response_model=Optional[AddressResponse],dependencies=[Depends(RateLimiter(times=20, seconds=60))])
def get_address(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
  return user.address


@app.post('/contact-us',dependencies=[Depends(RateLimiter(times=10, seconds=60))])
def send_user_enquiry(data:ContactUs,db:Session=Depends(get_db)):
  html_content = f"""
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Inquiry</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                  📧 New Contact Inquiry
                </h1>
                <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                  You have received a new message from your website
                </p>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                
                <!-- Subject Badge -->
                <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
                  <p style="margin: 0; color: #667eea; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                  <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                    {data.subject}
                  </p>
                </div>
                
                <!-- Contact Information -->
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 30px; vertical-align: top;">
                            <span style="font-size: 18px;">👤</span>
                          </td>
                          <td>
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 500;">Full Name</p>
                            <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                              {data.first_name} {data.last_name}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 30px; vertical-align: top;">
                            <span style="font-size: 18px;">📧</span>
                          </td>
                          <td>
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 500;">Email Address</p>
                            <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                              <a href="mailto:{data.email}" style="color: #667eea; text-decoration: none;">
                                {data.email}
                              </a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 30px; vertical-align: top;">
                            <span style="font-size: 18px;">📱</span>
                          </td>
                          <td>
                            <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 500;">Phone Number</p>
                            <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                              <a href="tel:{data.phone}" style="color: #667eea; text-decoration: none;">
                                {data.phone}
                              </a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <!-- Message -->
                <div style="margin-top: 30px;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    💬 Message
                  </p>
                  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; line-height: 1.6;">
                    <p style="margin: 0; color: #374151; font-size: 15px; white-space: pre-wrap;">
{data.message}
                    </p>
                  </div>
                </div>
                
                <!-- Action Button -->
                <div style="text-align: center; margin-top: 35px;">
                  <a href="mailto:{data.email}?subject=Re: {data.subject}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                    Reply to {data.first_name}
                  </a>
                </div>
                
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                  This email was sent from your website's contact form.<br>
                  <strong style="color: #374151;">Lerah Royal E-commerce</strong>
                </p>
                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                  © 2024 Lerah Royal. All rights reserved.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  """
  return {'detail':'Message Sent Successfully'}

  resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": data.email,
    "subject": f"New Contact Inquiry: {data.subject}",
    "html": html_content 
  })
  return {"detail": "Your message has been sent successfully. We'll get back to you soon!"}






