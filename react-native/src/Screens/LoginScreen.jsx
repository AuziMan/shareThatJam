import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    console.log("Fetching Spotify OAuth URL...");
  
    // Fetch the Spotify OAuth URL from the Flask backend
    fetch('http://192.168.0.16:4000/auth/login')
      .then((response) => response.json())
      .then((data) => {
        console.log("Received Spotify OAuth URL:", data.spotify_oauth_url); // Log the URL
        if (data.spotify_oauth_url) {
          setAuthUrl(data.spotify_oauth_url);
          setShowWebView(true);
          console.log('Redirecting to WebView');
        } else {
          console.error('Error fetching auth URL:', data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching OAuth URL:', error);
        setIsLoading(false);
      });
  };
  

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    // Check if the redirect URL matches the callback URL
    if (url.startsWith('http://192.168.0.16:4000/auth/callback')) {
      // Extract the authorization code from the URL
      const code = new URL(url).searchParams.get('code');

      if (code) {
        // Send the code to your backend for further processing
        fetch('http://192.168.0.16:4000/auth/callback', {
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Authenticated:', data);
          })
          .catch((error) => {
            console.error('Error during authentication:', error);
          });
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!showWebView ? (
        <>
          <Button title="Login with Spotify" onPress={handleLogin} disabled={isLoading} />
          {isLoading && <ActivityIndicator size="large" />}
        </>
      ) : (
        <WebView
            source={{ uri: 'https://www.google.com' }}
            onNavigationStateChange={handleNavigationStateChange}
            onError={(error) => console.error("WebView Error:", error)}
            onLoad={() => console.log("WebView finished loading")}  // Log when WebView loads
            javaScriptEnabled={true}
            domStorageEnabled={true}  // Enable local storage in WebView
            startInLoadingState={true}  // Show loading indicator while page loads
            scalesPageToFit={true}      // Enable scaling to fit content on screen
        />
      )}
    </View>
  );
};

export default LoginScreen;
