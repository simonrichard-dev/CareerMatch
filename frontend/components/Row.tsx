// frontend/components/Row.tsx
import { View, type ViewProps, type ViewStyle } from "react-native";

type Props = ViewProps & {
  gap?: number;
};

const Row = ({ style, gap, ...rest }: Props) => (
  <View style={[rowStyle, style, gap ? { gap: gap } : undefined]} {...rest} />
);

const rowStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

export default Row;
