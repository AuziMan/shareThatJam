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
    const device_id = await AsyncStorage.getItem('device_id');

    let response = await axios.get(`${API_BASE_URL}/playback/device?deviceId=${device_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // If playback data is missing or empty, try transferring playback to the device
    if (!response.data || Object.keys(response.data).length === 0) {
      console.log('No playback data from server. Attempting to wake device...');

      if (device_id) {
        try {
          await axios.put(`${API_BASE_URL}/playback/transfer`, {
            "device_ids": [device_id],
            play: false, // wake device, don't auto-play
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Retry fetching playback data
          response = await axios.get(`${API_BASE_URL}/playback/device?deviceId=${device_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.data || Object.keys(response.data).length === 0) {
            throw new Error('No playback data after transfer attempt.');
          }
        } catch (transferErr) {
          console.error('Failed to transfer playback:', transferErr);
        }
      }
    }

    // If playback data is now available
    if (response.data && Object.keys(response.data).length > 0) {
      const { device_id: newDeviceId, is_playing, track, track_id, artist, albumImg, is_restricted } = response.data;

      const playbackData = {
        isPlaying: is_playing ?? false,
        device_id: newDeviceId,
        is_restricted,
        track,
        trackId: track_id,
        artist,
        albumImg,
      };

      await storeDeviceId(newDeviceId);
      await storePlaybackData(playbackData);

      return playbackData;
    }

    // Fallback to cached data
    console.log('Falling back to cached playback data.');
    const cachedData = await getPlaybackDataFromStorage();

    return cachedData ?? {
      isPlaying: false,
      device_id: device_id ?? null,
      track: null,
      trackId: null,
      artist: null,
      albumImg: null,
    };
  } catch (error) {
    console.error('Error fetching playback data:', error);

    const fallbackData =
      (await getPlaybackDataFromStorage()) ?? {
        isPlaying: false,
        device_id: null,
        track: null,
        trackId: null,
        artist: null,
        albumImg: null,
      };

    return fallbackData;
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


export const nextPlayback = async () => {
  try {
    const token = await AsyncStorage.getItem('spotifyAccessToken');
    const deviceId = await AsyncStorage.getItem('device_id');
    console.log("next playback pressed")

    if (!deviceId) {
      console.warn('No device ID found in storage.');
      return;
    }

    // Prepare query params with deviceId
    let url = `${API_BASE_URL}/player/next?deviceId=${deviceId}`;

    const response = await axios.post(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      console.log('next track requested');
    } else {
      console.warn('next track request returned:', response.status);
    }
  } catch (error) {
    console.log('Error next track playback:', error);
  }
};



export const storePlaybackData = async (playbackData) => {
  try {
    if (!playbackData || typeof playbackData !== 'object') {
      console.warn('Invalid playback data — skipping storage.');
      return;
    }

    const jsonValue = JSON.stringify(playbackData);
    await AsyncStorage.setItem('playback_data', jsonValue);
  } catch (error) {
    console.error('Error storing playback data:', error);
  }
};


export const getPlaybackDataFromStorage = async () => {
  try {
    const dataStr = await AsyncStorage.getItem("playback_data");
    if (!dataStr) return null;
    return JSON.parse(dataStr);
  } catch (e) {
    console.error("Error parsing playback_data from storage:", e);
    return null;
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
