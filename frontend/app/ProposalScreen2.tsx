// frontend/app/ChoiceScreen.tsx

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';

type NavigationProp = StackNavigationProp<{
  ProposalScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function ChoiceScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [choice, setChoice] = useState<string | null>(null);
  const { token, state } = useAuthToken();
  const [tags, setTags] = useState<any[]>([]);



  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }
    }
  }, [state, token]);

  useEffect(() => {
    // Fetch available tags for jobs, technologies, and contracts
    const loadTags = async () => {
      try {
        const response = await axiosGet('/api/proposals/tags/');
        if (response && response.data) {
          setTags(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tags:", error);
      }
    };

    loadTags();
  }, []);

  function handleContinue() {
    if (choice) {
      axiosPost('/user/choice/', { choice }) // changer le endpoint
        .then((response) => {
          console.log(response?.data);
          navigation.navigate('ProposalScreen');
        });
    } else {
      console.log("Veuillez faire un choix avant de continuer.");
    }
  }

  return (
    <SafeAreaView style={[styles.container, ]}>

      {/* Header */}
      <Row style={[styles.header, ]}>
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
      <Card style={[styles.card]}>
      <Row style={[styles.title, { backgroundColor: colors.title1 }]}>
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
            <ThemedText variant="button" color="button">Rechercher un talent</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceButton,
              choice === 'proposition' && styles.choiceButtonSelected
            ]}
            onPress={() => setChoice('proposition')}
          >
            <ThemedText variant="button" color="button">Proposer son talent</ThemedText>
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
    backgroundColor: "#00FF00",
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
    backgroundColor: '#E5E4E6',
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
    width: wp('60%'),
  },
  choiceButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
});
