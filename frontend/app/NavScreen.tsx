// frontend/app/screens/LoginScreen.tsx

import React from 'react';
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

type NavigationProp = StackNavigationProp<{
  RegisterScreen: undefined; // ou les paramètres que tu utilises
}>;

export default function LoginScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>(); // Initialiser la navigation

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.testrouge }]}>

      {/* Header */}

      <Row style={[styles.header, { backgroundColor: colors.testbleu}]}>
        <Image 
          source={require("@/assets/images/logo.png")} 
          resizeMode='contain'
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <ThemedText variant="button" color="button">Ne sais pas encore</ThemedText>
        </TouchableOpacity>
      </Row>

    {/* Body */}
      <Card style={[styles.card1]}> {/*Ci dessous, les <Card> peuvent être remplacés par d'autre balises plus appropriée */}
        <Card>Mettre un CV au format PDF</Card>
        <Card>Insérer une vidéo au format MP4</Card>
      </Card>

    {/* Footer */}
      
      <Card>
        <Button
            title="SE CONNECTER"
            onPress={() => console.log("Connected !")}
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
  card1: {
    backgroundColor: "#00FF00",
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  card2: {
    backgroundColor: "#FFFFFF",
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
});
