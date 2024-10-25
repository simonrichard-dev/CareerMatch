// frontend/app/index.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from "react-native";
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Email } from '@/components/Email';
import Password from '@/components/Password';
import Button from '@/components/Button';

export default function Index() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <ThemedText variant="title1" color="title1">CareerMatch</ThemedText>
      <ThemedText variant="title2" color="title2">Créer un compte</ThemedText>
      <Card>
        <Email variant="field1" color="field1" />
        <Password variant="field1" color="field1" />
        <Button 
          title="CONTINUER" 
          onPress={() => console.log("Bouton cliqué !")} // Fonction à exécuter lors du clic sur le bouton
          variant="button"  // Utiliser le style de bouton défini dans Styles.tsx
          color="button_bg" // Couleur d'arrière-plan selon le thème
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
