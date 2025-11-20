import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/config';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TrackCard from '../Components/TrackCard';
import UserReccomendedTracks from './UserReccomendedTracks' 


const UserPlaylistTracks = () => {
    const { playlistId } = useParams(); 
    const [tracks, setTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState(""); // State for playlist name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/playlist/playlistTracks?playlistId=${playlistId}`, 
                { withCredentials: true }

                );
                console.log(response)

                setTracks(response.data.playlistTracks || []);
                setPlaylistName(response.data.playlistName || "Unknown Playlist")

                if(!response.data || response.data.length === 0) {
                    console.log("Playlist is empty. Populating with top tracks")
                    fetchTopTracks();
                } else {
                    setLoading(false)
                }
            }
            catch(error) {
                setError(error)
                setLoading(false)
            }
        };

    fetchPlaylistTracks();
}, [playlistId]);

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

    return (
        <Container className="mt-4">
        <h1 className="text-center mb-4">
            {tracks.length === 0 ? "No Tracks in the Playlist, Showing Reccomended Tracks!" : `Playlist Tracks in ${playlistName}`}
        </h1>

        {tracks.length === 0 ? (
                <div className="text-center">
                    No playlist tracks found. Displaying Reccomended Tracks Instead.
                    <UserReccomendedTracks />

                </div>
        ) : null}
            <Row className="g-4">
                {tracks.map((track, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}> 
                    <TrackCard
                        key={index}
                        trackName={track.track}
                        artistName={track.artist}
                        albumImg={track.albumImg} // Assuming the album image is at this location
                        onClick={() => console.log(`Play ${track.name}`)} // Customize play action
                    />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserPlaylistTracks;
