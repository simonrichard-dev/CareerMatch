// frontend/components/Container/Header.tsx
import React from 'react';
import { StyleSheet, Image, type TextProps } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Row from '../Row';


type Props = TextProps & {
  btns?: JSX.Element
};
const Header = ({ btns = <></> }: Props) => {
  return (
    <Row style={[styles.header]}>
      <Image
          source={require("@/assets/images/logo.png")}
          resizeMode='contain'
          style={styles.logo}
      />
      {btns}
    </Row>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: hp('2%'),
    width: wp('100%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
  button: {
    padding: 10,
    width: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});
export default Header;
