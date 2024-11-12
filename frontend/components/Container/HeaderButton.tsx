// frontend/components/Container/HeaderButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, type TextProps } from 'react-native';

import ThemedText from '../ThemedText';


type Props = TextProps & {
  title: string;
  onPress: () => void;
};
const HeaderButton = ({ title, onPress }: Props) => {
    return (
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
        >
          <ThemedText variant="button" color="button">{title}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default HeaderButton;
