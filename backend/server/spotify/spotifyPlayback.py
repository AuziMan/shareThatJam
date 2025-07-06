import datetime
from flask import Flask, jsonify, redirect, url_for, request, Blueprint, session
from dotenv import load_dotenv
import requests
import json
from server.spotify.utils.sharedFunctions import get_playback_info, format_queue_response


playback_blueprint = Blueprint("playback", __name__)

BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"
SPOTIFY_URL_USER_SEARCH = "https://api.spotify.com/v1"
RECCO_BEATS_BASEURL = "https://api.reccobeats.com/v1/"

SPOTIFY_TOP_TRACKS_ENDPOINT = f"{BASE_SPOTIFY_URL}/top/tracks?time_range=short_term"
SPOTIFY_PLAYER_ENDPOINT = f"{BASE_SPOTIFY_URL}/player"


@playback_blueprint.route('/playback', methods=['GET'])
def get_playback_state():
    try:

        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(SPOTIFY_PLAYER_ENDPOINT, headers=headers)

        if response.status_code == 200:
            # print(response.json())
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch playback data: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@playback_blueprint.route('/device', methods=['GET'])
def get_playback_device():
    try:

        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(SPOTIFY_PLAYER_ENDPOINT, headers=headers)
        
        if response.status_code == 200:
            playback_raw_data = response.json()
            # print(f'playback raw data: {playback_raw_data}')
            playback_info = get_playback_info(playback_raw_data)
            # print(f'formatted playback info {playback_info}')
            return playback_info
        else:
            return jsonify({"error": f"Failed to fetch playback data: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@playback_blueprint.route('/transfer', methods=['PUT'])
def put_transfer_playback_device():
    try:

        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }
        
        device_id = request.args.get('deviceId')

        params = {}
        if(device_id):
            params[device_id] = device_id

        response = requests.put(SPOTIFY_PLAYER_ENDPOINT, headers=headers, params=params)
        print(f"Playback Transfer data {response.json()}")
        
        if response.status_code in [204, 202]:
            return jsonify({'message': 'Playback device transfered'}), 200
        else:
            return jsonify({"error": f"Playback device not transfered: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# get Player Queue
@playback_blueprint.route('/queue', methods=['GET'])
def get_playback_queue():
    try:

        print("queue endpoint hit")

        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(f"{SPOTIFY_PLAYER_ENDPOINT}/queue", headers=headers)

        if response.status_code == 200:
            data = response.json()
            track_info = format_queue_response(data)
            # print("Formatted queue data:", json.dumps(track_info, indent=2))  # for readable output
            return jsonify(track_info)        
        else:
            return jsonify({"error": f"Failed to get playback queue: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
    
