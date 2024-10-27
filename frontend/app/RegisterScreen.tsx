// frontend/app/screens/RegisterScreen.tsx

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

export default function RegisterScreen() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.tint }]}>
      <Row style={styles.header}>
        <ThemedText variant="title2" color="title2">Créer un compte</ThemedText>
      </Row>
      <Card style={[styles.card, Styles.field1]}>
        <Email />
        <Password />
        <Button title="CONTINUER" onPress={() => console.log("Bouton cliqué !")} />
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
    ...Styles.title1, // Utilise le style du titre 1 pour le header
    padding: 10,
  },
  card: {
    ...Styles.field1, // Utilise le style de champ 1 pour le Card
    padding: 20,
    borderRadius: 8,
  },
});
