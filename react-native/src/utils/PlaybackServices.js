import { API_BASE_URL } from '../utils/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get full playback data from spotify
export const getPlaybackState = async () => {
    try {
      const token = await AsyncStorage.getItem('spotifyAccessToken');
      const response = await axios.get(`${API_BASE_URL}/playback/playback`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data) {
        console.log("No playback state");
      } else {
        console.log('Playback state:', response.data);
      }
    } catch (error) {
      console.log('Error fetching playback state:', error);
    }
  };


// Get needed playback data for user controls
export const getPlaybackData = async () => {
    try {
        const token = await AsyncStorage.getItem('spotifyAccessToken')
        const response = await axios.get(`${API_BASE_URL}/playback/device`, {
            headers: { Authorization: `Bearer ${token}` },
          });

        if (!response.data) {
            console.log("No playback data");
        } else {
            console.log('Playback data:', response.data);
            storeDeviceId(response.data.device_id)
            let deviceId = await AsyncStorage.getItem('device_id')
            console.log('deviceId from storage', deviceId)
        }

    } catch (error) {
        console.log('Error fetching playback data:', error);
    }
}


// Store playback data in AsyncStorage

// Function to store the access token
const storeDeviceId = async (deviceId) => {
    try {
      await AsyncStorage.setItem('device_id', deviceId);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };