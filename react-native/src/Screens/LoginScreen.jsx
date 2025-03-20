import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setIsLoading(true);
    setError('');
    console.log("Fetching Spotify OAuth URL...");
  
    fetch('http://192.168.0.16:4000/auth/login')
      .then((response) => response.json())
      .then((data) => {
        //console.log("Received Spotify OAuth URL:", data.spotify_oauth_url);
        if (data.spotify_oauth_url) {
          setAuthUrl(data.spotify_oauth_url);
          setShowWebView(true);
        } else {
          setError('Error fetching auth URL: No URL returned');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(`Error: ${error.message}`);
        console.error('Error fetching OAuth URL:', error);
        setIsLoading(false);
      });
  };
  
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    // console.log('WebView navigated to:', url);

    if (url.includes('/auth/callback')) {
      // console.log('Detected callback URL:', url);
      
      try {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        // console.log('Extracted code:', code);

        if (code) {
          fetch('http://192.168.0.16:4000/auth/callback', {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: { 'Content-Type': 'application/json' },
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log('Authentication successful:', data);
              setShowWebView(false);
              
              // Store auth tokens in AsyncStorage
              if (data.access_token) {
                AsyncStorage.setItem('spotifyAccessToken', data.access_token);
                AsyncStorage.setItem('spotifyRefreshToken', data.refresh_token);
                AsyncStorage.setItem('spotifyExpiresAt', 
                  (new Date().getTime() + (data.expires_in * 1000)).toString());
                
                // Navigate to UserPlaylists screen
                navigation.navigate('Main');
              }
            })
            .catch((error) => {
              console.error('Error during authentication:', error);
              setError('Authentication failed');
              setShowWebView(false);
            });
        }
      } catch (e) {
        console.error('Error parsing callback URL:', e);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <View style={styles.loginContainer}>
          <Button title="Login with Spotify" onPress={handleLogin} disabled={isLoading} />
          {isLoading && <ActivityIndicator size="large" style={styles.loader} />}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      ) : (
        <WebView
          source={{ uri: authUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onError={(error) => {
            console.error("WebView Error:", error);
            setError(`WebView error: ${error.description}`);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          style={styles.webView}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webView: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  }
});

export default LoginScreen;