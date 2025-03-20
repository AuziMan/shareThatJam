import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import NowPlayingCard from '../Components/NowPlayingCard';

const NowPlaying = () => {
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/nowPlaying`);
                setTrack(response.data.length > 0 ? response.data[0] : null);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching now playing:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <ActivityIndicator size="small" color="#fff" />;
    }

    if (error) {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.errorText}>Error fetching track</Text>
            </View>
        );
    }

    if (!track || !track.track || !track.artist || !track.albumImg) {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.noTrackText}>No Track Playing</Text>
            </View>
        );
    }

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nowPlayingContainer}>
                <Image source={{ uri: track.albumImg }} style={styles.albumImage} />
            </TouchableOpacity>

            {/* Now Playing Modal */}
            <NowPlayingCard track={track} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noTrackText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },
    nowPlayingContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        left: "25%",
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: '#1DB954', // Spotify Green
    },
    albumImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
});

export default NowPlaying;
