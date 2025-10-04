import os
from fastapi import UploadFile
from app.core.config import settings
from urllib.parse import urlparse


def upload_file(file:UploadFile,folder:str,filename:str):
  save_dir = f"{settings.MEDIA_FOLDER}/{folder}"
  os.makedirs(save_dir,exist_ok=True)
  file_path = f"{save_dir}/{filename}.png"
  with open(file_path,"wb") as f:
    f.write(file.file.read())
  return file_path

def delete_file(url: str):
  parsed = urlparse(url)
  file_path = parsed.path.lstrip("/")
  if os.path.exists(file_path):
      os.remove(file_path)
      return True
  return False