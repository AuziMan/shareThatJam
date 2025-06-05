import { API_BASE_URL } from '../config';
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
        console.log('Playback state retrived');
      }
    } catch (error) {
      console.log('Error fetching playback state:', error);
    }
  };


// Get needed playback data for user controls
export const getPlaybackData = async () => {
  try {
    const token = await AsyncStorage.getItem('spotifyAccessToken');
    const response = await axios.get(`${API_BASE_URL}/playback/device`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data) {
      console.log("No playback data");
      const returnData =  {
        isPlaying: false,
        device_id: null,
        track: null,
        trackId: null,
        artist: null,
        albumImg: null,
      };
      console.log(returnData)
      return(returnData)
    } else {
      const { device_id, is_playing, track, track_id, artist, albumImg, is_restricted } = response.data;

      await storeDeviceId(device_id);

      const returnData = {
        isPlaying: is_playing ?? false,         
        device_id,
        is_restricted,
        track,
        trackId: track_id,
        artist,
        albumImg,
      };
      console.log(returnData)
      return(returnData)
    }
  } catch (error) {
    console.log('Error fetching playback data:', error);
    returnData = {
      isPlaying: false,
      is_restricted,
      device_id: null,
      track: null,
      trackId: null,
      artist: null,
      albumImg: null,
    };
    console.log('Error fetching playback data:', error);
    return returnData;

  }
};


export const pausePlayback = async () => {
  try {
      const token = await AsyncStorage.getItem('spotifyAccessToken')

      const deviceId = await AsyncStorage.getItem('device_id')

      if(!deviceId){
        console.warn('No device ID found in storage.');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/player/pause?deviceId=${deviceId}`, {
            headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204) {
      console.log('Playback paused successfully');
      } else {
        console.warn('Pause request returned:', response.status);
      }
  } catch (error) {
    console.log('Error pausing playback:', error);
  }
}

export const playPlayback = async (trackId) => {
  try {
    const token = await AsyncStorage.getItem('spotifyAccessToken');
    const deviceId = await AsyncStorage.getItem('device_id');

    if (!deviceId) {
      console.warn('No device ID found in storage.');
      return;
    }

    // Prepare query params with deviceId
    let url = `${API_BASE_URL}/player/play?deviceId=${deviceId}`;

    // If trackId is provided, send it in the request body
    const body = trackId ? { "trackId": trackId } : {};
    console.log(body)

    const response = await axios.put(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      console.log('Playback started');
    } else {
      console.warn('Play request returned:', response.status);
    }
  } catch (error) {
    console.log('Error starting playback:', error);
  }
};





// Function to store the access token
const storeDeviceId = async (deviceId) => {
  try {
    if (!deviceId) {
      console.warn('No device ID provided — skipping storage.');
      return;
    }
    await AsyncStorage.setItem('device_id', deviceId);
  } catch (error) {
    console.error('Error storing device ID:', error);
  }
};
