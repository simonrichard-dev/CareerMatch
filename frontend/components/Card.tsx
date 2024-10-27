// frontend/components/Card.tsx
import { View, ViewStyle, type ViewProps } from "react-native";

type Props = ViewProps;

const Card = ({ style, ...rest }: Props) => (
  <View style={[style, styles]} {...rest} />
);

const styles: ViewStyle = {
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: "space-between",
  width: 340,
  margin: 10,
  gap: 10,
  padding: 10,
};

export default Card;
