// frontend/app/HomeScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Image, TouchableOpacity, Modal, View, StatusBar, ScrollView, Dimensions, Platform } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import Button from '@/components/Button';
import { Video, ResizeMode } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuthToken from '@/hooks/useAuthToken';
import { API_HOST, axiosGet, axiosPost } from '@/services/axios-fetch';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Section from '@/components/Container/Section';

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
  proposal_imgs_files: string[];
}

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  LoginScreen: any;
}>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state } = useAuthToken();

  const [inMatch, setInMatch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [index, setIndex] = useState(0);
  const [proposalDisplayed, setProposalDisplayed] = useState<ProposalData | null>(null);
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
    console.log('Loading proposals...');
    try {
      const response = await axiosGet('/api/matching/', token);
      if (response?.data) {
        const new_proposals = response.data['matching'] as ProposalData[];
        console.log('NEW Matching list:', new_proposals);
        setProposals(new_proposals);
        setIndex(0);
        if (new_proposals.length > 0) {
          setProposalDisplayed(new_proposals[0]);
        }
        else {
          setProposalDisplayed(null);
        }
      } else {
        console.log('Aucune donnée trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }

  async function postProposal(state: number) {
    if (!token || !proposalDisplayed) return;
    await axiosPost('/api/matching/', {
      'proposal': proposalDisplayed.id,
      'state': state
    }, token);
  }

  function nextProposal() {
    if (index == proposals.length - 1) {
      setProposalDisplayed(null);
      loadProposals();
      return;
    }

    const newIndex = (index + 1) % proposals.length;
    setIndex(newIndex);
    setProposalDisplayed(proposals[newIndex]);
  }

  function onMatch() {
    if (inMatch) return;
    setInMatch(true);

    postProposal(1).then(() => {
      nextProposal();
      setInMatch(false);
    })
  }

  function onUnMatch() {
    if (inMatch) return;
    setInMatch(true);

    postProposal(2).then(() => {
      nextProposal();
      setInMatch(false);
    })
  }


  return (
    <Section>
      {/* Header */}
      <Header
        btns={(
          <>
            <HeaderButton title='Profile' onPress={() => {
              navigation.navigate('ProfilScreen');
            }} />
          </>
        )}
      />

      {proposalDisplayed ? (
        <>
        {Platform.OS === 'android' || Platform.OS === 'ios' ? (
          <>
          <TouchableOpacity onPress={openModal}>
            <Image
              // {API_HOST}/media/proposals/imgs/CV_-_Simon_RICHARD_0.jpg
              // {API_HOST}{proposals[0].proposal_imgs_files[0]}
              source={{ uri: `${API_HOST}${proposalDisplayed.proposal_imgs_files[0]}` }}
              style={styles.largeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

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

                {/* Image en plein écran */}
                <View style={styles.carouselItem}>
                  <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                    <Image
                      // {API_HOST}/media/proposals/imgs/CV_-_Simon_RICHARD_0.jpg
                      // {API_HOST}{proposals[0].proposal_imgs_files[0]}
                      source={{ uri: `${API_HOST}${proposalDisplayed.proposal_imgs_files[0]}` }}
                      style={styles.fullScreenImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* Vidéo en plein écran */}
                {proposalDisplayed.video_file && (
                  <View style={styles.carouselItem}>
                    <Video
                      ref={videoRef}
                      // {API_HOST}/media/videos/SR_Vidéo.mp4
                      // {API_HOST}{proposals[0].video_file}
                      source={{ uri: `${API_HOST}${proposalDisplayed.video_file}` }}
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
                )}
              </ScrollView>
            </View>
          </Modal>
          </>
        ) : (
          <View>
              <ThemedText>Web platform</ThemedText>
              <Image
                // {API_HOST}/media/proposals/imgs/CV_-_Simon_RICHARD_0.jpg
                // {API_HOST}{proposals[0].proposal_imgs_files[0]}
                source={{ uri: `${API_HOST}${proposalDisplayed.proposal_imgs_files[0]}` }}
                style={styles.largeImage}
                resizeMode="contain"
              />
            </View>
        )}
        </>
      ) : (
        <View style={styles.carouselItem}>
          <ThemedText>No matching yet...</ThemedText>
        </View>
      )}

      {/* Footer */}
      <Card style={styles.footer}>
        <Button
          title="Je Like"
          onPress={() => onMatch()}
          variant="button"
          color="button_bg"
        />
        <Button
          title="Je Dislike"
          onPress={() => onUnMatch()}
          variant="button"
          color="button_bg"
        />
      </Card>
    </Section>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    width: wp('85%'),
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
    marginTop: 10,
    marginBottom: 10,
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