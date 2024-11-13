// frontend/app/HomeScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Image, TouchableOpacity, Modal, View, StatusBar, ScrollView, Dimensions, Platform } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

import Card, { CardFooter } from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import Button from '@/components/Button';
import useAuthToken from '@/hooks/useAuthToken';
import { API_HOST, axiosGet, axiosPost } from '@/services/axios-fetch';
import Header from '@/components/Container/Header';
import Section from '@/components/Container/Section';
import { toastError } from '@/services/toast';
import Navbar from '@/components/Container/Navbar';
import Loading from '@/components/Loading';


type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  LoginScreen: any;
}>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, permUserProfile } = useAuthToken();

  const [loading, setLoading] = useState(true);
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

  // Permissions
  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
        return;
      }
      permUserProfile();
  
      fetchMatching();
    }
  }, [state, token]);

  async function fetchMatching() {
    if (!token) return;

    setLoading(true);
    console.log('Chargement de nouveaux proposals...');

    const response = await axiosGet('/api/matching/', token);
    if (response.error) {
      if (response.status == 401) {
        // Non connecté
        navigation.navigate('LoginScreen');
        return;
      }
      else if (response.status == 403) {
        // Aucun profil de créé
        toastError("Vous n'avez pas accès à cette page");
        navigation.navigate('ProfilScreen');
        return;
      }
      toastError(response.error);
      return;
    }

    if (response.data) {
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
    }
    setLoading(false);
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
      fetchMatching();
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
      <Header>
        <Navbar page='home' />
      </Header>

      {/* Body */}
      <Card>
        {loading ? <Loading /> : (
          <>
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

                    <View style={styles.carouselItem}>
                      <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                        {proposalDisplayed.proposal_imgs_files.map((img, index) => (
                          <Image
                            // {API_HOST}{proposals[0].proposal_imgs_files[0]}
                            source={{ uri: `${API_HOST}${img}` }}
                            style={styles.largeImage}
                            resizeMode="contain"
                            key={index}
                          />
                        ))}
                      </TouchableOpacity>
                    </View>

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
                            if (status.isLoaded && status.didJustFinish) {
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
              <View style={styles.proposalPCView}>
            
                <View style={styles.proposalPCPart}>
                  <ScrollView>
                    <View style={{ width: "100%" }}>
                      {proposalDisplayed.proposal_imgs_files.map((img, index) => (
                        <Image
                          // {API_HOST}{proposals[0].proposal_imgs_files[0]}
                          source={{ uri: `${API_HOST}${img}` }}
                          style={styles.largeImage}
                          resizeMode="contain"
                          key={index}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {proposalDisplayed.video_file && (
                  <View style={styles.proposalPCPart}>
                    <Video
                      ref={videoRef}
                      // {API_HOST}/media/videos/SR_Vidéo.mp4
                      // {API_HOST}{proposals[0].video_file}
                      source={{ uri: `${API_HOST}${proposalDisplayed.video_file}` }}
                      style={styles.fullScreenVideo}
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay
                      onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && status.didJustFinish) {
                          videoRef.current?.stopAsync();
                        }
                      }}
                      onReadyForDisplay={(videoDetails) => {
                        // @ts-ignore: wrong typing
                        const src = videoDetails.srcElement;
                        src.style.width = "100%";
                        src.style.height = "100%";
                      }}
                      useNativeControls
                    />
                  </View>
                )}
              </View>
            )}
            </>
          ) : (
            <View style={styles.carouselItem}>
              <ThemedText>Aucun matching pour le moment...</ThemedText>
            </View>
          )}
          </>
        )}
      </Card>

      {/* Footer */}
      <CardFooter style={styles.footer}>
        {proposalDisplayed && (
          <>
            <Button
              title="Je Like"
              onPress={() => onMatch()}
              variant="button"
              color="button"
            />
            <Button
              title="Je Dislike"
              onPress={() => onUnMatch()}
              variant="button"
              color="button"
            />
          </>
        )}
      </CardFooter>
    </Section>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: wp('85%'),
    height: hp('15%'),
    marginTop: hp('-4%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp('1%'),
  },
  largeImage: {
    width: "100%",
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

  proposalPCView: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
  },
  proposalPCPart: {
    flex: 1,
    width: "50%",
  }
});