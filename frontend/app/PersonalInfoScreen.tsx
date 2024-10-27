import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput } from "react-native";
import { useThemeColors } from '@/hooks/useThemeColors';
import Button from "@/components/Button";
import Card from "@/components/Card";
import Row from "@/components/Row";
import ThemedText from "@/components/ThemedText";
import { Styles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<{
  RegisterScreen: undefined;
}>;

export default function PersonalInfoScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NavigationProp>();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header}>
        <ThemedText variant="title2" color="title2">Informations Personnelles</ThemedText>
      </Row>
      <Card style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor={colors.field1}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          placeholderTextColor={colors.field1}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          placeholderTextColor={colors.field1}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Code Postal"
          placeholderTextColor={colors.field1}
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />
      </Card>
      <View style={styles.footer}>
        <Button
          title="Continuer"
          onPress={() => navigation.navigate('RegisterScreen')}
          variant="button"
          color="button_bg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Styles.title1.backgroundColor,
  },
  header: {
    ...Styles.title1,
    padding: 10,
  },
  card: {
    width: '85%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: Styles.field1.backgroundColor,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: Styles.field1.color,
  },
  footer: {
    marginTop: 20,
    width: '85%',
  },
});
