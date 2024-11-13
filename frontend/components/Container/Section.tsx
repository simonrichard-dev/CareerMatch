// frontend/components/Container/Section.tsx
import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = SafeAreaViewProps & {
  
};
const Section = ({ children, ...rest }: Props) => {
  return (
    <SafeAreaView style={[styles.container]} {...rest}>
      <View style={[styles.containerUI]} />
      <View style={[styles.contain]}>
        {children}
      </View>
    </SafeAreaView>
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
  containerUI: {
    width: "94%",
    height: "87%",
    position: 'absolute',
    bottom: -10,
    backgroundColor: "#fff3e3c7",
    borderRadius: 15,
    shadowOffset: { width: -2, height: 20, },
    shadowColor: "#39393926",
    shadowRadius: 11,
    borderColor: "#ffa61645",
    borderWidth: 4,
  },
  contain: {
    alignItems: 'center',
    flex: 1,
    width: "100%",
  },
});
export default Section;