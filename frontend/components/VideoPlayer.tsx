import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, View, StatusBar, FlatList, Dimensions } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const videoRef = useRef<Video>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    { type: 'image', uri: 'https://images.pexels.com/photos/13290760/pexels-photo-13290760.jpeg' },
    { type: 'video', uri: 'https://videos.pexels.com/video-files/9046239/9046239-uhd_1440_2560_24fps.mp4' }
  ];

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    const index = viewableItems[0]?.index || 0;
    setCurrentIndex(index);

    // Masquer la barre d'état lorsque la vidéo est visible
    if (index === 1) {
      StatusBar.setHidden(true);
      videoRef.current?.playAsync();
    } else {
      StatusBar.setHidden(false);
      videoRef.current?.pauseAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.uri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: item.uri }}
                style={styles.fullScreenVideo}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={currentIndex === 1}
                useNativeControls
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded && status.didJustFinish) {
                    videoRef.current?.stopAsync();
                    setCurrentIndex(0); // Retourner à l'image après la fin de la vidéo
                  }
                }}
              />
            )}
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center'
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
