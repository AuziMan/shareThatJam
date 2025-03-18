import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import { Linking } from 'react-native';

// Function to check if the user is logged in (access token exists)
export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return token !== null;
};

export const login = async () => {
    const loginUrl = `${API_BASE_URL}/auth/login`; // Your Flask login URL
    console.log("in login function within AuthService");
  
    try {
      const response = await axios.get(loginUrl);
      if (response.status === 200) {
        // Extract the Spotify OAuth URL from the response (assuming Flask sends this)
        const spotifyOAuthUrl = response.data.spotify_oauth_url; // Adjust based on your backend response
  
        // Redirect to the Spotify OAuth page
        console.log('Redirecting to Spotify OAuth');
        Linking.openURL(spotifyOAuthUrl); // Use Linking to open URL in the browser
        return response.data;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  

// Function to store the access token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Function to retrieve the access token
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Function to log the user out (remove token)
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    console.log('User logged out successfully!');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
