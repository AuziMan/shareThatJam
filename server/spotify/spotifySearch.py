import datetime
from flask import Flask, jsonify, redirect, request, Blueprint, session
from dotenv import load_dotenv
import requests


search_blueprint = Blueprint("search", __name__)


BASE_SPOTIFY_URL = "https://api.spotify.com/v1"


@search_blueprint.route('/track/<string:trackId>', methods=['GET'])
def get_track_by_id(trackId):
    try:
        if 'access_token' not in session:
            return redirect('/login')

        if datetime.now().timestamp() > session['expires_at']:
            return redirect('/refresh-token')
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }
        endpoint = f"{BASE_SPOTIFY_URL}/tracks/{trackId}"
        print(endpoint)
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch track by trackId: {trackId}, {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@search_blueprint.route('/album/<string:albumId>', methods=['GET'])
def get_album_by_id(albumId):
    try:
        if 'access_token' not in session:
            return redirect('/login')

        if datetime.now().timestamp() > session['expires_at']:
            return redirect('/refresh-token')
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }
        endpoint = f"{BASE_SPOTIFY_URL}/albums/{albumId}"
        print(endpoint)
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch track by trackId: {albumId}, {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500