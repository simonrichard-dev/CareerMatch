// frontend/components/Title.tsx
import { type ViewProps, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Row from "./Row";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface Props extends ViewProps {
    title: string;
} ;

const Title = ({ title, style, ...rest }: Props) => {
  return (
    <Row style={[styles.title]}>
      <ThemedText
        variant="title2"
        color="title2"
        styles={{
          fontWeight: "bold",
          borderBottom: `4px solid ${Colors.title2}`,
          paddingBottom: hp('0.8%'),
          paddingLeft: wp('2%'),
          paddingRight: wp('2%'),
        }}
      >
        {title}
      </ThemedText>
    </Row>
  )
};

const SubTitle = ({ title, style, ...rest }: Props) => {
  return (
    <ThemedText
      variant="title2"
      color="title2"
      styles={{
        fontWeight: "bold",
        borderBottom: `2px solid ${Colors.title2}`,
        paddingBottom: hp('0.8%'),
        paddingLeft: wp('2%'),
        paddingRight: wp('2%'),
        marginBottom: hp('1%'),
      }}
    >
      {title}
    </ThemedText>
  )
};

const styles = StyleSheet.create({
  title: {
    padding: hp('1.5%'),
    backgroundColor: "#FFFFFF",
    width: wp('85%'),
  },
});

export default Title;
export {
  SubTitle
}