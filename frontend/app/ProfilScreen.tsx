// frontend/app/screens/PersonalInfoScreen.tsx

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<{
  LoginScreen: undefined;
  RegisterScreen: undefined;
}>;

export default function LoginScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState(''); 
  
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
          onPress={() => navigation.navigate("RegisterScreen")}
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
  body: {},
  footer: {},
  button: {
    padding: 10,
    
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
    backgroundColor: Colors.light.field1_bg
  },
});
