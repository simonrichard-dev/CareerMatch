// frontend/app/ChoiceScreen2.tsx

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, View, Text, ScrollView } from "react-native";
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
import { Colors } from '@/constants/Colors';

type NavigationProp = StackNavigationProp<{
  ProposalScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function ProposalScreen2() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  const [choice, setChoice] = useState<string | null>(null);
  const { token, state } = useAuthToken();
  const [tags, setTags] = useState<any[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedContract, setSelectedContract] = useState<string[]>([]);


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

  const renderButton = (label: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => (
    <TouchableOpacity
      style={[styles.button, selectedItems.includes(label) && styles.selectedButton]}
      onPress={() => {
        setSelectedItems((prevState) => {
          if (prevState.includes(label)) {
            return prevState.filter(item => item !== label); // Deselect
          }
          return [...prevState, label]; // Select
        });
      }}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container]}>

      {/* Header */}
      <Row style={[styles.header]}>
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
        {/* Job Types */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={{ ...styles.scrollcard, width: "100%" }}>
            <ThemedText variant="title2" color="title2">Métiers</ThemedText>

            {['Backend', 'Frontend', 'Fullstack', 'Web/Mobile', 'Cybersécurité', 'DevOps', 'SRE', 'AR/VR', 'Machine Learning'].map((job) =>
              renderButton(job, selectedJobs, setSelectedJobs)
            )}
          </Card >
          {/* Technologies */}
          <Card style={{ ...styles.scrollcard, width: "100%" }}>
            <ThemedText variant="title2" color="title2">Technologies</ThemedText>
            {['JavaScript', 'Python', 'PHP', 'HTML', 'CSS', 'C#', 'C++', 'Java', 'Ruby', 'TypeScript', 'Node.js', 'Flask', 'Django', 'Vue.js', 'React Native'].map((tech) =>
              renderButton(tech, selectedTechs, setSelectedTechs)
            )}
          </Card>
          {/* Contract Type */}
          <Card style={{ ...styles.scrollcard, width: "100%" }}>
            <ThemedText variant="title2" color="title2">Type de contrat</ThemedText>
            {['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Projet'].map((contract) =>
              renderButton(contract, selectedContract, setSelectedContract)
            )}
          </Card>
        </ScrollView>
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
    padding: hp('2%'),
  },
  card: {
    width: wp('95%'),
    padding: hp('2%'),
    flex: 1,
  },
  scrollcard: {
    backgroundColor: '#F0FF00',

  },
  header: {
    padding: hp('2%'),
    width: wp('85%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  section: {
    marginTop: hp('2%'),
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FF0000',
  },
  button: {
    margin: wp('1%'),
    padding: hp('1.5%'),
    borderRadius: 8,
    backgroundColor: Colors.light.button_bg,
  },
  selectedButton: {
    backgroundColor: '#0bb808',
    opacity: 0.65
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.button,
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
});
