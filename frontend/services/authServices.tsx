import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.11:8000/'; // Remplacez par l'URL de votre API.

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
      email,
      password,
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Une erreur inattendue s\'est produite.');
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Impossible de se connecter pour l'instant.";
    throw new Error(message);
  }
};

export const fetchUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des données utilisateur.');
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Impossible de récupérer les informations.";
    throw new Error(message);
  }
};
