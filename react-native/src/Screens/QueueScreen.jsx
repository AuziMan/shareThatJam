import React, { useCallback, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';
import TrackCard from '../Components/TrackCard';
import { useFocusEffect } from '@react-navigation/native';
import { playPlayback } from '../utils/Playback/PlaybackServices';


function shuffleArray(array) {
  const shuffled = [...array]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const QueueScreen = () => {
  const [queueTracks, setQueueTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaybackQueue = useCallback(async () => {
    setLoading(true);
    try {
      const queue = await axios.get(`${API_BASE_URL}/playback/queue`, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('spotifyAccessToken')}`,
        },
      });
      // console.log("Fetched queue:", queue.data);

      const queueIds = queue.data.slice(0, 3).map(track => track.id);

      const uniqueIds = new Set(queueIds);

      if (uniqueIds.size === 3) {
        console.log("loading queue with queue endpoint")
        setQueueTracks(queue.data || []);
      } else {
        console.log("loading with top tracks endpoint")
         const topTracks = await axios.get(`${API_BASE_URL}/user/topTracks`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('spotifyAccessToken')}`,
          },
        });

        const shuffledTracks = shuffleArray(topTracks.data)
        setQueueTracks(shuffledTracks || [])
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching queue:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);


  // Fetch queue every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPlaybackQueue();
    }, [fetchPlaybackQueue])
  );

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
      <FlatList
        data={queueTracks}  
        renderItem={({ item }) => (
          <TrackCard
            trackName={item.track}  
            artistName={item.artist}  
            albumImg={item.albumImg}  
            onClick={() => playPlayback(item.id)}  
          />
        )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    </View>
  );
};

export default QueueScreen;
