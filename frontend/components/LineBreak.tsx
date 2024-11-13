// frontend/components/LineBreak.tsx
import { View } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LineBreak = ({}) => {
  return (
    <View style={{ height: hp('2%') }} />
  )
};
export default LineBreak;