// DesktopView.tsx
import React from 'react';
import { View, Image, StyleSheet } from "react-native";
import { Video, ResizeMode } from 'expo-av';

export default function DesktopView() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/13290760/pexels-photo-13290760.jpeg' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Video
        source={{ uri: 'https://videos.pexels.com/video-files/9046239/9046239-uhd_1440_2560_24fps.mp4' }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        useNativeControls
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flexDirection: 'row', width: '100%', height: '100%' },
  image: { width: '50%', height: '100%' },
  video: { width: '50%', height: '100%' },
});
