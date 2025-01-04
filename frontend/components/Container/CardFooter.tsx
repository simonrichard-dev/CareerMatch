import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type CardFooterProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
