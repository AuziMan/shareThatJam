import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const TrackCard = ({ trackName, artistName, albumImg, onClick }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onClick}>
            <View style={styles.cardContent}>
                {/* Image on the left side */}
                <Image
                    source={{ uri: albumImg || 'https://via.placeholder.com/150' }}
                    style={styles.cardImg}
                />
                
                {/* Text on the right side */}
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{trackName}</Text>
                    <Text style={styles.cardText}>{artistName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: '#fff',
        marginVertical: 10,
        overflow: 'hidden', // To make sure the image and content don't overflow the rounded corners
    },
    cardContent: {
        flexDirection: 'row', // Arrange image and text horizontally
        padding: 10,
    },
    cardImg: {
        width: 80,  // You can adjust this size
        height: 80, // Adjust as needed
        borderRadius: 8, // Rounded corners for the image
        marginRight: 10, // Space between image and text
    },
    cardBody: {
        justifyContent: 'center', // Vertically center the text
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 14,
        color: '#555',
    },
});

export default TrackCard;
