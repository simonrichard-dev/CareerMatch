// frontend/app/screens/ProfilScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card, { CardFooter } from '@/components/Card';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { axiosPost, axiosGet } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import { Text } from '@/components/Fields';
import { toastError, toastSuccess } from '@/services/toast';
import Navbar from '@/components/Container/NavBar';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
  CreateProposalScreen: any;
}>;

export default function PersonalInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, permUser } = useAuthToken();

  const [inUpdate, setInUpdate] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [userGoal, setUserGoal] = useState<1 | 2>(1);

  // Permissions
  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }

      permUser();
    }
  }, [state, token]);

  useEffect(() => {
    if (!token) return;

    const loadUserData = async () => {
      const response = await axiosGet('/api/users/me', token);
      if (response.error) {
        if (response.status == 401) {
          // Non connecté
          navigation.navigate('LoginScreen');
          return;
        }
        toastError("Erreur lors du chargement des données utilisateur:");
        return;
      }

      if (response.data && response.data.profile) {
        setInUpdate(true);

        setFirstName(response.data.profile.first_name || '');
        setLastName(response.data.profile.last_name || '');
        setAddress(response.data.profile.address || '');
        setPostalCode(response.data.profile.zip_code || '');
        setUserGoal(response.data.profile.user_goal_type || 1);
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

  return (
    <Section>

      {/* Header */}
      <Header>
        {inUpdate && (
          <Navbar page='profil' />
        )}
      </Header>

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
        <View style={[ styles.goalButtons ]}>
          <Button
            title="Partager une opportunité"
            onPress={() => setUserGoal(1)}
            variant={userGoal === 1 ? "button_selected" : "button"}
            color={userGoal === 1 ? "button_selected" : "button"}
          />
          <Button
            title="Partager mon CV"
            onPress={() => setUserGoal(2)}
            variant={userGoal === 2 ? "button_selected" : "button"}
            color={userGoal === 2 ? "button_selected" : "button"}
          />
        </View>

      </Card>

      {/* Footer */}
      <CardFooter>
        <Button
          title="CONTINUER"
          onPress={() => handleRegisterProfile()}
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
  },
});
