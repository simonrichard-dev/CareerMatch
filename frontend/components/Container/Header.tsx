// frontend/components/Container/Header.tsx
import React from 'react';
import { StyleSheet, Image, type TextProps, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Row from '../Row';


type Props = TextProps & {
  children?: JSX.Element;
};
const Header = ({ children }: Props) => {
  return (
    <Row style={[styles.header]}>
      <View style={[styles.headerLeft]}>
        
      </View>
      <View style={[styles.headerCenter]}>
        <View style={[styles.logoBgUI]} />
          <Image
            source={require("@/assets/images/logo.png")}
            resizeMode='contain'
            style={styles.logo}
          />
        </View>
      <View style={[styles.headerRight]}>
        {children}
      </View>
    </Row>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: hp('2%'),
    width: wp('100%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1
  },
  headerCenter: {
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1
  },

  logo: {
    width: wp('30%'),
    height: hp('15%'),
  },
  logoBgUI: {
    backgroundColor: "#fff3e3c7",
    position: "absolute",
    width: wp('25%'),
    height: hp('25%'),
    borderRadius: hp('16%'),
    top: hp('-1%'),
  },
  button: {
    padding: 10,
    width: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});
export default Header;
