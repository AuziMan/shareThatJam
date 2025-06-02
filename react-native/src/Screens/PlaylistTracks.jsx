import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';
import { Menu, Divider } from 'react-native-paper'; // Import dropdown menu components
import TrackCard from '../Components/TrackCard';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For three-dot menu icon
import RemovePlaylist from '../Services/playlist-crud/RemovePlaylist';
import UserRecommendedTracks from '../Services/UserReccomendedTracks';


const PlaylistTracks = ({ route, navigation }) => {
    const { playlistId, setPlaylistId } = route.params;  // Receive playlistId and playlistName from navigation
    const [playlistTracks, setplaylistTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);


    useEffect(() => {
        const fetchPlaylistTracks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/playlist/playlistTracks?playlistId=${playlistId}`, { 
                    'Authorization': `Bearer ${await AsyncStorage.getItem('spotifyAccessToken')}`,
                });

                setplaylistTracks(response.data.playlistTracks || []);
                setPlaylistName(response.data.playlistName || "Unknown Playlist")

                setLoading(false);
            } catch (error) {
                console.error('Error fetching playlist tracks:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPlaylistTracks();
    }, [navigation, playlistId]);// Fetch tracks when playlistId changes


    useEffect(() => {
      // Update the screen title with the playlist name
      navigation.setOptions({ title: playlistName });
    }, [navigation, playlistName]);

    useEffect(() => {
      navigation.setOptions({
          title: playlistName,
          headerRight: () => (
              <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                      <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
                          <Icon name="more-vert" size={24} color="black" />
                      </TouchableOpacity>
                  }
              >
                  <Menu.Item onPress={() => console.log("Edit Playlist Pressed")} title="Edit Playlist" />
                  <Divider />
                  <Menu.Item onPress={handleDeletePlaylist} title="Delete Playlist" />
                  {/* <Menu.Item onPress={handleAddToPlaylist} title="Add Songs" /> */}

              </Menu>
          ),
      });
  }, [navigation, playlistName, menuVisible]);


  const handleDeletePlaylist = async () => {
    setMenuVisible(false);
    try {
        await RemovePlaylist(playlistId);
        alert("Playlist deleted successfully!");
        navigation.goBack(); // Navigate back after deletion
    } catch (error) {
        alert("Failed to delete playlist.");
    }
  };




    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
    
      if (error) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Error: {error.message}</Text>
          </View>
        );
      }

    return (
      <View style={{ flex: 1, padding: 16 }}>
      {playlistTracks.length === 0 ? (
        <View style={{ flex: 1 }}>
            <UserRecommendedTracks playlistId={playlistId} />
        </View>
      ) : (
          <FlatList
              data={playlistTracks}  // Use playlistTracks if available
              renderItem={({ item }) => (
                  <TrackCard
                      trackName={item.track}  // Mapping track name
                      artistName={item.artist}  // Mapping artist name
                      albumImg={item.albumImg}  // Mapping album image URL
                      trackId={item.id}
                      onClick={() => console.log(`Play ${item.track}`)}  // Placeholder action for onClick
                  />
              )}
              keyExtractor={(item) => item.id}  // Use the track's id as the key
          />
      )}
  </View>
      );
};

export default PlaylistTracks;
