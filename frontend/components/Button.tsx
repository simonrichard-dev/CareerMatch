// frontend/components/Button.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, type TextProps } from 'react-native';

import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import ThemedText from './ThemedText';


type Props = TextProps & {
  title: string | JSX.Element;
  onPress: () => void;
  variant?: keyof typeof Styles;
  color?: keyof typeof Colors;
};

const Button = ({ title, onPress, variant = "button", color = "button_bg", ...rest }: Props) => {
  return (
    <TouchableOpacity 
      style={[styles.button]}
      onPress={onPress}
    >
      <ThemedText
        variant={variant}
        color={color}
        styles={[styles.text, rest.style]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    maxWidth: 340,
    height: 59,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 8,
    borderColor: "#fff",
    borderWidth: 3,
    shadowOffset: {width: 0, height: 5},
    shadowColor: '#f19804',

  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Button;
