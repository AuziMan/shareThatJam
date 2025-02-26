// services/CreateNewPlaylist.js
import axios from 'axios';

// Function to create a new playlist
export const CreateNewPlaylist = async (playlistName) => {
  try {
    const response = await axios.post('/playlist/createPlaylist', { name: playlistName });
    return response.data; // Return playlist data after successful creation
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};

export default CreateNewPlaylist
