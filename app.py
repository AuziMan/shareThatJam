from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify, Blueprint
from server.spotify.spotifyUser import user_blueprint
from server.spotify.spotifySearch import search_blueprint



app = Flask(__name__)
CORS(app)


app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(search_blueprint, url_prefix='/search')



@app.route('/')
def home():
    return "spotify flask api"

if __name__ == '__main__':
    app.run(debug=True)