
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
    

# Implement user reccomendations:
# 1. 'https://api.spotify.com/v1/recommendations'
# 2. Pass in top 4 track Ids from 'Top Tracks' as 'seeds'

# Spotifys reccomendations endpoint was deprecated. SUCKS! :(


# @user_blueprint.route('/recommendations', methods=['GET'])
# def get_reccomended_tracks():
#     try:
#         print("in reccs")

#         if not session.get('access_token'):
#             return redirect(url_for('auth.login'))

#         if datetime.datetime.now().timestamp() > session['expires_at']:
#             return redirect(url_for('auth.refresh_token'))
        
#         headers = {
#             'Authorization': f"Bearer {session['access_token']}"
#         }

#         print("calling shared func")
#         track_seeds = format_user_recc_seeds()
#         # print(track_seeds)

#         # Check if track_seeds is not None and has required data
#         if track_seeds:
#             # Format the query parameters
#             query_params = []

#             if track_seeds["seed_tracks"]:
#                 query_params.append(f"seed_tracks={','.join(track_seeds['seed_tracks'])}")
            
#             if track_seeds["seed_artists"]:
#                 query_params.append(f"seed_artists={','.join(track_seeds['seed_artists'])}")
            
#             if track_seeds["seed_genres"]:
#                 query_params.append(f"seed_genres={','.join(track_seeds['seed_genres'])}")

#             # Join the parameters with '&' and build the final URL
#             recommendations_url = f"{SPOTIFY_URL_USER_SEARCH}/recommendations?{'&'.join(query_params)}"
#             print(f"Recommendations URL: {recommendations_url}")
            
#             # Make the API request
#             response = requests.get(recommendations_url, headers=headers)

#             if response.status_code == 200:
#                 return jsonify(response.json())
#             else:
#                 print(f"Failed to fetch recommendations: {response.status_code}")
#                 return jsonify({"error": f"Failed to fetch recommendations: {response.status_code}"}), response.status_code
#         else:
#             return jsonify({"error": "Invalid seed data, cannot generate recommendations."}), 400

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({"error": str(e)}), 500




    
