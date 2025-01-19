// frontend/components/Container/Header.tsx
import React from 'react';
import { StyleSheet, Image, type TextProps, View, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import Row from '../Row';
import Button from '../Button';
import HeaderButton from './HeaderButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useAuthToken from '@/hooks/useAuthToken';


const LOGO_IMGS = {
  'default': require("@/assets/images/logo.png"),
  'easter_egg': require("@/assets/images/logo_easter_egg.png"),
}

type Props = TextProps & {
  children?: JSX.Element;
};

type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
}>;

const Header = ({ children }: Props) => {
  const [logo, setLogo] = React.useState(LOGO_IMGS.default);
  const [count, setCount] = React.useState(0);
  const navigation = useNavigation<NavigationProp>();
  
  const {deleteToken } = useAuthToken();
  const handleLogout = () => {
    deleteToken();
    navigation.navigate('LoginScreen');
  };

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
        <HeaderButton
          title={(<><MaterialIcons name='logout' size={24} colo="white"/>Logout</>)}
          onPress={handleLogout}
        />
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
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    paddingTop: 20,
  },

  headerCenter: {
    display: "flex",
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
    paddingTop: 20,
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

});
export default Header;