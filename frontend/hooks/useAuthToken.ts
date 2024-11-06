// frontend/hooks/useAuthToken.ts

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';

export default function useAuthToken() {
  const [state, setState] = useState<'loading' | 'loaded'>('loading');
  const [token, setToken] = useState<string | null>(null);

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
    try {
      const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
  };

  // Fonction pour supprimer le token
  const deleteToken = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du token :", error);
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
    saveToken,
    deleteToken,
  };
}
