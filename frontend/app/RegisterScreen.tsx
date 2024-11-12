// frontend/app/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card from '@/components/Card';
import { Email, Password } from '@/components/Fields';
import Button from '@/components/Button';
import { axiosPost } from '@/services/axios-fetch';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
}>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');


  function handleRegister() {
    axiosPost('/auth/register/', {
      email: email,
      password: password,
    }).then((response) => {
      if (response) {
        navigation.navigate('LoginScreen');
      }
    });
  }

  return (
    <Section>

      {/* Header */}
      <Header
        btns={(
          <>
            <HeaderButton title='Login' onPress={() => {
              navigation.navigate('LoginScreen');
            }} />
          </>
        )}
      />
  
    {/* Body */}
      <Card style={[styles.card]}>
        <Title title='Créer un compte' />
        <Email variant="field1" color="field1" value={email} setValue={setEmail} />
        <Password variant="field1" color="field1" value={password} setValue={setPassword} />        
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
    
    </Section>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  card: {
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
});
