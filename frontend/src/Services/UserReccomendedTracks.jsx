import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackCard from '../Components/TrackCard';
import {Container, Row, Col } from 'react-bootstrap';


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
        <Container className="mt-4">
        <h1 className="text-center mb-4">Your Top Tracks</h1>
        <Row className="g-4">
            {tracks.map((track, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}> 
                    <TrackCard
                        trackName={track.track} // Assuming `track` is the track name
                        artistName={track.artist} // Assuming `artist` is the artist name
                        albumImg={track.albumImg} // Assuming `albumImg` is the album image URL
                        onClick={() => console.log(`Play ${track.track}`)} // Customize this action
                    />
                </Col>
            ))}
        </Row>
    </Container>
    );
};

export default UserReccomendedTracks;
