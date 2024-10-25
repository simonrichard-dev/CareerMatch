import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Text,
  type TextProps,
  StyleSheet,
 } from "react-native";


export const styles = StyleSheet.create({
  title1: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  title2: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "regular",
    textAlign: "center",
  },
  field1: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "light",
    backgroundColor: '#E5B65E',
  },
  button: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "bold",
    backgroundColor: '#FF0000',
  },
})

type Props = TextProps & {
  variant?: keyof typeof styles,
  color?: keyof typeof Colors["light"]
}

export function ThemedText ({variant, color, ...rest}: Props) {
  const colors = useThemeColors()
  return <Text style={[styles[variant ?? 'field1'], {color: colors[color ?? "title1"]}]} {...rest}/>
}
