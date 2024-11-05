// frontend/app/screens/ProfilScreen.tsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, TextInput, View } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { axiosPost, axiosGet } from '@/services/axios-fetch';

type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
}>;

export default function PersonalInfoScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [pdf, setPdfFile] = useState(null);
  const [video, setVideoFile] = useState(null);

  // Fonction pour charger les informations de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axiosGet('/api/users/me'); //changer /user/profile par le bon chemin
        if (response) {
          setFirstName(response.data.firstName || '');
          setLastName(response.data.lastName || '');
          setAddress(response.data.address || '');
          setPostalCode(response.data.postalCode || '');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      }
    };
    loadUserData();
  }, []);

  // Fonction pour sélectionner un PDF
  const pickPdfFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type === "success") {
      setPdfFile(result.uri);
    }
  };

  // Fonction pour sélectionner une vidéo
  const pickVideoFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });
    if (!result.cancelled) {
      setVideoFile(result.uri);
    }
  };

  function handleRegister() {
    axiosPost('/auth/register/', {
      firstName,
      lastName,
      address,
      postalCode,
      pdf: pdf,
      video: video,
    }).then((response) => {
      if (response) {
        navigation.navigate('HomeScreen');
      }
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      {/* Header */}
      <Row style={[styles.header, { backgroundColor: colors.testrouge }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          resizeMode='contain'
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <ThemedText variant="button" color="button">Retour</ThemedText>
        </TouchableOpacity>
      </Row>

      {/* Body */}
      <Card style={[styles.card]}>
        <Row style={[styles.title, { backgroundColor: colors.title1 }]}>
          <ThemedText variant="title2" color="title2">Informations</ThemedText>
        </Row>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor={colors.field1}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          placeholderTextColor={colors.field1}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          placeholderTextColor={colors.field1}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Code Postal"
          placeholderTextColor={colors.field1}
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        {/* Boutons pour joindre un fichier PDF et une vidéo */}
        <View style={styles.fileButtons}>
          <Button title="Joindre un PDF" onPress={pickPdfFile} variant="button" color="button_bg" />
          <Button title="Joindre une vidéo" onPress={pickVideoFile} variant="button" color="button_bg" />
        </View>
      </Card>

      {/* Footer */}
      <Card>
        <Button
          title="CONTINUER"
          onPress={() => handleRegister()}
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
  header: {
    padding: hp('2%'),
    backgroundColor: "#D3D4D5",
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    padding: hp('1.5%'),
    backgroundColor: "#FF0000",
    width: wp('85%'),
  },
  card: {
    backgroundColor: "#00FF00",
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
  input: {
    fontSize: 20,
    lineHeight: 26,
    width: wp('60%'),
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.field1_bg,
    marginBottom: hp('1%'),
  },
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
});
