import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPlaylists = ({ navigation }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                // Use the full URL for your Flask backend
                const response = await axios.get('http://192.168.0.16:4000/playlist/playlists', {
                    headers: {
                        // Optional: If you're using tokens directly in the React Native app
                        'Authorization': `Bearer ${await AsyncStorage.getItem('spotifyAccessToken')}`
                    }
                });
                
                setPlaylists(response.data.items || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPlaylists();
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
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Public Playlists</Text>
            <FlatList
                data={playlists}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007bff',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 25,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                            }}
                            onPress={() => {
                                // Add navigation to playlist tracks here
                                console.log(`Navigate to ${item.id}`);
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

export default UserPlaylists;
