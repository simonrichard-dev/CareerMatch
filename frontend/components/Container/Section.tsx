// frontend/components/Container/Section.tsx
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = SafeAreaViewProps & {
  
};
const Section = ({ ...rest }: Props) => {
  return (
    <SafeAreaView style={[styles.container]} {...rest} />
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      width: wp('100%'),
      backgroundColor: "#c9c9c9"
    },
});
export default Section;
