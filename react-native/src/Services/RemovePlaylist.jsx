import axios from 'axios';
import { API_BASE_URL } from '../utils/config';


// Function to remove a playlist
export const RemovePlaylist = async (playlist_id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/playlist/removePlaylist`, { playlist_id });
    return response.data; // Return playlist data after successful removal
  } catch (error) {
    console.error("Error removing playlist:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};

export default RemovePlaylist
