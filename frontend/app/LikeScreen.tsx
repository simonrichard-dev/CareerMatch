// frontend/app/screens/LikeScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card, { CardFooter } from '@/components/Card';
import { axiosPost, axiosGet, axiosPut, API_HOST } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import Section from '@/components/Container/Section';
import { toastError, toastSuccess } from '@/services/toast';
import Navbar from '@/components/Container/Navbar';
import ThemedText from '@/components/ThemedText';
import MatchLine from '@/components/MatchLine';
import { ResizeMode, Video } from 'expo-av';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { useFocusEffect } from '@react-navigation/native';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
}>;
export default function LikeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, permUserProfile } = useAuthToken();
  const videoRef = useRef<Video>(null);

  const [loading, setLoading] = useState(true);
  const [tabSelected, setTabSelected] = useState<1 | 2>(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesReceived, setMatchesReceived] = useState<MatchData[]>([]);

  const [proposalDisplayed, setProposalDisplayed] = useState<ProposalData | null>(null);

  function processLikeScreen() {
    setLoading(true);
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
        return;
      }
      permUserProfile();
      fetchUserMatches();
    }
  }

  // Permissions
  useEffect(() => {
    processLikeScreen();
  }, [state, token]);

  // Fix reload for navigation
  useFocusEffect(
    useCallback(() => {
      processLikeScreen();
    }, [state, token])
  );

  const fetchUserMatches = async () => {
    console.log("Fetching user matches");
    setLoading(true);
    const response = await axiosGet('/api/users/me/matches', token);
    if (response.error) {
      if (response.status == 401) {
        // Non connecté
        navigation.navigate('LoginScreen');
        return;
      }
      toastError("Erreur lors du chargement des données");
      return;
    }

    if (response.data) {
      setMatches(response.data['matches']);
      setMatchesReceived(response.data['matches_received']);
      setLoading(false);
    }
  };

  const fetchProposal = async (proposalId: number) => {
    const response = await axiosGet(`/api/proposals/${proposalId}/`, token);
    if (response.error) {
      toastError(response.error);
      return;
    }
    if (response.data) {
      setProposalDisplayed(response.data);
    }
  };

  function onRemoveMatch(proposalId: number) {
    const removeMatch = async () => {
      const response = await axiosPut(`/api/matching/`, {
        'proposal': proposalId,
        'state': 2
      }, token);
      if (response.error) {
        toastError("Erreur lors de la suppression du match");
        return;
      }
      if (response.data) {
        toastSuccess("Match supprimé avec succès");
        setMatches(matches.filter((match) => match.proposal.id != proposalId));
      }
    };
    removeMatch();
  }

  function onInteractMatch(matchId: number, status: number) {
    const interactMatch = async () => {
      const response = await axiosPost(`/api/users/matches/`, {
        'match': matchId,
        'status': status
      }, token);
      if (response.error) {
        toastError("Erreur lors de l'interaction du match");
        return;
      }
      if (response.data) {
        if (status == 2) {
          toastSuccess("Match accepté avec succès");
        }
        else {
          toastSuccess("Match refusé avec succès");
        }
      }
    };
    interactMatch();
  }

  const openProposal = (match: MatchData, method="default") => {
    if (method == "received") {
      // Load received match
      fetchProposal(match.user.profile?.proposal.id as any).then(() => {
        setModalVisible(true);
        StatusBar.setHidden(true);
      });
    }
    else {
      // Load sent match
      fetchProposal(match.proposal.id).then(() => {
        setModalVisible(true);
        StatusBar.setHidden(true);
      });
    }
  };
  const closeProposal = () => {
    setModalVisible(false);
    StatusBar.setHidden(false);
  };

  return (
    <Section>

      {/* Header */}
      <Header>
        <Navbar page='like' />
      </Header>

      {/* Body */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeProposal}
      >
        {proposalDisplayed && (
          <>
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
                  source={{ uri: `${proposalDisplayed.video_file}` }}
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

            <View style={styles.modalCloseBtn}>
              <Button
                title="Fermer"
                onPress={() => closeProposal()}
                variant="button"
                color="button"
              />
            </View>
          </View>
          </>
        )}
      </Modal>

      <Card>
        {loading ? <Loading /> : (
          <>
            <View style={[styles.tabsHeader,]}>
              <TouchableOpacity
                style={[styles.tabsHeaderElement,]}
                onPress={() => setTabSelected(1)}
              >
                <ThemedText styles={{textAlign: 'center'}} variant={tabSelected == 1 ? 'tab_selected' : 'tab'}>
                  Like envoyé
                  <Text style={{ fontSize: 15, marginLeft: 10 }}>x{matches.length}</Text>
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabsHeaderElement,]}
                onPress={() => setTabSelected(2)}
              >
                <ThemedText styles={{
                  textAlign: 'center',
                  borderLeftWidth: 0,
                }} variant={tabSelected == 2 ? 'tab_selected' : 'tab'} color='title1'>
                  Like reçu
                  <Text style={{ fontSize: 15, marginLeft: 10 }}>x{matchesReceived.length}</Text>
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={[styles.tabsContainer,]}>
              {tabSelected == 1 && (
                <>
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <MatchLine
                        match={match}
                        method="default"
                        onRemoveMatch={onRemoveMatch}
                        onInteractMatch={onInteractMatch}
                        onOpen={openProposal}
                        key={match.id}
                      />
                    ))
                  ) : (
                    <ThemedText styles={{backgroundColor: "#d5d5d5", width: "85%", margin: "auto"}}>Aucun match envoyé</ThemedText>
                  )}
                </>
              )}

              {tabSelected == 2 && (
                <>
                  {matchesReceived.length > 0 ? (
                    matchesReceived.map((match) => (
                      <MatchLine
                        match={match}
                        method="received"
                        onRemoveMatch={onRemoveMatch}
                        onInteractMatch={onInteractMatch}
                        onOpen={openProposal}
                        key={match.id}
                      />
                    ))
                  ) : (
                    <ThemedText styles={{backgroundColor: "#d5d5d5", width: "85%", margin: "auto"}}>Aucun match reçu</ThemedText>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </Card>

      {/* Footer */}
      <CardFooter>
       
      </CardFooter>
  
    </Section>
  );
}

const styles = StyleSheet.create({
  tabsHeader: {
    flexDirection: 'row',
    width: "100%"
  },
  tabsHeaderElement: {
    flex: 1,
  },
  tabsContainer: {
    width: "100%"
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
  },
  largeImage: {
    width: "100%",
    height: hp('100%'),
  },
  video: {
    width: wp('100%'),
    height: hp('40%'),
    marginTop: hp('2%'),
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  modalCloseBtn: {
    position: "absolute",
    bottom: 0,
    left: "50%",
  }
});