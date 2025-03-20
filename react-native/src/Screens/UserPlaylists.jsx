import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

import { API_BASE_URL } from '../utils/config';

const UserPlaylists = ({ navigation }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlaylists = async () => {
        try {
            const token = await AsyncStorage.getItem('spotifyAccessToken');
            const response = await axios.get(`${API_BASE_URL}/playlist/playlists`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setPlaylists(response.data.items || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError(error);
            setLoading(false);
        }
    };

    

    useEffect(() => {
        // Update the screen title with the playlist name
        navigation.setOptions({ title: "" });
    });

    // Refresh when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchPlaylists();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Public Playlists</Text>
            <FlatList
                data={playlists}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.playlistButton}
                        onPress={() => {
                            navigation.navigate('PlaylistTracks', { playlistId: item.id, playlistName: item.name });
                            console.log(`Navigate to ${item.id}`);
                        }}
                    >
                        <Text style={styles.playlistText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity
                        style={styles.playlistButton}
                        onPress={() => {
                            navigation.navigate('NewPlaylist');
                        }}>
                <Text>New Playlist</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 46,
        textAlign: 'center'
    },
    playlistButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15 // Adds spacing between buttons

    },
    playlistText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default UserPlaylists;
