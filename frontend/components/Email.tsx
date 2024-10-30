// frontend/components/Email.tsx
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextProps } from 'react-native';
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { useThemeColors } from '@/hooks/useThemeColors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = TextProps & {
  variant?: keyof typeof Styles,
  color?: keyof typeof Colors["light"],
  email: string,
  setEmail: any
};

const Email = ({ variant = "field1", color = "field1_bg", email, setEmail, ...rest }: Props) => {
  const themeColors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: themeColors[color] }]}>
      <TextInput
        style={[styles.input, Styles[variant], { color: themeColors.field1 }]}
        placeholder="Adresse e-mail"
        placeholderTextColor={themeColors.field1}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('65%'),
    height: 52,
    borderRadius: 12,
  },
  input: {
    width: wp('65%'),
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

export default Email;
