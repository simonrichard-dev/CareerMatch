// frontend/components/ThemedText.tsx
import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";

const styles = StyleSheet.create({
  title1: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  title2: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "normal",
    textAlign: "center",
  },
  field1: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "300",
    backgroundColor: Colors.light.field1_bg,
  },
  button: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "bold",
    backgroundColor: Colors.light.button_bg,
  },
});

type Props = TextProps & {
  variant?: keyof typeof styles,
  color?: keyof typeof Colors["light"]
};

const ThemedText = ({ variant = "field1", color = "title1", ...rest }: Props) => {
  const themeColors = useThemeColors();
  return <Text style={[styles[variant], { color: themeColors[color] }]} {...rest} />;
};

export default ThemedText;
