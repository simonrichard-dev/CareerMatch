// frontend/hooks/useAuthToken.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';

import { axiosGet } from '@/services/axios-fetch';
import { toastError } from '@/services/toast';

const ACCESS_TOKEN_KEY = 'access_token';

type NavigationProp = StackNavigationProp<{
  LoginScreen: any;
  ProfilScreen: any;
}>;

export default function useAuthToken() {
  const navigation = useNavigation<NavigationProp>();

  const [state, setState] = useState<'loading' | 'loaded'>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Fonction pour stocker le token
  const saveToken = async (newToken: string) => {
    try {
      setToken(newToken);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newToken);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du token :", error);
    }
  };

  // Fonction pour récupérer le token
  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    if (storedToken) {
      const response = await fetchUser(storedToken);
      if (response && response.data) {
        setUser(response.data);
        setToken(storedToken);
      }
      else {
        setUser(null);
        setToken(null); // Token invalid
      }
    }
  };

  // Fonction pour supprimer le token
  const deleteToken = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
  };

  const fetchUser = async (token: string) => {
    const response = await axiosGet('/api/users/me', token);
    if (response.status == 401) {
      // Non connecté
      toastError("Session expirée, veuillez vous reconnecter.");
      deleteToken();
      navigation.navigate('LoginScreen');
      return;
    }
    return response;
  };

  const permUser = () => {
    if (!user) {
      toastError("Vous devez être connecté pour accéder à cette page.");
      navigation.navigate('LoginScreen');
    }
  };

  const permUserProfile = () => {
    if (!user || !user.profile) {
      toastError("Vous devez compléter votre profil pour accéder à cette page.");
      navigation.navigate('ProfilScreen');
    }
  };

  // Charger le token au montage du hook
  useEffect(() => {
    loadToken().then(() => {
      setState('loaded');
    });
  }, []);

  return {
    state,
    token,
    user,
    saveToken,
    deleteToken,
    permUser,
    permUserProfile,
  };
}
