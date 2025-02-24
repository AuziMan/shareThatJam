
import datetime
from flask import Flask, jsonify, redirect, url_for, request, Blueprint, session
from dotenv import load_dotenv
import requests
import json
from server.spotify.utils.sharedFunctions import format_response_array, format_response_obj


user_blueprint = Blueprint("user", __name__)

BASE_SPOTIFY_URL = "https://api.spotify.com/v1/me"
SPOTIFY_URL_USER_SEARCH = "https://api.spotify.com/v1"

SPOTIFY_TOP_TRACKS_ENDPOINT = f"{BASE_SPOTIFY_URL}/top/tracks"
SPOTIFY_NOW_PLAYING_ENDPOINT = f"{BASE_SPOTIFY_URL}/player/currently-playing"
 


@user_blueprint.route('/topTracks', methods=['GET'])
def get_top_tracks():
    try:
        if not session.get('access_token'):
            session['next_url'] = request.path  # Store the requested endpoint
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            session['next_url'] = request.path  # Store the requested endpoint
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(SPOTIFY_TOP_TRACKS_ENDPOINT, headers=headers)

        if response.status_code == 200:
            data = response.json()

            track_info = format_response_array(data)

            return jsonify(track_info)
        else:
            return jsonify({"error": f"Failed to fetch top tracks: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@user_blueprint.route('/nowPlaying', methods=['GET'])
def get_now_playing():
    try:
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }
        response = requests.get(SPOTIFY_NOW_PLAYING_ENDPOINT, headers=headers)

        if response.status_code == 200:

            data = response.json()
        
            track_info = format_response_obj(data)

            return jsonify(track_info)
        
        elif response.status_code == 204:
            return jsonify("Play some music brah")
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_blueprint.route('/info', methods=['GET'])
def get_user_info():
    try:
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(BASE_SPOTIFY_URL, headers=headers)

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@user_blueprint.route('/playlists', methods=['GET'])
def get_user_playlists():
    print("in user albums")
    try:
        namesOnly = request.args.get('namesOnly', 'false').lower() == 'true'

        user_info = get_user_info_from_spotify()

        if not user_info:
            return jsonify({"error": "Failed to fetch user info"}), 500

        userId = user_info.get('id')
        if not userId:
            return jsonify({"error": "User ID not found in user info"}), 500
        
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists?limit=100"
        print(endpoint)
        
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            data = response.json()
            if namesOnly:
                album_names = [playlist["name"] for playlist in data.get("items", [])]
                return jsonify({"Your Public Albums": album_names})
            else:
                return jsonify(data)
        else:
            return jsonify({"error": f"Failed to fetch now playing: {response.status_code}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@user_blueprint.route('/playlistTracks', methods=['GET'])
def get_user_playlist_songs():
    try:
        playlist_id = request.args.get('playlistId')
        namesOnly = request.args.get('namesOnly', 'false').lower() == 'true'

        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/playlists/{playlist_id}/tracks?limit=100"
        print(endpoint)
        
        response = requests.get(endpoint, headers=headers)

        if response.status_code == 200:
            data = response.json()
            if namesOnly:
                track_names = [tracks["track"]["name"] for tracks in data.get("items", [])]
                return jsonify({"Playlist Tracks": track_names})
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
        
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists"
        print(endpoint)


        response = requests.post(endpoint, headers=headers, json=requestBody)

        if response.status_code == 201:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to create new album: {response.json()}"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
    


def get_user_playlist_id_spotify():
    try:

        userId = get_user_info_from_spotify()

        print(userId)
        if not session.get('access_token'):
            return None

        if datetime.datetime.now().timestamp() > session['expires_at']:
            return None

        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        response = requests.get(f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists", headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            return None
        
    except Exception as e:
        return None


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


    
