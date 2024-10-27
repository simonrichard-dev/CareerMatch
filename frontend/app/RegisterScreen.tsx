import React from 'react';
import { SafeAreaView, View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Email from "@/components/Email";
import Password from "@/components/Password";
import Row from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Colors } from '@/constants/Colors';
import { Styles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<{
  PersonalInfoScreen: undefined;
}>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>(); // Initialiser la navigation

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.tint }]}>
      <Row style={styles.header}>
        <ThemedText variant="title2" color="title2">Créer un compte</ThemedText>
      </Row>
      <Card style={[styles.card, Styles.field1]}>
        <Email />
        <Password />
        <Button
          title="CONTINUER"
          onPress={() => navigation.navigate("PersonalInfoScreen")} // Navigation vers l'écran suivant
          variant="button"
          color="button_bg"
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
  },
  header: {
    ...Styles.title1,
    padding: 10,
  },
  card: {
    ...Styles.field1,
    padding: 20,
    borderRadius: 8,
  },
});
