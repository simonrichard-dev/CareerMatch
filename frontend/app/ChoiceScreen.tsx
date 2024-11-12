// frontend/app/ChoiceScreen.tsx

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { axiosPost } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import HeaderButton from '@/components/Container/HeaderButton';

type NavigationProp = StackNavigationProp<{
  CreateProposalScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
  HomeScreen: any;
}>;

export default function ChoiceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state } = useAuthToken();

  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [state, token]);

  function handleContinue() {
    if (choice) {
      axiosPost('/auth/profile/', { choice })
        .then((response) => {
          console.log(response?.data);
          navigation.navigate('CreateProposalScreen');
        });
    } else {
      console.log("Veuillez faire un choix avant de continuer.");
    }
  }

  return (
    <SafeAreaView style={[styles.container]}>

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
      <Row style={[styles.title]}>
          <ThemedText variant="title2" color="title2">Quelle recherche ?</ThemedText>
        </Row>

        <View style={styles.choiceContainer}>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              choice === 'recherche' && styles.choiceButtonSelected
            ]}
            onPress={() => setChoice('recherche')}
          >
            <ThemedText variant="button" color="button">Partager une opportunité</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceButton,
              choice === 'proposition' && styles.choiceButtonSelected
            ]}
            onPress={() => setChoice('proposition')}
          >
            <ThemedText variant="button" color="button">Partager mon CV</ThemedText>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Footer */}
      <Card>
        <Button
          title="CONTINUER"
          onPress={handleContinue}
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
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    color: '#FFFFFF',
    backgroundColor: '#E5B65E',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "bold" as "bold",
  },
  card: {
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  title: {
    paddingBottom: hp('1%'),
    textAlign: 'center',
    color: '#E5B65E',
    width: wp('85%'),
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
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
});
