// frontend/components/Container/Header.tsx
import React from 'react';
import { StyleSheet, Image, type TextProps, View, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Row from '../Row';

const LOGO_IMGS = {
  'default': require("@/assets/images/logo.png"),
  'easter_egg': require("@/assets/images/logo_easter_egg.png"),
}


type Props = TextProps & {
  children?: JSX.Element;
};
const Header = ({ children }: Props) => {
  const [logo, setLogo] = React.useState(LOGO_IMGS.default);
  const [count, setCount] = React.useState(0);

  function onclick() {
    if (count === 5) {
      setLogo(LOGO_IMGS.easter_egg);
      setCount(0);
    } else {
      setCount(count + 1);
    }
  }

  return (
    <Row style={[styles.header]}>
      <View style={[styles.headerLeft]}>
        
      </View>
      <View style={[styles.headerCenter]}>
        <View style={[styles.logoBgUI]} />
          <TouchableWithoutFeedback onPress={() => onclick()}>
            <Image
              source={logo}
              resizeMode='contain'
              style={styles.logo}
            />
          </TouchableWithoutFeedback>
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
