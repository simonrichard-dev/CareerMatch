// frontend/components/Container/HeaderButton.tsx
import React from 'react';
import { StyleSheet, type TextProps } from 'react-native';

import Button from '../Button';


type Props = TextProps & {
  title: string;
  onPress: () => void;
};
const HeaderButton = ({ title, onPress }: Props) => {
    return (
      <Button title={title} onPress={onPress} variant="button" color="button" />
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
