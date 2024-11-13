// frontend/components/Card.tsx
import { View, StyleSheet, type ViewProps, ImageBackground } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = ViewProps;

const Card = ({ style, children, ...rest }: Props) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
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
    paddingTop: hp('3%'),
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: '#ffe8c9',
    borderWidth: 3,
    borderTopWidth: 5,
    borderTopColor: '#eda621',
    shadowColor: '#89878780',
    shadowOffset: {width: -5, height: 9},
    shadowRadius: 12,
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
