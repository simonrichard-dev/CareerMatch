// frontend/app/CreateProposalScreen.tsx
import * as DocumentPicker from 'expo-document-picker';
import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import Button from '@/components/Button';
import { Colors } from '@/constants/Colors';
import Toast from 'react-native-toast-message';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Section from '@/components/Container/Section';

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  HomeScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function CreateProposalScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state } = useAuthToken();

  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [state, token]);


  const [cvFile, setCvFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await axiosGet('/api/proposals/tags/');
        if (response && response.data) {
          setTags(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tags:", error);
      }
    };

    loadTags();
  }, []);

  function handleChoices() {
    if (!cvFile) {
      Toast.show({
        type: 'error',
        text1: "Veuillez sélectionner un CV.",
      });
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
      if (response) {
        navigation.navigate('HomeScreen');
      }
    }).catch(error => {
      console.error("Erreur lors de l'enregistrement des choix:", error);
    });
  }

  const renderButtonTag = (tag: any) => (
    <TouchableOpacity
      style={[styles.button, selectedTags.includes(tag['id']) && styles.selectedButton]}
      onPress={() => {
        setSelectedTags((prevState) => {
          if (prevState.includes(tag['id'])) {
            return prevState.filter(item => item !== tag['id']);
          }
          return [...prevState, tag['id']];
        });
      }}
    >
      <Text style={styles.buttonText}>{tag['name']}</Text>
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
      <Header
        btns={(
          <>
            <HeaderButton title='Home' onPress={() => {
              navigation.navigate('HomeScreen');
            }} />
          </>
        )}
      />

      {/* Job Types */}
      <ScrollView style={[styles.scrollviewStyle]}>
        <ThemedText variant="title2" color="title2">Métiers</ThemedText>
        {tags.filter(tag => tag['category'] == 1).map((tag) =>
          <Fragment key={tag['id']}>
            {renderButtonTag(tag)}
          </Fragment>
        )}

        {/* Technologies */}
        <ThemedText variant="title2" color="title2">Technologies</ThemedText>
        {tags.filter(tag => tag['category'] == 2).map((tag) =>
          <Fragment key={tag['id']}>
            {renderButtonTag(tag)}
          </Fragment>
        )}

        {/* Contract Type */}
        <ThemedText variant="title2" color="title2">Type de contrat</ThemedText>
        {tags.filter(tag => tag['category'] == 3).map((tag) =>
          <Fragment key={tag['id']}>
            {renderButtonTag(tag)}
          </Fragment>
        )}
      </ScrollView>


      <Button
        title={cvFile ? `${cvFile.name}` : "Sélectionner un CV"}
        onPress={selectCVFile}
        variant="button"
        color="button_bg"
      />

      <Button
        title={videoFile ? `${videoFile.name}` : "Sélectionner une vidéo"}
        onPress={selectVideoFile}
        variant="button"
        color="button_bg"
      />


      {/* Footer */}
      <Card>
        <Button
          title="CONFIRMER"
          onPress={handleChoices}
          variant="button"
          color="button_bg"
        />
      </Card>
    </Section>
  );
}


const styles = StyleSheet.create({
  card: {
    width: wp('95%'),
    padding: hp('2%'),
    flex: 1,
  },
  section: {
    marginTop: hp('2%'),
    width: "85%"
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: "auto",
    marginTop: "1%",
    marginBottom: "1%",
    padding: hp('1.5%'),
    borderRadius: 8,
    backgroundColor: Colors.button_bg,
    width: wp('60%'),
    maxWidth: 340,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#0bb808',
    opacity: 0.65
  },
  buttonText: {
    fontSize: 16,
    color: Colors.button,
  },
  scrollviewStyle: {
    marginTop: hp('2%'),
    width: "85%",
    alignContent: 'center',
    backgroundColor: '#fff',
  }
});

