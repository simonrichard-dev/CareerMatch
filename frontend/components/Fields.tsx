// frontend/components/Email.tsx
import React from 'react';
import { StyleSheet, TextInput, View, type TextProps } from 'react-native';
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = TextProps & {
  variant?: keyof typeof Styles,
  color?: keyof typeof Colors,
  value: string,
  setValue: any
};

const Email = ({ variant = "field1", color = "field1_bg", value, setValue, ...rest }: Props) => {
  return (
    <View style={[styles.container, { backgroundColor: Colors[color] }]}>
      <TextInput
        style={[styles.input, Styles[variant], { color: Colors.field1 }]}
        placeholder="Adresse e-mail"
        placeholderTextColor={Colors.field1}
        value={value}
        onChangeText={setValue}
        keyboardType="email-address"
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
};

type PropsPassword = TextProps & Props & {
  placeholder?: string
};
const Password = ({
  variant = "field1",
  color = "field1_bg",
  placeholder = "Mot de passe",
  value,
  setValue,
  ...rest
}: PropsPassword) => {
  return (
    <View style={[styles.container, { backgroundColor: Colors[color] }]}>
      <TextInput
        style={[styles.input, Styles[variant], { color: Colors.field1 }]}
        placeholder={placeholder}
        placeholderTextColor={Colors.field1}
        value={value}
        onChangeText={setValue}
        secureTextEntry={true}
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
};

type PropsText = TextProps & Props & {
  placeholder: string
  keyboardType?: any
};
const Text = ({
  placeholder="Text",
  variant = "field1",
  color = "field1_bg",
  value,
  setValue,
  keyboardType = "default",
  ...rest
}: PropsText) => {
  return (
    <TextInput
      style={[styles.input, Styles[variant], { color: Colors.field1 }]}
      placeholder={placeholder}
      placeholderTextColor={Colors.field1}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboardType}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('65%'),
    height: 52,
    borderRadius: 12,
  },
  input: {
    width: wp('65%'),
    height: 52,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

export {
  Email,
  Password,
  Text,
};
