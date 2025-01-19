// frontend/app/ProfilScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Image, Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card, { CardFooter } from '@/components/Card';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { axiosPost, axiosGet, axiosDelete, API_HOST } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import { Text } from '@/components/Fields';
import { toastError, toastSuccess } from '@/services/toast';
import Navbar from '@/components/Container/Navbar';
import ThemedText from '@/components/ThemedText';
import ProposalLine from '@/components/ProposalLine';
import { ResizeMode, Video } from 'expo-av';
import Loading from '@/components/Loading';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
  CreateProposalScreen: any;
}>;

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, permUser } = useAuthToken();
  const videoRef = useRef<Video>(null);

  const [loading, setLoading] = useState(true);
  const [inUpdate, setInUpdate] = useState(false);
  const [tabSelected, setTabSelected] = useState<1 | 2>(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [proposalDisplayed, setProposalDisplayed] = useState<ProposalData | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [userGoal, setUserGoal] = useState<1 | 2>(1);

  // Permissions
  useEffect(() => {
    setLoading(true);

    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
      permUser();
  
      fetchUserData();
    }
  }, [state, token]);

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

  const fetchUserProposals = async () => {
    if (!token) return;
    const response = await axiosGet('/api/users/me/proposals/', token);
    if (response.error) {
      if (response.status == 401) {
        navigation.navigate('LoginScreen');
        return;
      }
      setProposals([]);
      return;
    }
    if (response.data) {
      console.log("Loaded Proposals", response.data);
      setProposals(response.data);
    }
  };
  
  const fetchUserData = async () => {
    if (!token) return;
  
    setLoading(true);
    const response = await axiosGet('/api/users/me', token);
    if (response.error) {
      if (response.status == 401) {
        // Non connecté
        navigation.navigate('LoginScreen');
        return;
      }
      setLoading(false);
      return;
    }
    if (response.data && response.data.profile) {
      setInUpdate(true);

      setFirstName(response.data.profile.first_name || '');
      setLastName(response.data.profile.last_name || '');
      setAddress(response.data.profile.address || '');
      setPostalCode(response.data.profile.zip_code || '');
      setUserGoal(response.data.profile.user_goal_type || 1);

      await fetchUserProposals();
    }
    setLoading(false);
  };

  function handleRegisterProfile() {
    axiosPost('/auth/profile/', {
      'first_name': firstName,
      'last_name': lastName,
      'address': address,
      'zip_code': postalCode,
      'user_goal_type': userGoal,
    }, token).then((response) => {
      if (response) {
        if (response.error) {
          if (response.status == 401) {
            navigation.navigate('LoginScreen');
            return;
          }
          if (response.status == 400 && response.data) {
            for (const key in response.data) {
              toastError(`[${key}] ${response.data[key]}`);
            }
            return;
          }
          toastError(response.error);
          return;
        }

        if (response.data) {
          toastSuccess("Profil mis à jour avec succès !");

          if (inUpdate) {
            navigation.navigate('HomeScreen');
          }
          else {
            navigation.navigate('CreateProposalScreen');
          }
        }
      }
    });
  }

  function handleContinue() {
    if (tabSelected == 1) {
      return handleRegisterProfile();
    }
    else if (tabSelected == 2 && inUpdate) {
      navigation.navigate('CreateProposalScreen');
      return;
    }
  }

  function onRemoveProposal(proposalId: number) {
    const removeProposal = async () => {
      const response = await axiosDelete(`/api/proposals/${proposalId}/`, token);
      if (response.error) {
        toastError("Erreur lors de la suppression de la proposition");
        return;
      }
      toastSuccess("Proposition supprimée avec succès");
      setProposals(proposals.filter((proposal) => proposal.id != proposalId));
    };
    removeProposal();
  }

  const openProposal = (proposal: ProposalData) => {
    fetchProposal(proposal.id).then(() => {
      setModalVisible(true);
      StatusBar.setHidden(true);
    });
  };
  const closeProposal = () => {
    setModalVisible(false);
    StatusBar.setHidden(false);
  };

  return (
    <Section>

      {/* Header */}
      <Header>
        {inUpdate ? <Navbar page='profil' /> : <></>}
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

      <Card style={[styles.card]}>
        {loading ? <Loading /> : (
        <>
          {inUpdate && (
            <View style={[styles.tabsHeader,]}>
              <TouchableOpacity
                style={[styles.tabsHeaderElement,]}
                onPress={() => setTabSelected(1)}
              >
                <ThemedText styles={{textAlign: 'center'}} variant={tabSelected == 1 ? 'tab_selected' : 'tab'}>
                  Informations
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
                  {userGoal === 1 ? "Mes opportunités" : "Mes CV"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {tabSelected == 1 && (
            <>
            <Title title='Informations' />
            <Text
              style={styles.input}
              placeholder="Prénom"
              value={firstName}
              setValue={setFirstName}
            />
            <Text
              style={styles.input}
              placeholder="Nom"
              value={lastName}
              setValue={setLastName}
            />
            <Text
              style={styles.input}
              placeholder="Adresse"
              value={address}
              setValue={setAddress}
            />
            <Text
              style={styles.input}
              placeholder="Code Postal"
              value={postalCode}
              setValue={setPostalCode}
              keyboardType="numeric"
            />

            <Title title='Quelle recherche ?' />
            <View style={[ styles.goalButtons ]}>
              <Button
                title="Partager une opportunité"
                onPress={() => setUserGoal(1)}
                variant={userGoal === 1 ? "button_selected" : "button"}
                color={userGoal === 1 ? "button_selected" : "button"}
              />
            </View>
            <View style={[ styles.goalButtons ]}>
              <Button
                title="Partager mon CV"
                onPress={() => setUserGoal(2)}
                variant={userGoal === 2 ? "button_selected" : "button"}
                color={userGoal === 2 ? "button_selected" : "button"}
              />
            </View>
            </>
          )}

          {tabSelected == 2 && inUpdate && (
            <View style={[styles.tabsContainer,]}>
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <ProposalLine
                  proposal={proposal}
                  onRemoveProposal={onRemoveProposal}
                  onOpen={openProposal}
                  key={proposal.id}
                />
              ))
            ) : (
              <ThemedText styles={{backgroundColor: "#d5d5d5", width: "85%", margin: "auto"}}>Aucune proposition envoyée</ThemedText>
            )}
            </View>
          )}
        </>
        )}
      </Card>

      {/* Footer */}
      <CardFooter>
        <Button
          title={tabSelected == 1 ? "Continuer" : `Ajouter ${userGoal === 1 ? "une opportunité" : "un CV"}`}
          onPress={() => handleContinue()}
          variant="button"
          color="button"
        />
      </CardFooter>
  
    </Section>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  input: {
    fontSize: 20,
    lineHeight: 26,
    width: wp('60%'),
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.field1_bg,
    marginBottom: hp('1%'),
    color: '#FFFFFF',
  },
  goalButtons: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
  },

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
});
