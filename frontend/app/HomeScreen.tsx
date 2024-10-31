// frontend/app/HomeScreen.tsx


import React from 'react';
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, View, ScrollView, Text } from "react-native";
import Card from '@/components/Card';
import ThemedText from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import Button from '@/components/Button';
import Row from "@/components/Row";
import Player from '@/components/Player';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';


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

      { Platform.OS === 'android' ? (
          <Card>
            <Player/>
          </Card>
        ) : ( 
          <Card>
            <TouchableOpacity onPress={() => Linking.openURL('/assets/CV/CV_01.jpg')} style={styles.card}>
              <ThemedText>Voir CV en jpg</ThemedText>
            </TouchableOpacity>  
          </Card>
        )
      }

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
    alignItems:'center',
    backgroundColor:'#00FFFF'
  },
  body: {
    flex: 1,
    // width: wp('100%'),
    backgroundColor:'#00FF00'
  },
  horizontalLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalLayout: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: "#AAAAAA",
    padding: hp('2%'),
    flex: 1,
    marginBottom: hp('2%'),
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
