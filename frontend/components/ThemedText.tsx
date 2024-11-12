// frontend/components/ThemedText.tsx
import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const stylesTitles = StyleSheet.create({
  title1: {
    fontSize: 28,
    lineHeight: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  title2: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "normal",
    textAlign: "center",
  },
  field1: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "300",
    backgroundColor: Colors.field1_bg,
  },
  button: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "bold",
    backgroundColor: Colors.button_bg,
    padding: 17,
    borderRadius: 15
  },
});

type Props = TextProps & {
  variant?: keyof typeof stylesTitles,
  color?: keyof typeof Colors,
  styles?: any
};

const ThemedText = ({ variant = "field1", color = "title1", styles = {}, ...rest }: Props) => {
  return (
    <Text
      style={[stylesTitles[variant], { color: Colors[color] }, styles]}
      {...rest}
    />
  );
};

export default ThemedText;
