import { Stack } from "expo-router";
import Toast from "react-native-toast-message";


export default function RootLayout() {
  return (
    <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="PersonalInfoScreen" />
      <Stack.Screen name="ModelScreen" />
      <Stack.Screen name="HomeScreen" />
    </Stack>
    <Toast />
    </>
  );
}
