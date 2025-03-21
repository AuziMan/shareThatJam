import axios from 'axios';
import { API_BASE_URL } from '../utils/config';


export const AddToPlaylist = async (playlist_id, track_id) => {
    try {
      console.log("in addToPlaylist function - sending request", playlist_id, track_id);
  
      const response = await axios.post(`${API_BASE_URL}/playlist/addToPlaylist`, {
          playlist_id,
          uris: [track_id] 
        });
  
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding to playlist:", error.response ? error.response.data : error.message);
      throw error;
    }
  };


export default AddToPlaylist;

