// frontend/components/Card.tsx
import { View, ViewStyle, type ViewProps } from "react-native";

type Props = ViewProps;

const Card = ({ style, ...rest }: Props) => (
  <View style={[style, styles]} {...rest} />
);

const styles: ViewStyle = {
  alignItems: 'center',
  justifyContent: "space-between",
  gap: 10,
  padding: 10,
  width: "auto",
};

export default Card;
