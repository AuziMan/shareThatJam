import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackCard from '../Components/TrackCard';

// Spotifys reccomendations endpoint was deprecated. SUCKS! :(

const UserReccomendedTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/user/recommendations')
            .then(response => {
                setTracks(response.data);
                console.log("reccomendation", response);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="d-flex flex-column align-items-center">
            <h1 className="text-center mb-4">Your Reccomended Tracks</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {tracks.map((track, index) => (
                    <TrackCard
                    trackName={track.track} // Assuming `track` is the track name
                    artistName={track.artist} // Assuming `artist` is the artist name
                    albumImg={track.albumImg} // Assuming `albumImg` is the album image URL
                    onClick={() => console.log(`Play ${track.track}`)} // Customize this action
                />
                ))}
            </div>
        </div>
    );
};

export default UserReccomendedTracks;
