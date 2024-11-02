// frontend/components/MobileView.tsx

import React, { useRef, useState } from 'react';
import { Modal, View, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

type MobileViewProps = {
  visible: boolean;
  onClose: () => void;
};

export default function MobileView({ visible, onClose }: MobileViewProps) {
  const videoRef = useRef<Video>(null);
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          style={styles.carouselContainer}
          showsHorizontalScrollIndicator={false}
        >
          {/* Image en plein écran */}
          <View style={styles.carouselItem}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/13290760/pexels-photo-13290760.jpeg' }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Vidéo en plein écran */}
          <View style={styles.carouselItem}>
            <Video
              ref={videoRef}
              source={{ uri: 'https://videos.pexels.com/video-files/9046239/9046239-uhd_1440_2560_24fps.mp4' }}
              style={styles.fullScreenVideo}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  videoRef.current?.stopAsync();
                }
              }}
              useNativeControls
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  carouselItem: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
});
