// frontend/components/Password.tsx

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextProps } from 'react-native';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";

type Props = TextProps & {
  variant?: keyof typeof Styles,
  color?: keyof typeof Colors["light"]
}

const Password = ({ variant = "field1", color = "field1_bg", ...rest }: Props) => {
  const [password, setPassword] = useState<string>('');
  const themeColors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: themeColors[color] }]}>
      <TextInput
        style={[styles.input, 
          Styles[variant], 
          { color: themeColors.field1 }]}
        placeholder="Mot de passe"
        placeholderTextColor={themeColors.field1}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    height: 52,
    borderRadius: 12,
  },
  input: {
    width: 340,
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

export default Password;
