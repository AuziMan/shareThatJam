# Shared functions

# Formats an array of tracks, and returns the track, artist, and trackimg
def format_response_array(data):
    track_info = [
        {
            "track": track["name"],
            "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
            "albumImg": track["album"]["images"][0]["url"] if track["album"]["images"] else "unknown image"
            # "trackimg": track["album"]["images"][0]["url"] if track["images"] else "unknown image"
        }
        for track in data.get("items", [])
    ]
    return track_info


# Formats an object of track, and returns the track and artist

def format_response_obj(data):
    track_info = [
        {
            "track": data["item"]["name"],
            "artist": data["item"]["artists"][0]["name"] if data["item"]["artists"] else "Unknown Artist",
            "albumImg": data["item"]["album"]["images"][0]["url"] if data["item"]["album"]["images"] else "unknown image"
        }
    ]
    return track_info