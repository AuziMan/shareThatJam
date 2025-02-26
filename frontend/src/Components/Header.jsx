import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import NowPlayingHover from '../Components/NowPlayingHover'; // Import NowPlayingHover component

function Header() {
  const [track, setTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]); // State to store user playlists
  const [isHovered, setIsHovered] = useState(false); // State to control hover behavior
  const [hoverCardPosition, setHoverCardPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchNowPlaying = () => {
      axios.get('/user/nowPlaying')
        .then(response => {
          if (response.data && response.data.length > 0 && response.data[0].track) {
            setTrack(response.data[0]);
          } else {
            setTrack(null);
          }
        })
        .catch(error => {
          console.error("Error fetching now playing track:", error);
        });
    };

    const fetchPlaylists = () => {
      axios.get('/playlist/playlists')
        .then(response => {
          if (response.data && response.data.items) {
            setPlaylists(response.data.items);
          }
        })
        .catch(error => {
          console.error("Error fetching user playlists:", error);
        });
    };

    fetchNowPlaying();
    fetchPlaylists(); // Fetch playlists on component mount
    const interval = setInterval(fetchNowPlaying, 100000);
    return () => clearInterval(interval);
  }, []);

  // Handle the hover effect and position the hover card dynamically
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    const { top, left, width } = e.target.getBoundingClientRect();
    setHoverCardPosition({ top: top + 40, left: left + width / 2 - 90 }); // Adjust positioning as needed
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Handle the play action
  const handlePlay = () => {
    console.log("Playing track:", track.track);
    // Add logic to play the track, e.g., use the Spotify API or your own logic.
  };

  // Handle adding the track to a playlist
  const handleAddToPlaylist = () => {
    console.log("Adding track to playlist:", track.track);
    // Add logic for adding track to playlist here
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary px-3" style={{ position: 'relative' }}>
      <Container>
        {/* Left Side: App Brand */}
        <Navbar.Brand href="/home">Share That Jam</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/top-tracks">Your Top Tracks</Nav.Link>
            <Nav.Link href="/">Login</Nav.Link>

            
            {/* Right Dropdown for User Playlists */}
            <NavDropdown title="Your Playlists" id="basic-nav-dropdown">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <NavDropdown.Item key={playlist.id} href={`/playlistTracks/${playlist.id}`}>
                    {playlist.name}
                  </NavDropdown.Item>

                ))
              ) : (
                <NavDropdown.Item disabled>No Playlists Found</NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/create-playlist">
                Create New Playlist
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Right Side: Currently Playing Track */}
          <Nav className="ms-auto align-items-center">
            {track ? (
              <div
                className="d-flex align-items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={track.albumImg} 
                  alt={track.track} 
                  className="rounded-circle me-2" 
                  style={{ width: "40px", height: "40px" }} 
                />
                <span>{track.track} - {track.artist}</span>
              </div>
            ) : (
              <span>No Track Playing</span>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Hover card displayed outside the navbar */}
      {isHovered && track && (
        <div
          style={{
            position: 'absolute',
            top: hoverCardPosition.top,
            left: hoverCardPosition.left,
            zIndex: 9999,  // Ensure it is above other elements
            transition: 'opacity 0.3s ease',  // Smooth transition for visibility
          }}
        >
          <NowPlayingHover
            trackName={track.track}
            artistName={track.artist}
            albumImg={track.albumImg}
            onPlay={handlePlay}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </div>
      )}
    </Navbar>
  );
}

export default Header;
