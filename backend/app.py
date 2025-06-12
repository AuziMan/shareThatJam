from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify, Blueprint
from server.spotify.spotifyUser import user_blueprint
from server.spotify.playlists.playlistCrud import playlist_blueprint
from server.spotify.spotifySearch import search_blueprint
from server.spotify.utils.auth import auth_blueprint
from server.spotify.spotifyPlayback import playback_blueprint
from server.spotify.spotifyPlayerActions import player_blueprint


import secrets

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)

CORS(app, supports_credentials=True)

app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(playlist_blueprint, url_prefix='/playlist')
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(search_blueprint, url_prefix='/search')
app.register_blueprint(playback_blueprint, url_prefix='/playback')
app.register_blueprint(player_blueprint, url_prefix='/player')

@app.route('/')
def home():
    return "Spotify home page <a href='auth/login'>Login with spotify</a> Now Playing <a href='user/nowPlaying'>Now Playing</a>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)

