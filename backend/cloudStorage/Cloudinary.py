import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import dotenv
import os
from pathlib import Path



# ===> a django app nathi
# do not change any method


# dotenv.load_dotenv(os.getcwd )
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv.load_dotenv(BASE_DIR / '.env')


# Configuration       
cloudinary.config( 
    cloud_name = os.getenv("CLOUD_NAME"),
    api_key = os.getenv("CLOUD_API_KEY"), 
    api_secret = os.getenv("CLOUD_SECRET_KEY"),
    secure=True
)


def upload_image(image):
    result = cloudinary.uploader.upload(image,folder="profile_image")
    return result['secure_url']