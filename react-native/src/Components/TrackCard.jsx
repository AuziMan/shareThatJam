import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons


const TrackCard = ({ trackName, artistName, albumImg, onClick, trackId, onQueue, onAddToPlaylist }) => {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardContent} onPress={onClick}>
                {/* Image on the left side */}
                <Image
                    source={{ uri: albumImg || 'https://via.placeholder.com/150' }}
                    style={styles.cardImg}
                />
                
                {/* Text in the middle */}
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{trackName}</Text>
                    <Text style={styles.cardText}>{artistName}</Text>
                </View>
            </TouchableOpacity>

            {/* Buttons for Add & Queue */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onQueue(trackId)} style={styles.iconButton}>
                    <Ionicons name="list" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => {
                        // console.log("🎵 Track being added:", trackId);
                        onAddToPlaylist(trackId);}} 
                    style={[styles.iconButton, styles.addButton]}
                >
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        backgroundColor: '#fff',
        marginVertical: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Push text left, buttons right
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, // Android shadow
        height: 80, // Increase height
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Takes up remaining space
    },
    cardImg: {
        width: 60, // Make image smaller
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16, // Make text smaller
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 12,
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        backgroundColor: '#555',
        padding: 8,
        borderRadius: 20,
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: '#1DB954', // Spotify Green for Add button
    },
});

export default TrackCard;
