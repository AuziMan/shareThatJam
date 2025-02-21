import React from 'react';

const Login = () => {
    const handleLogin = () => {
        // Redirect to Flask login endpoint
        window.location.href = 'http://localhost:4000/auth/login';
    };

    return (
        <div>
            <h1>Spotify App</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
};

export default Login;