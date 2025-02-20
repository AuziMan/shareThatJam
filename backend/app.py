from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify, Blueprint
from server.spotify.spotifyUser import user_blueprint
from server.spotify.spotifySearch import search_blueprint
from server.spotify.utils.auth import auth_blueprint

import secrets



app = Flask(__name__)

app.secret_key = secrets.token_hex(16)

CORS(app)

app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(search_blueprint, url_prefix='/search')


@app.route('/')
def home():
    return "Spotify home page <a href='auth/login'>Login with spotify</a> Now Playing <a href='user/nowPlaying'>Now Playing</a>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)

