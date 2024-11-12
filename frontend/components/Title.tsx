// frontend/components/Title.tsx
import { type ViewProps, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Row from "./Row";
import ThemedText from "./ThemedText";

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
            fontWeight: "bold"
          }}
        >
          {title}
        </ThemedText>
    </Row>
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
