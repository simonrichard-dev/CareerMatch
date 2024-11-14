// frontend/app/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Card, { CardFooter } from '@/components/Card';
import { Email, Password } from '@/components/Fields';
import Button from '@/components/Button';
import { axiosPost } from '@/services/axios-fetch';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import LineBreak from '@/components/LineBreak';
import { toastError } from '@/services/toast';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
}>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  function handleRegister() {
    if (email == '' || password == '' || passwordConfirm == '') {
      toastError("Veuillez remplir tous les champs");
      return;
    }
    if (password != passwordConfirm) {
      toastError("Les mots de passe ne correspondent pas");
      return;
    }

    axiosPost('/auth/register/', {
      email: email,
      password: password,
    }).then((response) => {
      if (response.error) {
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
        navigation.navigate('LoginScreen');
      }
    });
  }

  return (
    <Section>

      {/* Header */}
      <Header>
        <HeaderButton
          title={(<><FontAwesome name="book" size={24} color="white" /> Se connecter</>)}
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}
        />
      </Header>
  
      {/* Body */}
      <Card>
        <Title title='Créer un compte' />
        <Email variant="field1" color="field1" value={email} setValue={setEmail} />
        
        <LineBreak />
        
        <Password variant="field1" color="field1" value={password} setValue={setPassword} />
        <Password variant="field1" color="field1" placeholder="Confirmation" value={passwordConfirm} setValue={setPasswordConfirm} />
      </Card>

      {/* Footer */}
      <CardFooter>
        <Button
          title="Continuer"
          onPress={() => handleRegister()}
          variant="button"
          color="button"
        />
      </CardFooter>
    
    </Section>
  );
}