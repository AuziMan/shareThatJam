# Shared functions

# Formats an array of tracks, and returns the track, artist, and trackimg
import datetime
import json
from flask import jsonify, session
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


def format_track_search(data):
    track_info = [
        {
            "track": track["name"],
            "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
            "albumImg": track["album"]["images"][0]["url"] if track["album"]["images"] else "unknown image",
            "id": track["id"]
        }
        for track in data.get("tracks", [])
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


def format_playlist_tracks(tracks_data):
    playlist_info = [
        {
            "track": track["track"]["name"],
            "artist": track["track"]["artists"][0]["name"] if track["track"]["artists"] else "Unknown Artist",
            "albumImg": track["track"]["album"]["images"][0]["url"] if track["track"]["album"]["images"] else "unknown image",
            "id": track["track"]["id"]
        }
        for track in tracks_data.get("items", [])
    ]

    return playlist_info

# def format_response_array(data):
#     print(data["items"][:1])
#     track_info = [
#         {
#             "track": track["name"],
#             "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
#             "albumImg": track["album"]["images"][0]["url"] if track["album"]["images"] else "unknown image",
#             "id": track["id"]
#         }
#         for track in data.get("items", [])
#     ]
#     return track_info


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
    


def format_user_recc_seeds():
    try:
        if not session.get('access_token'):
            return None

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return None

        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(SPOTIFY_TOP_TRACKS_ENDPOINT, headers=headers)

        if response.status_code == 200:
            data = response.json()
            # Print the first 5 objects to inspect structure
            if isinstance(data, dict) and "items" in data:
                top_tracks = data["items"][:4]  

                track_ids = [track["id"] for track in top_tracks]
                print(track_ids)

                return {"seed_tracks": track_ids}
            else:
                return jsonify({"error": "failed to fetch seed data"}), 500
        else:
            return jsonify({"error": "failed to fetch top tracks for seed data"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def search_tracks_by_id(seeds):
    try:
        print("in search by id")
        if not session.get('access_token'):
            return None

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return None

        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        if seeds:
            request = f"{SPOTIFY_URL_USER_SEARCH}/tracks?ids={seeds}"
            print(request)

            response = requests.get(request, headers=headers)
            if response.status_code == 200:
                data = response.json()
                print("Reccomended Tracks Found")
                return data
            else:
                return jsonify({"error": f"Failed to fetch top tracks: {response.status_code}"}), response.status_code
        else:
            return jsonify({"error": "Invalid seed data"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500