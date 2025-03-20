import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';
import TrackCard from '../Components/TrackCard';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/topTracks`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('spotifyAccessToken')}`,
          },
        });
        console.log(response)
        setTopTracks(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

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
      {/* <Text style={{ fontSize: 24, textAlign: 'center',  fontWeight: 'bold', marginBottom: 20 }}>Top Tracks</Text> */}
      <FlatList
        data={topTracks}  // Using the correctly fetched topTracks array
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

export default TopTracks;
