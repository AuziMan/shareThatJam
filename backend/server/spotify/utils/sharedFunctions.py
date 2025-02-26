# Shared functions

# Formats an array of tracks, and returns the track, artist, and trackimg
import datetime
from flask import session
import requests


BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"



def format_response_array(data):
    track_info = [
        {
            "track": track["name"],
            "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
            "albumImg": track["album"]["images"][0]["url"] if track["album"]["images"] else "unknown image"
            # "trackimg": track["album"]["images"][0]["url"] if track["images"] else "unknown image"
        }
        for track in data.get("items", [])
    ]
    return track_info


# Formats an object of track, and returns the track and artist

def format_response_obj(data):
    track_info = [
        {
            "track": data["item"]["name"],
            "artist": data["item"]["artists"][0]["name"] if data["item"]["artists"] else "Unknown Artist",
            "albumImg": data["item"]["album"]["images"][0]["url"] if data["item"]["album"]["images"] else "unknown image"
        }
    ]
    return track_info


def format_playlist_tracks(data):
    playlist_info = [
        {
            "tracks": [data["track"]["name"] for data in data.get("items", [])],
            "playlist_name": [data["name"]]
        }
    ]

    return playlist_info


def get_user_info_from_spotify():
    """ Helper function to fetch user info from Spotify. """
    try:
        if not session.get('access_token'):
            return None

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return None

        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(BASE_SPOTIFY_URL, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        return None
