// frontend/components/Button.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, type TextProps } from 'react-native';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = TextProps & {
  title: string;
  onPress: () => void;
  variant?: keyof typeof Styles;
  color?: keyof typeof Colors["light"];
};

const Button = ({ title, onPress, variant = "button", color = "button_bg", ...rest }: Props) => {
  const themeColors = useThemeColors();

  return (
    <TouchableOpacity 
      style={[styles.button, Styles[variant], { backgroundColor: themeColors[color] }]}
      onPress={onPress}
    >
      <Text style={[styles.text, Styles[variant], { backgroundColor: themeColors[color] }]}>{title}</Text>
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
