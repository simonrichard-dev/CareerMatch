import React from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, View, ScrollView } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video } from 'expo-av';
import * as Linking from 'expo-linking';

type NavigationProp = StackNavigationProp<{ LoginScreen: undefined; }>;

export default function HomeScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();

  const isLargeScreen = wp('100%') > 768; // Détection pour un affichage large (ordinateur)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.testrouge }]}>
      {/* Header */}
      <Row style={[styles.header, { backgroundColor: colors.testbleu }]}>
        <Image 
          source={require("@/assets/images/logo.png")} 
          resizeMode='contain'
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <ThemedText variant="button" color="button">Ne sais pas encore</ThemedText>
        </TouchableOpacity>
      </Row>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        <Card style={[styles.body, isLargeScreen ? styles.horizontalLayout : styles.verticalLayout]}>
          <TouchableOpacity onPress={() => Linking.openURL('path/to/your/cv.pdf')} style={styles.card}>
            <ThemedText>Voir CV en PDF</ThemedText>
          </TouchableOpacity>
          <Video
            source={{ uri: 'path/to/your/video.mp4' }}
            style={isLargeScreen ? styles.largeScreenVideo : styles.smallScreenVideo}
            resizeMode="contain"
            useNativeControls
          />
        </Card>
      </ScrollView>

      {/* Footer */}
      <Card style={styles.footer}>
        <Button
          title="Je Like"
          onPress={() => console.log("Connected !")}
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
  bodyContainer: {
    width: wp('85%'),
    flexGrow: 1,
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    width: '100%',
  },
  horizontalLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalLayout: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: hp('2%'),
    flex: 1,
    marginBottom: hp('2%'),
  },
  largeScreenVideo: {
    width: wp('40%'),
    height: hp('30%'),
    backgroundColor: "#000",
  },
  smallScreenVideo: {
    width: wp('85%'),
    height: hp('30%'),
    backgroundColor: "#000",
  },
  footer: {
    width: wp('85%'),
    marginBottom: hp('2%'),
  },
  button: {
    padding: 10,
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
});
