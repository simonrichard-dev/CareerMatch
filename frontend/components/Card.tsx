// frontend/components/Card.tsx
import { View, StyleSheet, type ViewProps } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = ViewProps;

const Card = ({ style, ...rest }: Props) => {
  return (
    <View style={[styles.card, style]} {...rest} />
  )
};

const CardFooter = ({ style, ...rest }: Props) => {
  return (
    <View style={[styles.cardFooter, style]} {...rest} />
  )
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 20,
    padding: 10,
    width: wp('85%'),
    flex: 1,
    paddingTop: hp('5%'),
    backgroundColor: "#fff",
    borderRadius: 10
  },
  cardFooter: {
    alignItems: 'center',
    gap: 10,
    padding: 10,
    width: wp('85%'),
  },
});

export default Card;
export {
  CardFooter
}
