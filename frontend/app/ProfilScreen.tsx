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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { axiosPost, axiosGet } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';

type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
  ChoiceScreen: any;
}>;

export default function PersonalInfoScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const { token, state } = useAuthToken();

  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [state, token]);

  // Fonction pour charger les informations de l'utilisateur
  useEffect(() => {
    if (!token) return;
    const loadUserData = async () => {
      try {
        const response = await axiosGet('/api/users/me', token);
        if (response && response.data && response.data.profile) {
          setFirstName(response.data.profile.first_name || '');
          setLastName(response.data.profile.last_name || '');
          // setAddress(response.data.address || '');
          // setPostalCode(response.data.postalCode || '');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      }
    };
    loadUserData();
  }, [token]);

  function handleRegisterProfile() {
    axiosPost('/auth/profile/', {
      'first_name': firstName,
      'last_name': lastName,
      'address': address,
      'zip_code': postalCode,
      'user_goal_type': 1,
    }, token).then((response) => {
      if (response) {
        navigation.navigate('ChoiceScreen');
      }
    });
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
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <ThemedText variant="button" color="button">Retour</ThemedText>
        </TouchableOpacity>
      </Row>

      {/* Body */}
      <Card style={[styles.card]}>
        <Row style={[styles.title, { backgroundColor: colors.tint }]}>
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
      </Card>

      {/* Footer */}
      <Card>
        <Button
          title="CONTINUER"
          onPress={() => handleRegisterProfile()}
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
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    padding: hp('1.5%'),
    backgroundColor: "#FFFFFF",
    width: wp('85%'),
  },
  card: {
    backgroundColor: "#FFF",
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
    color: '#FFFFFF',
  },
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
});
