// frontend/components/CV

import { Platform } from 'react-native';
import React from 'react';
import { StyleSheet, Image, TouchableOpacity, } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Card from '@/components/Card';
import VideoPlayer from '@/components/VideoPlayer';
import ThemedText from '@/components/ThemedText';
import * as Linking from 'expo-linking';


const CV = () => {
  { Platform.OS === 'android' ? (
    <Card>
      <VideoPlayer/>
    </Card>
    ) : ( 
      <Card>
        <TouchableOpacity onPress={() => Linking.openURL('/assets/CV/CV_01.jpg')}>
          <ThemedText>Voir CV en jpg</ThemedText>
        </TouchableOpacity>  
      </Card>
    )
  }
}

export default CV;

import { Video, ResizeMode } from 'expo-av';
resizeMode={ResizeMode.CONTAIN}