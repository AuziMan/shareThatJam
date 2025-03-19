import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import TrackCard from '../Components/TrackCard'; // Ensure this is compatible with React Native

const UserRecommendedTracks = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/user/recommendations')
            .then(response => {
                setTracks(response.data);
                console.log("recommendation", response);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

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
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.trackContainer}>
                        <TrackCard
                            trackName={item.track}  // Assuming `track` is the track name
                            artistName={item.artist}  // Assuming `artist` is the artist name
                            albumImg={item.albumImg}  // Assuming `albumImg` is the album image URL
                            onClick={() => console.log(`Play ${item.track}`)}  // Customize this action
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    trackContainer: {
        marginVertical: 10,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default UserRecommendedTracks;
