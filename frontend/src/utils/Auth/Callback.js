import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Send the code to Flask to get the access token
            axios.post('/auth/callback', { code })
                .then(response => {
                    // Redirect to the top tracks page
                    navigate('/top-tracks');
                })
                .catch(error => {
                    console.error('Error during callback:', error);
                });
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;