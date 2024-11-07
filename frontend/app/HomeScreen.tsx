import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, Modal, View, StatusBar, ScrollView, Dimensions, Platform } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { Video, ResizeMode } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuthToken from '@/hooks/useAuthToken';
import { axiosGet } from '@/services/axios-fetch';

interface ProposalData {
  id: number;
  author: {
    id: number,
    email: string,
    profile: {
      first_name: string,
      last_name: string,
    }
  };
  tags: {
    id: number;
    name: string;
    category: number;
  }[];
  created_at: string;
  proposal_file: string;
  video_file?: string;
}

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  LoginScreen: any;
}>;

export default function HomeScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const { token, state } = useAuthToken();
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef<Video>(null);

  const openModal = () => {
    setModalVisible(true);
    StatusBar.setHidden(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    StatusBar.setHidden(false);
  };

  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
        return;
      }
      loadProposals();
    }
  }, [state, token]);


  async function loadProposals() {
    if (!token) return;
    try {
      const response = await axiosGet('/api/matching/', token);
      if (response?.data) {
        const proposals = response.data as ProposalData[];
        console.log('Donnée trouvée:', response.data);
      } else {
        console.log('Aucune donnée trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      {/* Header */}
      <Row style={[styles.header, { backgroundColor: colors.tint }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          resizeMode='contain'
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfilScreen')}
        >
          <ThemedText variant="button" color="button">Profil</ThemedText>
        </TouchableOpacity>
      </Row>

      {/* Body avec ScrollView pour permettre le défilement */}
      <TouchableOpacity onPress={openModal}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/13290760/pexels-photo-13290760.jpeg' }}
          style={styles.largeImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {Platform.OS === 'android' || Platform.OS === 'ios' ? (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              style={styles.carouselContainer}
              showsHorizontalScrollIndicator={false}
            >
              {/* Carrousel with image and video */}

              {/* Image en plein écran */}
              <View style={styles.carouselItem}>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
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
      ) : (
        <View>
          <ThemedText>Web platform</ThemedText>
        </View>
      )}


      {/* Footer */}
      <Card style={styles.footer}>
        <Button
          title="Je Like"
          onPress={() => console.log("Liked!")}
          variant="button"
          color="button_bg"
        />
        <Button
          title="Je Dislike"
          onPress={() => console.log("Disliked!")}
          variant="button"
          color="button_bg"
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: wp('100%'),
  },
  scrollContainer: {
    alignItems: 'center',
    width: wp('85%'),
  },
  header: {
    padding: hp('2%'),
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  footer: {
    width: wp('85%'),
    height: hp('15%'),
    marginBottom: hp('2%'),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp('1%'),
  },
  button: {
    padding: 10,
    width: 'auto',
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
  largeImage: {
    width: wp('100%'),
    height: hp('60%'),
  },
  video: {
    width: wp('100%'),
    height: hp('40%'),
    marginTop: hp('2%'),
  },
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