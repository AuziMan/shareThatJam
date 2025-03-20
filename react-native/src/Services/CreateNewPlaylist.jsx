// services/CreateNewPlaylist.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';


// Function to create a new playlist
export const CreateNewPlaylist = async (playlistName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/playlist/createPlaylist`, { name: playlistName });
    return response.data; // Return playlist data after successful creation
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};

export default CreateNewPlaylist
