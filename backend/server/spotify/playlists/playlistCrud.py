import datetime
from flask import Flask, jsonify, redirect, url_for, request, Blueprint, session
from dotenv import load_dotenv
import requests
import json
from server.spotify.utils.sharedFunctions import format_response_array, format_response_obj, format_playlist_tracks, get_user_info_from_spotify

SPOTIFY_URL_USER_SEARCH = "https://api.spotify.com/v1"

playlist_blueprint = Blueprint("playlist", __name__)

@playlist_blueprint.route('/playlists', methods=['GET'])
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
    


@playlist_blueprint.route('/playlistTracks', methods=['GET'])
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

        # Get Playlist Tracks
        tracks_endpoint = f"{SPOTIFY_URL_USER_SEARCH}/playlists/{playlist_id}/tracks?limit=100"
        tracks_response = requests.get(tracks_endpoint, headers=headers)

        # Get Playlist info (for the name)
        playlist_endpoint = f"{SPOTIFY_URL_USER_SEARCH}/playlists/{playlist_id}"
        playlist_response = requests.get(playlist_endpoint, headers=headers)


        if tracks_response.status_code == 200 and playlist_response.status_code == 200:
            
            tracks_data = tracks_response.json()
            playlist_data = playlist_response.json()
            # filtered_tracks_data = tracks_data["items"][:1]

            playlist_tracks = format_playlist_tracks(tracks_data)
            platlist_name =  playlist_data.get("name")

            formatted_response = {
                "playlistName": platlist_name,
                "playlistTracks": playlist_tracks
            }

            return jsonify(formatted_response)
        else:
            return jsonify({"error": "Failed to fetch playlist data"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@playlist_blueprint.route('/createPlaylist', methods=['POST'])
def post_create_new_album():
    try:
        # Get the body of the request (expecting JSON with 'name')
        playlist_info = request.get_json()

        playlist_name = playlist_info.get('name')
        requestBody = {
            "name": playlist_name,
            "description": "New Playlist from Share That Jam",
            "public": True
        }
        print(requestBody)
        if not requestBody or not requestBody.get('name'):
            return jsonify({"error": "Playlist name is required."}), 400

        user_info = get_user_info_from_spotify()

        if not user_info:
            return jsonify({"error": "Failed to fetch user info"}), 500

        userId = user_info.get('id')

        if not userId:
            return jsonify({"error": "User ID not found in user info"}), 500
        
        # Check if the access token is in the session
        if not session.get('access_token'):
            return redirect(url_for('auth.login'))

        # Ensure the token is valid (you can also have a separate function to handle expiry)
        if datetime.datetime.now().timestamp() > session['expires_at']:
            return redirect(url_for('auth.refresh_token'))
        
        # Authorization header
        headers = {
            'Authorization': f"Bearer {session['access_token']}"
        }

        # Now that we have the userId, create the playlist
        endpoint = f"{SPOTIFY_URL_USER_SEARCH}/users/{userId}/playlists"
        print(f"Playlist creation endpoint: {endpoint}, headers {headers}")

        # Make the request to create the playlist
        response = requests.post(endpoint, headers=headers, json=requestBody)

        if response.status_code == 201:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Failed to create new playlist: {response.json()}"}), response.status_code

    except Exception as e:
        # General error handler
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500