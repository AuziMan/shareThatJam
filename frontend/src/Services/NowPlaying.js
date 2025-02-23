import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

            const interval = setInterval(fetchNowPlaying, 10000);

            return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Now Playing:</h1>
            {track ? (
                <div>
                    <p><strong>{track.track}</strong> by {track.artist}</p>
                </div>
            ) : (
                <p>No Track Playing</p>
            )

            }
        </div>
    );
};

export default NowPlaying;