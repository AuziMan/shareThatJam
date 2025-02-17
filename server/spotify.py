
from flask import Flask, jsonify, request, Blueprint
from dotenv import load_dotenv
import requests
from server.utils import get_access_token

songs_blueprint = Blueprint("songs", __name__)

BASE_SPOTIFY_URL = "https://api.spotify.com/v1"
SPOTIFY_TOP_TRACKS_ENDPOINT = f"{BASE_SPOTIFY_URL}/me/top/tracks"
SPOTIFY_NOW_PLAYING_ENDPOINT = f"{BASE_SPOTIFY_URL}/me/player/currently-playing"




@songs_blueprint.route('/topTracks', methods=['GET'])
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
    

@songs_blueprint.route('/nowPlaying', methods=['GET'])
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
    

@songs_blueprint.route('/track/<string:trackId>', methods=['GET'])
def get_track_by_id(trackId):
    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        endpoint = f"{BASE_SPOTIFY_URL}/tracks/{trackId}"
        print(endpoint)
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch track by trackId: {trackId}, {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500