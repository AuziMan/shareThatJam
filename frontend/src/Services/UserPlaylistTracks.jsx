import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/config';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TrackCard from '../Components/TrackCard';


const UserPlaylistTracks = () => {
    const { playlistId } = useParams(); 
    const [tracks, setTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState(""); // State for playlist name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/playlist/playlistTracks?playlistId=${playlistId}`, { withCredentials: true })
            .then(response => {
                console.log("Playlist Tracks", response.data);
                setTracks(response.data.items || []);
                setPlaylistName(response.data.name || "Unknown Playlist"); // Set playlist name

                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [playlistId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="d-flex flex-column align-items-center">
        <h1>Playlist Tracks in <b>{playlistName}</b></h1>
            <div className="d-flex flex-wrap justify-content-center">
                {tracks.map((track, index) => (
                    <TrackCard
                        key={index}
                        trackName={track.track.name}
                        artistName={track.track.artists.map(artist => artist.name).join(", ")}
                        albumImg={track.track.album.images[0].url} // Assuming the album image is at this location
                        onClick={() => console.log(`Play ${track.track.name}`)} // Customize play action
                    />
                ))}
            </div>
        </div>
    );
};

export default UserPlaylistTracks;
