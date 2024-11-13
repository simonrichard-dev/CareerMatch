// frontend/app/screens/LikeScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Card, { CardFooter } from '@/components/Card';
import { Colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { axiosPost, axiosGet, axiosPut } from '@/services/axios-fetch';
import useAuthToken from '@/hooks/useAuthToken';
import Header from '@/components/Container/Header';
import Title from '@/components/Title';
import Section from '@/components/Container/Section';
import { Text } from '@/components/Fields';
import { toastError, toastSuccess } from '@/services/toast';
import Navbar from '@/components/Container/NavBar';
import ThemedText from '@/components/ThemedText';
import MatchLine from '@/components/MatchLine';


type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  HomeScreen: any;
  CreateProposalScreen: any;
}>;

export default function LikeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, state, permUserProfile } = useAuthToken();

  const [tabSelected, setTabSelected] = useState<1 | 2>(1);

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesReceived, setMatchesReceived] = useState<MatchData[]>([]);

  // Permissions
  useEffect(() => {
    if (state == "loaded") {
      if (token == null) {
        navigation.navigate('LoginScreen');
      }

      permUserProfile();
    }
  }, [state, token]);

  useEffect(() => {
    if (!token) return;

    const loadUserMatches = async () => {
      const response = await axiosGet('/api/users/me/matches', token);
      if (response.error) {
        if (response.status == 401) {
          // Non connecté
          navigation.navigate('LoginScreen');
          return;
        }
        toastError("Erreur lors du chargement des données");
        return;
      }

      if (response.data) {
        setMatches(response.data['matches']);
        setMatchesReceived(response.data['matches_received']);
      }
    };

    loadUserMatches();
  }, [token]);


  function onRemoveMatch(proposalId: number) {
    const removeMatch = async () => {
      const response = await axiosPut(`/api/matching/`, {
        'proposal': proposalId,
        'state': 2
      }, token);
      if (response.error) {
        toastError("Erreur lors de la suppression du match");
        return;
      }
      if (response.data) {
        setMatches(matches.filter((match) => match.proposal.id != proposalId));
      }
    };
    removeMatch();
  }

  function onInteractMatch(proposalId: number, status: number) {
    const interactMatch = async () => {
      const response = await axiosPost(`/api/users/matches/`, {
        'proposal': proposalId,
        'status': status
      }, token);
      if (response.error) {
        toastError("Erreur lors de l'interaction du match");
        return;
      }
    };
    interactMatch();
  }

  return (
    <Section>

      {/* Header */}
      <Header>
        <Navbar page='like' />
      </Header>

      {/* Body */}
      <Card>
        <View style={[styles.tabsHeader,]}>
          <TouchableOpacity
            style={[styles.tabsHeaderElement,]}
            onPress={() => setTabSelected(1)}
          >
            <ThemedText styles={{
              textAlign: 'center',
            }}>Match envoyé</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabsHeaderElement,]}
            onPress={() => setTabSelected(2)}
          >
            <ThemedText styles={{
              textAlign: 'center',
            }}>Match reçu</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabsContainer,]}>
          {tabSelected == 1 && (
            <>
              {matches.length > 0 ? (
                matches.map((match) => (
                  <MatchLine
                    match={match}
                    method="default"
                    onRemoveMatch={onRemoveMatch}
                    onInteractMatch={onInteractMatch}
                    key={match.id}
                  />
                ))
              ) : (
                <ThemedText styles={{ backgroundColor: "#d5d5d5", }}>Aucun match envoyé</ThemedText>
              )}
            </>
          )}

          {tabSelected == 2 && (
            <>
              {matchesReceived.length > 0 ? (
                matchesReceived.map((match) => (
                  <MatchLine
                    match={match}
                    method="received"
                    onRemoveMatch={onRemoveMatch}
                    onInteractMatch={onInteractMatch}
                    key={match.id}
                  />
                ))
              ) : (
                <ThemedText styles={{ backgroundColor: "#d5d5d5", }}>Aucun match reçu</ThemedText>
              )}
            </>
          )}
        </View>
      </Card>

      {/* Footer */}
      <CardFooter>
       
      </CardFooter>
  
    </Section>
  );
}

const styles = StyleSheet.create({
  tabsHeader: {
    flexDirection: 'row',
    width: "100%"
  },
  tabsHeaderElement: {
    flex: 1,
  },
  tabsContainer: {
    width: "100%"
  },
});
