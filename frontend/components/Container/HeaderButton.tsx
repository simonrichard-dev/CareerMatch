// frontend/components/Container/HeaderButton.tsx
import React from 'react';
import { type TextProps } from 'react-native';

import Button from '../Button';


type Props = TextProps & {
  title: string | JSX.Element;
  onPress: () => void;
};
const HeaderButton = ({ title, onPress }: Props) => {
  return (
    <Button title={title} onPress={onPress} variant="button" color="button" />
  );
};
export default HeaderButton;
