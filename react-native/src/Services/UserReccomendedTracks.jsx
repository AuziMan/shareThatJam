import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import TrackCard from '../Components/TrackCard';
import { API_BASE_URL } from '../utils/config';
import AddToPlaylist from './playlist-crud/AddToPlaylist';

const UserRecommendedTracks = ({ playlistId }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/user/recommendations`)
            .then(response => {
                setTracks(response.data);
                // console.log("recommendation", response);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);


    const handleAddToPlaylist = async (trackUri) => {
        console.log(`in handleAddToPlaylist with trackURI: ${trackUri}`)
        console.log(`playist id ${playlistId}`)
        if (!playlistId) {
            Alert.alert("Error", "No playlist selected!");
            return;
        }
        try {
            await AddToPlaylist(playlistId, trackUri);
            Alert.alert("Success", "Track added to playlist!");
        } catch (error) {
            Alert.alert("Error", "Failed to add track.");
        }
    };

    if (loading) return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
        </View>
    );
    if (error) return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Recommended Tracks</Text>
            <FlatList
                data={tracks}
                renderItem={({ item }) => (                    
                        <TrackCard
                            trackName={item.track}
                            artistName={item.artist}
                            albumImg={item.albumImg}
                            trackId={item.id}
                            onClick={() => console.log(`Play ${item.track}`)}
                            onQueue={(id) => console.log(`Queue track: ${id}`)}
                            onAddToPlaylist={handleAddToPlaylist}
                        />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    }
});

export default UserRecommendedTracks;
