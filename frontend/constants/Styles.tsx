// frontend/constants/Styles.tsx
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "./Colors";

export const Styles = {
  title1: {
    color: Colors.title1,
    backgroundColor: Colors.tint,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center", 
  },
  title2: {
    color: Colors.title2,
    backgroundColor: Colors.tint,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "normal" as "normal",
    textAlign: "center" as "center",
  },
  field1: {
    color: Colors.field1,
    backgroundColor: Colors.field1_bg,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "300" as "300",
  },
  button: {
    color: Colors.button,
    backgroundColor: Colors.button_bg,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "bold" as "bold",
  },
};
