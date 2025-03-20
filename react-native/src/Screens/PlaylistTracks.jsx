import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';
import TrackCard from '../Components/TrackCard';

const PlaylistTracks = ({ route, navigation }) => {
    const { playlistId, setPlaylistId } = route.params;  // Receive playlistId and playlistName from navigation
    const [playlistTracks, setplaylistTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
          {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{playlistName}</Text> */}
          <FlatList
            data={playlistTracks}  // Using the correctly fetched topTracks array
            renderItem={({ item }) => (
              <TrackCard
                trackName={item.track}  // Mapping track name
                artistName={item.artist}  // Mapping artist name
                albumImg={item.albumImg}  // Mapping album image URL
                onClick={() => console.log(`Play ${item.track}`)}  // Placeholder action for onClick
              />
            )}
            keyExtractor={(item) => item.id}  // Use the track's id as the key
          />
        </View>
      );
};

export default PlaylistTracks;
