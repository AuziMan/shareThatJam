import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const NowPlayingCard = ({ track, isVisible, onClose }) => {
  if (!track) {
    return (
        <Text style={styles.trackName}>No Track Playing</Text>
    ); 
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <Image source={{ uri: track.albumImg }} style={styles.albumImage} />
              <Text style={styles.trackName}>{track.track}</Text>
              <Text style={styles.artistName}>{track.artist}</Text>
              <TouchableOpacity style={styles.closeButton}>
                <Text style={styles.closeText} onClick={() => console.log(`Next Song`)}>Next</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  trackName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#1DB954', // Spotify green
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NowPlayingCard;
