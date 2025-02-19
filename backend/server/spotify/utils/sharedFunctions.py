# Shared functions

# Formats an array of tracks, and returns the track and artist
def format_response_array(data):
    track_info = [
        {
            "track": track["name"],
            "artist": track["artists"][0]["name"] if track["artists"] else "Unknown Artist",
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
        }
    ]
    return track_info