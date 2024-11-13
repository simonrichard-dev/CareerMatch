// frontend/components/Container/Header.tsx
import React from 'react';
import { StyleSheet, type TextProps } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';

import HeaderButton from './HeaderButton';

type NavigationProp = StackNavigationProp<{
    LoginScreen: any;
    HomeScreen: any;
    ProfilScreen: any;
    LikeScreen: any;
}>;

type Props = {
  page: string
};
const Navbar = ({ page }: Props) => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <>
            {page}
            {page != 'home' && (
                <HeaderButton
                    title={(<><Fontisto name="home" size={24} color="white" /> Home</>)}
                    onPress={() => {
                        navigation.navigate('HomeScreen');
                    }}
                />
            )}
            {page != 'profil' && (
                <HeaderButton
                    title={(<><FontAwesome name="user" size={24} color="white" /> {page}</>)}
                    onPress={() => {
                        navigation.navigate('ProfilScreen');
                    }}
                />
            )}
            {page != 'like' && (
                <HeaderButton
                    title={(<><AntDesign name="like1" size={24} color="white" /> Like</>)}
                    onPress={() => {
                        navigation.navigate('LikeScreen');
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({

});
export default Navbar;
