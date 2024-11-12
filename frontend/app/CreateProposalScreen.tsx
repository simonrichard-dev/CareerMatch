// frontend/app/CreateProposalScreen.tsx
import * as DocumentPicker from 'expo-document-picker';
import React, { useState, useEffect, Fragment } from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import Card from '@/components/Card';
import Row from "@/components/Row";
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '@/components/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@/constants/Colors';
import Toast from 'react-native-toast-message';
import useAuthToken from '@/hooks/useAuthToken';

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  HomeScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function CreateProposalScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const { token, state } = useAuthToken();

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
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <ThemedText variant="button" color="button">S'inscrire</ThemedText>
        </TouchableOpacity>
      </Row>

      {/* Job Types */}
      <ScrollView style={[styles.scrollviewStyle, { backgroundColor: colors.tint }]}>
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: wp('100%'),
    padding: hp('2%'),
  },
  card: {
    width: wp('95%'),
    padding: hp('2%'),
    flex: 1,
  },

  header: {
    padding: hp('2%'),
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    backgroundColor: Colors.light.button_bg,
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
    color: Colors.light.button,
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
  scrollviewStyle: {
    marginTop: hp('2%'),
    width: "85%",
    alignContent: 'center',
    backgroundColor: 'FF0',
  }
});

