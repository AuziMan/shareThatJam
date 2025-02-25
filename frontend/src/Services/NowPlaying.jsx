import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackCard from '../Components/TrackCard';

const NowPlaying = () => {
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNowPlaying = () => {

            axios.get('/user/nowPlaying')
                .then(response => {
                    console.log("Now Playing Response", response);
                    
                    if (response.data.length > 0) {
                        setTrack(response.data[0])
                    } else {
                        setTrack(null)
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
            };

            fetchNowPlaying(); 

            const interval = setInterval(fetchNowPlaying, 100000);

            return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="d-flex justify-content-center">
            <div className="now-playing-card">
            {track && track.track && track.artist && track.albumImg ? (
                <TrackCard
                    trackName={track.track}
                    artistName={track.artist}
                    albumImg={track.albumImg}
                />
            ): (
                <div className="no-track-playing">
                    <h1>No Track Playing</h1>
                </div>
            )}
            </div>
        </div>
    );
};

export default NowPlaying;