# Shared functions

# Formats an array of tracks, and returns the track, artist, and trackimg
import datetime
import json
from flask import session
import requests


BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"
SPOTIFY_URL_USER_SEARCH = "https://api.spotify.com/v1"

SPOTIFY_TOP_TRACKS_ENDPOINT = f"{BASE_SPOTIFY_URL}/top/tracks"




def format_response_array(data):
    track_info = [
        {
            "track": track["name"],
            "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
            "albumImg": track["album"]["images"][0]["url"] if track["album"]["images"] else "unknown image",
            "id": track["id"]
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
    

# def format_user_recc_seeds():
#     try:
#         if not session.get('access_token'):
#             return None

#         if datetime.datetime.now().timestamp() > session['expires_at']:
#             return None

#         headers = {
#             'Authorization': f"Bearer {session['access_token']}"
#         }

#         response = requests.get(SPOTIFY_TOP_TRACKS_ENDPOINT, headers=headers)

#         if response.status_code == 200:
#             data = response.json()
#             # Print the first 5 objects to inspect structure
#             if isinstance(data, dict) and "items" in data:
#                 top_tracks = data["items"][:4]  

#                 track_ids = [track["id"] for track in top_tracks]
#                 artist_ids = [track["artists"][0]["id"] for track in top_tracks if track.get("artists")]

#                 # Fetch genres for the first 2 artists (Spotify only allows up to 5 seeds in total)
#                 genre_list = []
#                 for artist_id in artist_ids[:4]:  # Limit to 2 artists for genre diversity
#                     artist_response = requests.get(f"{SPOTIFY_URL_USER_SEARCH}/artists/{artist_id}", headers=headers)
#                     if artist_response.status_code == 200:
#                         artist_data = artist_response.json()
#                         genre_list.extend(artist_data.get("genres", []))
                
#                 # Limit genres to 2 (Spotify API allows max 5 seeds total)
#                 genre_list = list(set(genre_list))[:4]

#                 return {
#                     "seed_tracks": track_ids[:4],  # Max 2 tracks
#                     "seed_artists": artist_ids[:4],  # Max 2 artists
#                     "seed_genres": genre_list  # Max 2 genres
#                 }

#             else:
#                 print("test")  # Print full response if unexpected structure
            
#             return data
#         else:
#             return None
#     except Exception as e:
#         return None