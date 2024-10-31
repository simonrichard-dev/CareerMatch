// frontend/components/Player.tsx

import React from "react";
import { StyleSheet, ViewProps, View } from "react-native";
import { Video } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = ViewProps & {
  id?: number;
}

export default function Player({id}: Props) {

  const isLargeScreen = wp('100%') > 768;

  return (
    <View>
      <Video
            source={{ uri: 'https://videos.pexels.com/video-files/4920770/4920770-uhd_1440_2732_25fps.mp4' }}
            style={isLargeScreen ? styles.largeScreenVideo : styles.smallScreenVideo}
            resizeMode="contain"
            useNativeControls
          />
    </View>
    )
}

const styles = StyleSheet.create({
  largeScreenVideo: {
    width: wp('40%'),
    height: hp('30%'),
    backgroundColor: "#000",
  },
  smallScreenVideo: {
    width: wp('85%'),
    height: hp('30%'),
    backgroundColor: "#000",
  },
});
