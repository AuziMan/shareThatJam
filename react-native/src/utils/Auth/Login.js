import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator, Linking } from 'react-native';
import { login, storeToken } from './AuthService';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null); // <- Add this

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await login();
      if (response?.url) {
        const supported = await Linking.canOpenURL(response.url);
        if (supported) {
          await Linking.openURL(response.url);
        } else {
          console.error("Can't open the URL");
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      if (url.includes('shareThatJam://auth')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const code = urlParams.get('code');
        if (code) {
          try {
            const response = await fetch(`${API_BASE_URL}/auth/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });
            const data = await response.json();
            if (data.access_token) {
              await storeToken(data.access_token);
              setToken(data.access_token); // <- Save locally
              console.log('Access token stored successfully!');
              getPlaybackState(data.access_token); // <- Call playback here
            }
          } catch (error) {
            console.error('Error getting access token:', error);
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login with Spotify Here" onPress={handleLogin} />
      {isLoading && <ActivityIndicator size="large" />}
    </View>
  );
};

export default Login;
