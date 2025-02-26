// pages/CreatePlaylistPage.jsx
import React, { useState } from 'react';
import { CreateNewPlaylist } from '../Services/CreateNewPlaylist'; // Import the service

function CreatePlaylistForm() {
  const [playlistName, setPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    setPlaylistName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playlistName.trim()) {
      setError("Please enter a valid playlist name.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const newPlaylist = await CreateNewPlaylist(playlistName); // Call API service to create playlist
      console.log("New playlist created:", newPlaylist);
      // Optionally, redirect to a playlist page or show success message
    } catch (error) {
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-playlist-form">
      <h2>Create a New Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Playlist Name</label>
          <input
            type="text"
            value={playlistName}
            onChange={handleInputChange}
            placeholder="Enter playlist name"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </div>
  );
}

export default CreatePlaylistForm;
