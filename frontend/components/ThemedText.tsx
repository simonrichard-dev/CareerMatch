// frontend/components/ThemedText.tsx
import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const stylesText = StyleSheet.create({
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
    padding: 20,
    borderRadius: 15,
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
  button_selected: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "bold",
    backgroundColor: Colors.button_bg_selected,
    padding: 17,
    borderRadius: 15
  },
  tag: {
    fontSize: 15,
    lineHeight: 15,
    backgroundColor: Colors.field1,
    padding: 8,
    borderRadius: 15,
    marginLeft: 2,
    marginBottom: 2
  },
  text: {
    fontSize: 15,
    lineHeight: 15,
    padding: 8,
    borderRadius: 15,
  },
  tab: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "bold",
    padding: 17,
    borderRadius: 2,
    borderColor: Colors.button_bg,
    borderWidth: 3,
    borderTopWidth: 0
  },
  tab_selected: {
    fontSize: 24,
    lineHeight: 22,
    fontWeight: "bold",
    padding: 17,
    borderRadius: 2,
    borderColor: Colors.button_bg,
    borderWidth: 4,
    borderTopWidth: 0,
    backgroundColor: "#d7ffd9"
  },
});

type Props = TextProps & {
  variant?: keyof typeof stylesText,
  color?: keyof typeof Colors,
  styles?: any
};

const ThemedText = ({ variant = "field1", color = "title1", styles = {}, ...rest }: Props) => {
  return (
    <Text
      style={[stylesText[variant], { color: Colors[color] }, styles]}
      {...rest}
    />
  );
};

export default ThemedText;
