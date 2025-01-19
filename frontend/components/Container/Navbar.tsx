// frontend/components/Container/Header.tsx
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import useAuthToken from '@/hooks/useAuthToken';

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
    const {deleteToken } = useAuthToken();

    const handleLogout = () => {
        deleteToken();
        navigation.navigate('LoginScreen');
    };

    return (
        <>
            {/*page != 'like' && */(
                <HeaderButton
                    title={(<><MaterialIcons name="logout" size={24} color="white" /> Logout</>)}
                    onPress={handleLogout}
                    position='left'
                />
             )}  
            {page != 'home' && (
                <HeaderButton
                    title={(<><Fontisto name="home" size={20} color="white" /> Home</>)}
                    onPress={() => navigation.navigate('HomeScreen')}
                    position='right'
                />
            )}
            {page != 'profil' && (
                <HeaderButton
                    title={(<><FontAwesome name="user" size={20} color="white" /> Profil</>)}
                    onPress={() => navigation.navigate('ProfilScreen')}
                    position='right'
                />
            )}
           {page != 'like' && (
                <HeaderButton
                    title={(<><AntDesign name="like1" size={20} color="white" /> Liked</>)}
                    onPress={() => navigation.navigate('LikeScreen')}
                    position='right'

                />
            )}
          
        </>
    );
};

export default Navbar;
