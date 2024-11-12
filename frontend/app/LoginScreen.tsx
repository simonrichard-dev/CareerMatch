// frontend/app/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

import Card, { CardFooter } from '@/components/Card';
import { Email, Password } from '@/components/Fields';
import Button from '@/components/Button';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';


type NavigationProp = StackNavigationProp<{
  RegisterScreen: any;
  HomeScreen: any;
  ProfilScreen: any;
}>;

export default function LoginScreen() {
  const { saveToken } = useAuthToken();
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleLogin() {
    axiosPost('/auth/login/', {
      email: email,
      password: password,
    }).then((response) => {
      console.log(response?.data);
      if (response && response.data.access) {

        saveToken(response.data.access).then(() => {
          loadUser(response.data.access);
        });
      }
    });
  }

  async function loadUser(new_token: string) {
    try {
      const response = await axiosGet('/api/users/me/', new_token);
      if (response?.data) {
        console.log('Donnée trouvée:', response.data);
        if (response.data['profile'] == null) {
          navigation.navigate('ProfilScreen');
        } else {
        navigation.navigate('HomeScreen');}
      } else {
        console.log('Aucune donnée trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }

  return (
    <Section>

      {/* Header */}
      <Header
        btns={(
          <>
            <HeaderButton title="S'inscrire" onPress={() => {
              navigation.navigate('RegisterScreen');
            }} />
          </>
        )}
      />

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
          color="button_bg"
        />
      </CardFooter>

    </Section>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});
