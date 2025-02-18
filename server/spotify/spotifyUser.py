
from flask import Flask, jsonify, request, Blueprint
from dotenv import load_dotenv
import requests
from server.utils import get_access_token
import json

user_blueprint = Blueprint("user", __name__)

BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"
SPOTIFY_TOP_TRACKS_ENDPOINT = f"{BASE_SPOTIFY_URL}/top/tracks"
SPOTIFY_NOW_PLAYING_ENDPOINT = f"{BASE_SPOTIFY_URL}/player/currently-playing"
SPOTIFY_URL_USER_SEARCH = "https://api.spotify.com/v1"



@user_blueprint.route('/topTracks', methods=['GET'])
def get_top_tracks():
    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(SPOTIFY_TOP_TRACKS_ENDPOINT, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch top tracks: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@user_blueprint.route('/nowPlaying', methods=['GET'])
def get_now_playing():
    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(SPOTIFY_NOW_PLAYING_ENDPOINT, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_blueprint.route('/info', methods=['GET'])
def get_user_info():
    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(BASE_SPOTIFY_URL, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@user_blueprint.route('/album/<string:userId>', methods=['GET'])
def get_user_playlists(userId):
    try:
        namesOnly = request.args.get('namesOnly', 'false').lower() == 'true'

        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists?limit=100"
        print(endpoint)
        
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            data = response.json()
            if namesOnly:
                album_names = [playlist["name"] for playlist in data.get("items", [])]
                return jsonify({"albums": album_names})
            else:
                return jsonify(data)
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@user_blueprint.route('/newAlbum', methods=['POST'])
def post_create_new_album():
    try:

        requestBody = request.get_json()

        user_info_endpoint = "http://127.0.0.1:4000/user/info"
        user_info_response = requests.get(user_info_endpoint)

        if user_info_response.status_code == 200:
            data = user_info_response.json()
            userId = data.get("id")
            print(userId)
        else:
            return jsonify({"error": f"Failed to fetch userId: {response.status_code}"}), response.status_code 
        
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}

        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists"
        print(endpoint)


        response = requests.post(endpoint, headers=headers, json=requestBody)

        if response.status_code == 201:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to create new album: {response.json()}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500 


    
