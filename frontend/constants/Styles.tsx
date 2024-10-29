// frontend/constants/Styles.tsx
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "./Colors";

export const Styles = {
  container: {
    flex: 1,
  },
  header: {
    color: Colors.light.title1,
    backgroundColor: Colors.light.testrouge,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center",
  },
  body: {
    color: Colors.light.title1,
    backgroundColor: Colors.light.testvert,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center",
  },
  footer: {
    color: Colors.light.title1,
    backgroundColor: Colors.light.tint,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center",
  },
  title1: {
    color: Colors.light.title1,
    backgroundColor: Colors.light.tint,
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center", 
  },
  title2: {
    color: Colors.light.title2,
    backgroundColor: Colors.light.tint,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "normal" as "normal",
    textAlign: "center" as "center",
  },
  field1: {
    color: Colors.light.field1,
    backgroundColor: Colors.light.field1_bg,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "300" as "300",
  },
  button: {
    color: Colors.light.button,
    backgroundColor: Colors.light.button_bg,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "bold" as "bold",
  },
};
