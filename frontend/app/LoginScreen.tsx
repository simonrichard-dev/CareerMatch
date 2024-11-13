// frontend/app/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Card, { CardFooter } from '@/components/Card';
import { Email, Password } from '@/components/Fields';
import Button from '@/components/Button';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import { toastError } from '@/services/toast';


type NavigationProp = StackNavigationProp<{
  RegisterScreen: any;
  HomeScreen: any;
  ProfilScreen: any;
  LoginScreen: any;
}>;

export default function LoginScreen() {
  const { saveToken } = useAuthToken();
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleLogin() {
    if (email == '' || password == '') {
      toastError("Veuillez remplir tous les champs");
      return;
    }

    axiosPost('/auth/login/', {
      email: email,
      password: password,
    }).then((response) => {
      
      if (response.error) {
        if (response.status == 401) {
          toastError("Identifiants incorrects...");
        }
        else {
          toastError(response.error);
        }
        return;
      }

      if (response.data.access) {
        saveToken(response.data.access).then(() => {
          loadUser(response.data.access);
        });
      }
    });
  }

  async function loadUser(new_token: string) {
    const response = await axiosGet('/api/users/me/', new_token);
    if (response.error) {
      if (response.status == 401) {
        // Non connecté
        navigation.navigate('LoginScreen');
        return;
      }
      toastError(response.error);
      return;
    }

    if (response.data) {
      if (response.data['profile'] == null) {
        navigation.navigate('ProfilScreen');
      } else {
        navigation.navigate('HomeScreen');
      }
    }
  }

  return (
    <Section>

      {/* Header */}
      <Header>
        <HeaderButton
          title={(<><FontAwesome name="book" size={24} color="white" /> S'inscrire</>)}
          onPress={() => {
            navigation.navigate('RegisterScreen');
          }}
        />
      </Header>

      {/* Body */}
      <Card>
        <Title title='Connexion' />
        <Email variant="field1" color="field1" value={email} setValue={setEmail} />
        <Password variant="field1" color="field1" value={password} setValue={setPassword} />
      </Card>

      {/* Footer */}
      <CardFooter>
        <Button
          title="SE CONNECTER"
          onPress={() => handleLogin()}
          variant="button"
          color="button"
        />
      </CardFooter>

    </Section>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});
