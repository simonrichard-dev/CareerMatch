// frontend/app/screens/ProposalScreen.tsx

import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import Card from '@/components/Card';
import Row from "@/components/Row";
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { axiosGet, axiosPost } from '@/services/axios-fetch';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '@/components/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@/constants/Colors';
import useAuthToken from '@/hooks/useAuthToken';

type NavigationProp = StackNavigationProp<{
  ProfilScreen: any;
  HomeScreen: any;
  RegisterScreen: any;
  LoginScreen: any;
}>;

export default function ProposalScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();

  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedContract, setSelectedContract] = useState<string[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const { token, state } = useAuthToken();

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

  // Handle the button click to store the selected choices
  function handleChoices() {
    const selectedJobIds = tags.filter(tag => selectedJobs.includes(tag.name)).map(tag => tag.id);
    const selectedTechIds = tags.filter(tag => selectedTechs.includes(tag.name)).map(tag => tag.id);
    const selectedContractId = tags.find(tag => selectedContract.includes(tag.name)).map((tag: { id: any; }) => tag.id);

    // Post the data to the server (adjust endpoint if necessary)
    axiosPost('/api/proposals/', {
      'title': "title",
      'description': "description",
      "tags": []
    }).then((response) => {
      if (response) {
        navigation.navigate('HomeScreen');
      }
    }).catch(error => {
      console.error("Erreur lors de l'enregistrement des choix:", error);
    });
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      {/* Header */}

      <Row style={[styles.header, { backgroundColor: colors.testbleu }]}>
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
        
        {/* Job Types */}
        <View style={styles.section}>
          <ThemedText variant="title2" color="title2">Métiers</ThemedText>
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            {['Backend', 'Frontend', 'Fullstack', 'Web/Mobile', 'Cybersécurité', 'DevOps', 'SRE', 'AR/VR', 'Machine Learning'].map((job) =>
              renderButton(job, selectedJobs, setSelectedJobs)
            )}
          </ScrollView>
        </View>

        {/* Technologies */}
        <View style={styles.section}>
          <ThemedText variant="title2" color="title2">Technologies</ThemedText>
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            {['JavaScript', 'Python', 'PHP', 'HTML', 'CSS', 'C#', 'C++', 'Java', 'Ruby', 'TypeScript', 'Node.js', 'Flask', 'Django', 'Vue.js', 'React Native'].map((tech) =>
              renderButton(tech, selectedTechs, setSelectedTechs)
            )}
          </ScrollView>
        </View>

        {/* Contract Type */}
        <View style={styles.section}>
          <ThemedText variant="title2" color="title2">Type de contrat</ThemedText>
          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            {['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Projet'].map((contract) =>
              renderButton(contract, selectedContract, setSelectedContract)
            )}
          </ScrollView>
        </View>

        {/* Footer */}
        <Card>
          <Button
            title="CONFIRMER"
            onPress={handleChoices}
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
    backgroundColor: "#FFF",
    width: wp('85%'),
    padding: hp('2%'),
    flex: 1,
  },
  header: {
    paddingBottom: hp('2%'),
    alignItems: 'center',
  },
  section: {
    marginTop: hp('2%'),
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
