import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Container, Row, Col } from 'react-bootstrap';
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
                console.log("Top Tracks", response.data);
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
            <h1 className="text-center mb-4">Your Top Tracks</h1>
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

export default UserReccomendedTracks;
