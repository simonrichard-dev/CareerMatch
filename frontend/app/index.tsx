// frontend/app/index.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, Image } from "react-native";
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Email } from '@/components/Email';
import Password from '@/components/Password';
import Button from '@/components/Button';
import { Row } from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Index() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0000FF' }]}>
      <Row style={[styles.header, { backgroundColor: '#FFFF00' }]}>
        <Image 
          source={require("@/assets/images/logo.png")} 
          resizeMode='contain'
          style={styles.logo} // Utilise le style pour l'image responsive
        />
      </Row>
      <Row style={[styles.title, { backgroundColor: '#00FFFF' }]}>
        <ThemedText variant="title2" color="title2">Créer un compte</ThemedText>
      </Row>
      <Card style={[styles.card]}>
        <Email variant="field1" color="field1" />
        <Password variant="field1" color="field1" />
        <Button
          title="CONTINUER"
          onPress={() => console.log("Bouton cliqué !")}
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
    width: wp('100%'), // Prend 100% de la largeur de l'écran
  },
  header: {
    padding: hp('2%'), // 2% de la hauteur de l'écran pour un padding responsive
    backgroundColor: "#D3D4D5",
    width: wp('80%'), // 80% de la largeur de l'écran pour le header
  },
  title: {
    padding: hp('1.5%'), // 1.5% de la hauteur de l'écran
    backgroundColor: "#FF0000",
    width: wp('90%'), // 90% de la largeur de l'écran pour le titre
  },
  card: {
    backgroundColor: "#00FF00",
    width: wp('85%'), // 85% de la largeur de l'écran pour le Card
    padding: hp('2%'),
    flex: 1,
  },
  logo: {
    width: wp('30%'), // Ajuste la largeur de l'image à 30% de l'écran
    height: hp('15%'), // Ajuste la hauteur de l'image à 10% de l'écran
  },
});
