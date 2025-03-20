// pages/CreatePlaylistPage.jsx
import React, { useState } from 'react';
import { CreateNewPlaylist } from '../Services/CreateNewPlaylist'; // Import the service
import {StyleSheet, TextInput, SafeAreaProvider, SafeAreaView, Button, View, Text } from 'react-native';


function NewPlaylistScreen( {navigation} ) {
  const [playlistName, setPlaylistName] = React.useState('Playlist Name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async () => {

    if (!playlistName.trim()) {
      setError("Please enter a valid playlist name.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Playlist Name", playlistName);

      const newPlaylist = await CreateNewPlaylist(playlistName); // Call API service to create playlist
      console.log("New playlist created:", newPlaylist.name);

      navigation.goBack(); 

      // Optionally, redirect to a playlist page or show success message
    } catch (error) {
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          style={styles.input}
          value={playlistName}
          placeholder="Enter Playlist Name"
          onChangeText={setPlaylistName}
        />
        <Button title={isLoading ? "Creating..." : "Create Playlist"} onPress={handleSubmit} disabled={isLoading} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
  

export default NewPlaylistScreen;
