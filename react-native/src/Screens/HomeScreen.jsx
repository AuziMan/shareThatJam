import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { getAccessToken, logout } from '../utils/Auth/AuthService';
import UserPlaylists from '../Services/UserPlaylists'; // Import the UserPlaylists component

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = await getAccessToken();
    if (!storedToken) {
      navigation.replace('Login'); // Redirect to Login if no token found
    } else {
      setToken(storedToken);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!token ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Spotify App!</Text>
          <Button title="Logout" onPress={logout} />
          <UserPlaylists /> {/* Display playlists here */}
        </>
      )}
    </View>
  );
};

export default HomeScreen;
