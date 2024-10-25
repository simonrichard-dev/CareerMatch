import { Text, View, ViewStyle, type ViewProps } from "react-native";

type Props = ViewProps

export function Card ({style, ...rest}: Props) {
  return <View style={[style, styles]} {...rest}></View>
}

const styles = {
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: "space-between",
  width: 340,
  margin: 10,
  gap: 10,
  padding: 10,
} satisfies ViewStyle