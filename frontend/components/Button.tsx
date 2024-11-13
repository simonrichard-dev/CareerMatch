// frontend/components/Button.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, type TextProps } from 'react-native';
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ThemedText from './ThemedText';


type Props = TextProps & {
  title: string;
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
        styles={[styles.text]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: wp('40%'),
    maxWidth: 340,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 8,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Button;
