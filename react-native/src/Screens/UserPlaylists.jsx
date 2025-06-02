import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { getPlaylists } from '../Services/playlist-crud/GetPlaylists'

const UserPlaylists = ({ navigation }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlaylists = async () => {
       const { data, error } = await getPlaylists();
       if(error){
        setError(error)
       } else{
        setPlaylists(data)
       }
       setLoading(false) 
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
                <Text style={styles.playlistText}>New Playlist</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 46,
        textAlign: 'center'
    },
    playlistButton: {
        backgroundColor: '#031D44',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15

    },
    playlistText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default UserPlaylists;
