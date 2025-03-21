import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './utils/Auth/Login';
import Callback from './utils/Auth/Callback';
import TopTracks from './Services/TopTracks';
import NowPlaying from './Services/NowPlaying';
import HomePage from './views/HomePage';
import UserPlaylists from './Services/UserPlaylists';
import CreatePlaylistForm from './Components/CreatePlaylistForm';
import UserPlaylistTracks from './Services/UserPlaylistTracks';
import UserReccomendedTracks from './Services/UserReccomendedTracks';
import Header from './Components/Header';

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/top-tracks" element={<TopTracks />} />
                <Route path="/now-playing" element={<NowPlaying />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/user-playlists" element={<UserPlaylists />} />
                <Route path="/user-reccomended" element={<UserReccomendedTracks />} />
                <Route path="/create-playlist" element={<CreatePlaylistForm />} />
                <Route path="/playlistTracks/:playlistId" element={<UserPlaylistTracks />} />
            </Routes>
        </Router>
    );
}

export default App;