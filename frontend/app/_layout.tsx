import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="PersonalInfoScreen" />
    </Stack>
  );
}
