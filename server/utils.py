import base64
from dotenv import load_dotenv
import os
import requests

load_dotenv()

SPOTIFY_CID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CS = os.getenv('SPOTIFY_CLIENT_SECRET')
SPOTIFY_RT = os.getenv('SPOTIFY_REFRESH_TOKEN')

TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"

def get_access_token(): 
    auth_header = f"{SPOTIFY_CID}:{SPOTIFY_CS}".encode("utf-8")
    auth_base64 = base64.b64encode(auth_header).decode("utf-8")

    headers = {
        "Authorization": f"Basic {auth_base64}",
        'Content-Type': "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "refresh_token",
        "refresh_token": SPOTIFY_RT
    }

    response = requests.post(TOKEN_ENDPOINT, headers=headers, data=data)
    response_json = response.json()

    if "access_token" in response_json:
        return response_json["access_token"]
    else:
        raise Exception("failed to get access token")
