// frontend/components/ModelScreen.tsx
import React from "react";
import { SafeAreaView, Text, Image, type TextProps, StyleSheet } from "react-native";
import Card from '@/components/Card';
import { useThemeColors } from "@/hooks/useThemeColors";
import Row from "@/components/Row";
import Button from '@/components/Button';
import { Styles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "@/constants/Colors";

type NavigationProp = StackNavigationProp<{
  PersonalInfoScreen: undefined;
}>;

export default function ModelScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={[Styles.container, { backgroundColor: colors.testbleu }]}>

      {/* Header */}

      <Row style={[Styles.header, { backgroundColor: colors.testrouge }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          resizeMode='contain'
        />
      </Row>

      {/* Body */}
      <Card style={[Styles.body, { backgroundColor: colors.field1_bg }]}>
        <Row style={[Styles.body, { backgroundColor: Colors.light.field1_bg }]}>
          Scotty et Alfred sont amoureux
        </Row>
      </Card>
      <Card>
        <Button
          title="CONTINUER"
          onPress={() => navigation.navigate("PersonalInfoScreen")} // Navigation vers l'écran suivant
          variant="button"
          color="button_bg"
        />
      </Card>

      {/* Footer */}

      <Card>
        <Row style={[Styles.title1, { backgroundColor: colors.title1 }]}>
        </Row>
      </Card>
    </SafeAreaView>
  );
}


