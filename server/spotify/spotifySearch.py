from flask import Flask, jsonify, request, Blueprint
from dotenv import load_dotenv
import requests
from server.utils import get_access_token


search_blueprint = Blueprint("search", __name__)


BASE_SPOTIFY_URL = "https://api.spotify.com/v1"


@search_blueprint.route('/track/<string:trackId>', methods=['GET'])
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