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

type NavigationProp = StackNavigationProp<{
  RegisterScreen: any;
  HomeScreen: any;
}>;

export default function LoginScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
          <ThemedText variant="button" color="button">S'inscrire</ThemedText>
        </TouchableOpacity>
      </Row>

    {/* Body */}
      <Card style={[styles.card1]}>
        <Row style={[styles.title, { backgroundColor: colors.title1 }]}>
          <ThemedText variant="title2" color="title2">Connexion</ThemedText>
        </Row>
        <Card style={[styles.card2]}>
          <Email variant="field1" color="field1" email={email} setEmail={setEmail} />
          <Password variant="field1" color="field1" password={password} setPassword={setPassword}/> 
        </Card>
      </Card>

    {/* Footer */}
      
      <Card>
        <Button
            title="SE CONNECTER"
            onPress={() => navigation.navigate("HomeScreen")}
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
