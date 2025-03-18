import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch playlists from Flask backend
        axios.get('/playlist/playlists')
            .then(response => {
                setPlaylists(response.data.items);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
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
