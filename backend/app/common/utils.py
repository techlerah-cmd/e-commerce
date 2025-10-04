import random
from sqlalchemy.orm import Session
def generate_otp() -> str:
  """Generate a 6-digit OTP as a string."""
  return f"{random.randint(100000, 999999)}"



def upload_file(file,folder,filename):
  pass

def delete_file(url):
  pass