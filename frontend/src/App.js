import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './utils/Auth/Login';
import Callback from './utils/Auth/Callback';

import TopTracks from './Services/TopTracks';
import NowPlaying from './Services/NowPlaying';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/top-tracks" element={<TopTracks />} />
                <Route path="/now-playing" element={<NowPlaying />} />
                <Route path="/callback" element={<Callback />} />

            </Routes>
        </Router>
    );
}

export default App;