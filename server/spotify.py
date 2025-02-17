
from flask import Flask, jsonify, request, Blueprint
from dotenv import load_dotenv
import requests
from server.utils import get_access_token

songs_blueprint = Blueprint("songs", __name__)


SPOTIFY_TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks"
SPOTIFY_NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing"



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