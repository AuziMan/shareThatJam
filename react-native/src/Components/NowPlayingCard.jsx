import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For three-dot menu icon

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
                <View style={styles.controls}>
                  <TouchableOpacity style={styles.buttonControls} onPress={() => console.log('skip-backward Pressed!')}>
                    <Icon name="skip-previous" size="50" />              
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonControls} onPress={() => console.log('pause Pressed!')}>
                    <Icon name="pause-circle" size="65" />              
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonControls} onPress={() => console.log('skip-forward Pressed!')}>
                    <Icon name="skip-next" size="50" />              
                  </TouchableOpacity>
              </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 15,
  },
  controls:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonControls: {
    marginHorizontal: 10,
    borderRadius: 5
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NowPlayingCard;
