import datetime
from flask import Flask, jsonify, redirect, url_for, request, Blueprint, session
from dotenv import load_dotenv
import requests
import json
from server.spotify.utils.sharedFunctions import request_to_curl  


player_blueprint = Blueprint("player", __name__)

BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"
SPOTIFY_PLAYER_ENDPOINT = f"{BASE_SPOTIFY_URL}/player"

# Pause track

@player_blueprint.route('/pause', methods=['PUT'])
def put_pause_track():
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
        if device_id:
            params['device_id'] = device_id
        print(params)

        response = requests.put(f"{SPOTIFY_PLAYER_ENDPOINT}/pause", headers=headers, params=params)

        if response.status_code == 204:
            return jsonify({'message': 'Playback paused'}), 204
        else:
            return jsonify({"error": f"Failed to pause playback: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# Play or resume tracks
@player_blueprint.route('/play', methods=['PUT'])
def put_play_track():
    try:
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))

        headers = {
            'Authorization': f"Bearer {session['access_token']}",
            'Content-Type': 'application/json'
        }

        # Extract device ID from query params
        device_id = request.args.get('deviceId')

        # Extract optional trackId from JSON body
        data = request.get_json(silent=True)
        track_id = data.get('trackId') if data else None
        print(f'track id', {track_id})

        # Build query params
        params = {}
        if device_id:
            params['device_id'] = device_id
        print(params)

        # Build body depending on whether track_id is provided
        body = {}
        if track_id:
            body['uris'] = [f'spotify:track:{track_id}']

        print("data:", json.dumps(body))

        print(request_to_curl("PUT", f"{SPOTIFY_PLAYER_ENDPOINT}/play", headers=headers, params=params, json_body=body))
        # Send request to Spotify API
        response = requests.put(
            f"{SPOTIFY_PLAYER_ENDPOINT}/play",
            headers=headers,
            params=params,
            json=body if body else None
        )

        if response.status_code in [204, 202]:
            return jsonify({'message': 'Playback started or resumed'}), 200
        else:
            return jsonify({"error": f"Failed to start/resume playback: {response.status_code}", "details": response.text}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
    