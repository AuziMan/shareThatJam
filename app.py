from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify, Blueprint
from server.spotify import songs_blueprint


app = Flask(__name__)
CORS(app)


app.register_blueprint(songs_blueprint, url_prefix='/songs')


@app.route('/')
def home():
    return "spotify flask api"

if __name__ == '__main__':
    app.run(debug=True)