// frontend/app/CreateProposalScreen.tsx
import * as DocumentPicker from 'expo-document-picker';
import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, TouchableOpacity, Text, ScrollView, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card, { CardFooter } from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import Section from '@/components/Container/Section';
import { toastError, toastSuccess } from '@/services/toast';
import Title, { SubTitle } from '@/components/Title';
import LineBreak from '@/components/LineBreak';
import Navbar from '@/components/Container/Navbar';

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  HomeScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function CreateProposalScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, user, permUserProfile } = useAuthToken();

  const [typeProposal, setTypeProposal] = useState<"CV" | "Offre">("CV");

  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Permissions
  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
      permUserProfile();

      if (user?.profile?.user_goal_type == 1) {
        setTypeProposal("Offre");
      }
    }
  }, [state, token]);

  useEffect(() => {
    const loadTags = async () => {
      const response = await axiosGet('/api/proposals/tags/');
      if (response.error) {
        toastError(response.error);
        return;
      }
      if (response.data) {
        setTags(response.data);
      }
    };

    loadTags();
  }, []);

  function handleChoices() {
    if (!cvFile) {
      toastError(`Veuillez sélectionner un${typeProposal == "Offre" ? "e" : ""} ${typeProposal}.`);
      return;
    }

    let formData = new FormData();
    selectedTags.forEach(tag => {
      formData.append('tags', tag.toString());
    });
    formData.append('proposal_file', cvFile);

    if (videoFile) {
      formData.append('video_file', videoFile);
    }

    axiosPost('/api/proposals/', formData, token, {
      'Content-Type': 'multipart/form-data',
    }).then((response) => {
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
        // TODO: Redirect to proposal page
        toastSuccess("Proposition envoyée avec succès !");
        navigation.navigate('HomeScreen');
      }
    });
  }

  const renderButtonTag = (tag: any) => (
    <TouchableOpacity
      style={[styles.tagButton]}
      onPress={() => {
        setSelectedTags((prevState) => {
          if (prevState.includes(tag['id'])) {
            return prevState.filter(item => item !== tag['id']);
          }
          return [...prevState, tag['id']];
        });
      }}
    >
      <ThemedText
        variant={selectedTags.includes(tag['id']) ? "button_selected" : "button"}
        color={selectedTags.includes(tag['id']) ? "button_selected" : "button"}
        styles={{ fontSize: 16,}}
      >
        {tag['name']}
      </ThemedText>
    </TouchableOpacity>
  );

  async function selectCVFile() {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.output && result.output.length > 0) {
      setCvFile(result.output[0]);
    }
  }

  async function selectVideoFile() {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (result.output && result.output.length > 0) {
      setVideoFile(result.output[0]);
    }
  }

  return (
    <Section>
      {/* Header */}
      <Header>
        <Navbar page='createProposal' />
      </Header>

      {/* Body */}
      <Card>
        <Title title={`Poster un${typeProposal == "Offre" ? "e" : ""} ${typeProposal}`} />

        {/* Job Types */}
        <ScrollView style={[styles.scrollview]}>
          <SubTitle title='Métiers' />
          <View style={[styles.tagButtons]}>
            {tags.filter(tag => tag['category'] == 1).map((tag) =>
              <Fragment key={tag['id']}>
                {renderButtonTag(tag)}
              </Fragment>
            )}
          </View>
          <LineBreak />

          {/* Technologies */}
          <SubTitle title='Technologies' />
          <View style={[styles.tagButtons]}>
            {tags.filter(tag => tag['category'] == 2).map((tag) =>
              <Fragment key={tag['id']}>
                {renderButtonTag(tag)}
              </Fragment>
            )}
          </View>
          <LineBreak />

          {/* Type de contrat */}
          <SubTitle title='Type de contrat' />
          <View style={[styles.tagButtons]}>
            {tags.filter(tag => tag['category'] == 3).map((tag) =>
              <Fragment key={tag['id']}>
                {renderButtonTag(tag)}
              </Fragment>
            )}
          </View>
          <LineBreak />
        </ScrollView>

        <View style={[ styles.filesButtons ]}>
          <Button
            title={cvFile ? `${cvFile.name}` : "Sélectionner un CV"}
            onPress={selectCVFile}
            variant={cvFile ? "button_selected" : "button"}
            color={cvFile ? "button_selected" : "button"}
          />
          <Button
            title={videoFile ? `${videoFile.name}` : "Sélectionner une vidéo"}
            onPress={selectVideoFile}
            variant={videoFile ? "button_selected" : "button"}
            color={videoFile ? "button_selected" : "button"}
          />
        </View>
      </Card>

      {/* Footer */}
      <CardFooter>
        <Button
          title="POSTER"
          onPress={handleChoices}
          variant="button"
          color="button"
        />
      </CardFooter>
    </Section>
  );
}


const styles = StyleSheet.create({
  tagButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tagButton: {
    margin: "1%",
    borderRadius: 8,
    backgroundColor: Colors.button_bg,
    maxWidth: 340,
    alignItems: 'center',
  },
  scrollview: {
    marginTop: hp('2%'),
    width: "85%",
    alignContent: 'center',
  },
  filesButtons: {
    flexDirection: 'row',
  },
});

