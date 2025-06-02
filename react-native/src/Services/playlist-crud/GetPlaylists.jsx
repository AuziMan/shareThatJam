import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../utils/config';

export const getPlaylists = async () => {
    try {
        const token = await AsyncStorage.getItem('spotifyAccessToken');
        const response = await axios.get(`${API_BASE_URL}/playlist/playlists`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return { data: response.data.items || [], error: null };
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return { data: [], error };
    }
};