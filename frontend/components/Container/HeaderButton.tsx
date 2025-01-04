// frontend/components/Container/HeaderButton.tsx


import React from 'react';
import { useWindowDimensions, Platform, type TextProps } from 'react-native';

import Button from '../Button';

type Props = TextProps & {
  title: string | JSX.Element;
  onPress: () => void;
};

const HeaderButton = ({ title, onPress }: Props) => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  const shouldHideText = isPortrait || isMobile;

  const adjustedTitle =
    typeof title === 'string'
      ? title
      : (
        <>
          {title.props.children[0] /* L'icône */}
          {!shouldHideText && title.props.children[1] /* Le texte "S'inscrire" */}
        </>
      );

  return <Button title={adjustedTitle} onPress={onPress} variant="button" color="button" />;
};

export default HeaderButton;
