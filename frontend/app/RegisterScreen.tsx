// frontend/app/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import Email from '@/components/Email';
import Password from '@/components/Password';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { axiosPost } from '@/services/axios-fetch';

type NavigationProp = StackNavigationProp<{
  ProfilScreen: undefined; // ou les paramètres que tu utilises
  LoginScreen: undefined; // ou les paramètres que tu utilises

}>;

export default function RegisterScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleRegister() {
    axiosPost('/auth/register/', {
      email: email,
      password: password,
    }).then((response) => {
      if (response) {
        navigation.navigate('ProfilScreen');
      }
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>

      {/* Header */}

      <Row style={[styles.header, { backgroundColor: colors.testrouge}]}>
        <Image 
          source={require("@/assets/images/logo.png")} 
          resizeMode='contain'
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <ThemedText variant="button" color="button">Retour</ThemedText>
        </TouchableOpacity>
      </Row>

    {/* Body */}
      <Card style={[styles.card]}>
        <Row style={[styles.title, { backgroundColor: colors.title1 }]}>
          <ThemedText variant="title2" color="title2">Créer un compte</ThemedText>
        </Row>
        <Email variant="field1" color="field1" email={email} setEmail={setEmail} />
        <Password variant="field1" color="field1" password={password} setPassword={setPassword} />        
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
    justifyContent: 'space-between', // Ajoute cet élément pour espacer le logo et le bouton
    flexDirection: 'row', // Assure-toi que les éléments sont alignés horizontalement
  },
  body: {},
  footer: {},
  button: {
    padding: 10, // Ajuste le padding selon tes besoins
    
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
});
