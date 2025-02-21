import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch top tracks from Flask backend
        axios.get('/user/topTracks')
            .then(response => {
                setTracks(response.data);
                console.log(response.data)
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
        <div>
            <h1>Your Top Tracks</h1>
            <ul>
                {tracks.map((track, index) => (
                    <li key={index}>
                        <strong>{track.track}</strong> by {track.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopTracks;