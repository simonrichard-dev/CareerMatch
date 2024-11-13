// frontend/components/Container/Section.tsx
import React from 'react';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = SafeAreaViewProps & {
  
};
const Section = ({ ...rest }: Props) => {
  return (
    <>
    <SafeAreaView style={[styles.container]} {...rest} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: wp('100%'),
    backgroundColor: "#ffe2b9c7",
    borderColor: '#b3b3b3',
    borderWidth: 3,
    borderTopWidth: 5,
    borderTopColor: '#eda621',
  },
});
export default Section;