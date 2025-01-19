// frontend/components/Container/Header.tsx
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';

import HeaderButton from './HeaderButton';

type NavigationProp = StackNavigationProp<{
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
            {page != 'home' && (
                <HeaderButton
                    title={(<><Fontisto name="home" size={20} color="white" /> Home</>)}
                    onPress={() => navigation.navigate('HomeScreen')}
                />
            )}
            {page != 'profil' && (
                <HeaderButton
                    title={(<><FontAwesome name="user" size={20} color="white" /> Profil</>)}
                    onPress={() => navigation.navigate('ProfilScreen')}
                />
            )}
           {page != 'like' && (
                <HeaderButton
                    title={(<><AntDesign name="like1" size={20} color="white" /> Liked</>)}
                    onPress={() => navigation.navigate('LikeScreen')}
                />
            )}
          
        </>
    );
};

export default Navbar;
