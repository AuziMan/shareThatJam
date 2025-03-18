import base64
from datetime import datetime
from dotenv import load_dotenv
import os
import requests
import urllib.parse
from flask import Flask, jsonify, request, Blueprint, redirect, session

load_dotenv()

auth_blueprint = Blueprint("auth", __name__)

SPOTIFY_CID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CS = os.getenv('SPOTIFY_CLIENT_SECRET')
LOCAL_BASE_URL = os.getenv('LOCAL_BASE_URL')
FRONTEND_BASE_URL = os.getenv('FRONTEND_BASE_URL')
MOBILE_REDIRECT_URI = os.getenv('MOBILE_REDIRECT_URI')  # Add this to your .env file

REDIRECT_URI = f"{LOCAL_BASE_URL}/auth/callback"

AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"


@auth_blueprint.route('/login')
def login():
    print(session)  # This will print session data in the console
    scope = 'user-read-private user-read-email user-top-read user-read-currently-playing playlist-modify-public playlist-modify-private'

    params = {
        'client_id': SPOTIFY_CID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URI,
        'show_dialog': True
    }

    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    print(f"Generated Auth URL: {auth_url}")  # Print the URL for debugging
    return jsonify({"spotify_oauth_url": auth_url})  # Return the URL as JSON

    # return redirect(auth_url)


@auth_blueprint.route('/callback', methods=['GET', 'POST'])
def callback():
    print("In callback route, method:", request.method)
    
    # Handle POST request from mobile app
    if request.method == 'POST':
        try:
            print("Processing POST request")
            data = request.get_json()
            print("Received data:", data)
            
            code = data.get('code')
            if not code:
                print("No authorization code provided")
                return jsonify({"error": "No authorization code provided"}), 400
            
            print("Exchanging code for token")
            # Exchange code for token
            req_body = {
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': REDIRECT_URI,
                'client_id': SPOTIFY_CID,
                'client_secret': SPOTIFY_CS
            }
            
            response = requests.post(TOKEN_URL, data=req_body)
            
            if response.status_code != 200:
                print(f"Token exchange failed with status {response.status_code}")
                print("Response content:", response.text)
                return jsonify({"error": f"Failed to retrieve access token: {response.text}"}), response.status_code
            
            token_info = response.json()
            print("Token exchange successful")
            
            if 'access_token' not in token_info:
                print("No access token in response")
                return jsonify({"error": "Failed to retrieve access token"}), 400
            
            # Store tokens in session if needed
            session['access_token'] = token_info['access_token']
            session['refresh_token'] = token_info['refresh_token']
            session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
            
            # Return tokens to mobile client
            return jsonify({
                "access_token": token_info['access_token'],
                "refresh_token": token_info['refresh_token'],
                "expires_in": token_info['expires_in']
            })
            
        except Exception as e:
            print(f"Error in POST callback: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500
    
    # Handle GET request from browser redirect
    elif request.method == 'GET':
        print("Processing GET request")
        if 'error' in request.args:
            return jsonify({"error": request.args['error']})
        
        if 'code' in request.args:
            code = request.args['code']
            print(f"Got authorization code: {code[:10]}...")
            
            req_body = {
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': REDIRECT_URI,
                'client_id': SPOTIFY_CID,
                'client_secret': SPOTIFY_CS
            }

            try:
                response = requests.post(TOKEN_URL, data=req_body)
                response.raise_for_status()  # Raise an error for bad responses
                token_info = response.json()

                if 'access_token' not in token_info:
                    return jsonify({"error": "Failed to retrieve access token"}), 400

                session['access_token'] = token_info['access_token']
                session['refresh_token'] = token_info['refresh_token']
                session['expires_at'] = datetime.now().timestamp() + token_info['expires_in'] 

                print("Authentication successful via GET")

                # Determine where to redirect (mobile vs web)
                redirect_uri = request.args.get("redirect_uri", FRONTEND_BASE_URL)

                # Redirect to mobile deep link if applicable
                if "shareThatJam://" in redirect_uri:
                    return redirect(f"{MOBILE_REDIRECT_URI}?code={code}")
                else:
                    return redirect(f"{FRONTEND_BASE_URL}/home")
            
            except requests.exceptions.RequestException as e:
                print(f"Error while exchanging token: {e}")
                return jsonify({"error": "Failed to retrieve access token"}), 500
        else:
            return jsonify({"error": "Authorization code not found in request"}), 400
    
    else:
        return jsonify({"error": "Method not allowed"}), 405


@auth_blueprint.route('/refresh_token')
def refresh_token():
    if 'refresh_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() > session['expires_at']:
        req_body = {
            'grant_type': 'refresh_token',
            'refresh_token': session['refresh_token'],
            'client_id': SPOTIFY_CID,
            'client_secret': SPOTIFY_CS
        }

        response = requests.post(TOKEN_URL, data=req_body)
        new_token_info = response.json()

        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in'] 

        next_url = session.pop('next_url', '/user/topTracks')
        return redirect(next_url)
