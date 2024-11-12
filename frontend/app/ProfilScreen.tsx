// frontend/app/screens/ProfilScreen.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { axiosPost, axiosGet } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import { Text } from '@/components/Fields';

type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
  ChoiceScreen: any;
}>;

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state } = useAuthToken();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [userGoal, setUserGoal] = useState<1 | 2>(1);

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
          setAddress(response.data.profile.address || '');
          setPostalCode(response.data.profile.zip_code || '');
          setUserGoal(response.data.profile.user_goal_type || 1);
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
      'user_goal_type': userGoal,
    }, token).then((response) => {
      if (response) {
        navigation.navigate('ChoiceScreen');
      }
    });
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

      {/* Body */}
      <Card style={[styles.card]}>
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
        <View style={styles.choiceContainer}>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              userGoal === 1 && styles.choiceButtonSelected
            ]}
            onPress={() => setUserGoal(1)}
          >
            <ThemedText variant="button" color="button">Partager une opportunité</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceButton,
              userGoal === 2 && styles.choiceButtonSelected
            ]}
            onPress={() => setUserGoal(2)}
          >
            <ThemedText variant="button" color="button">Partager mon CV</ThemedText>
          </TouchableOpacity>
        </View>

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
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },

  choiceContainer: {
    marginTop: hp('2%'),
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: wp('85%'),
  },
  choiceButton: {
    padding: hp('2%'),
    backgroundColor: "#E5B65E",
    marginVertical: hp('1%'),
    alignItems: 'center',
    borderRadius: 8,
    width: wp('50%'),
  },
  choiceButtonSelected: {
    backgroundColor: "#4CAF50",
  },
});
