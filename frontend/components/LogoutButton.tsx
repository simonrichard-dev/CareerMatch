// frontend/components/LogoutButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

type LogoutButtonProps = {
  onLogout: () => void;
};

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LogoutButton;
