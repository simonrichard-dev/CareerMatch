// frontend/components/MatchLine.tsx
import { type ViewProps, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import ThemedText from "./ThemedText";


interface Props extends ViewProps {
  proposal: ProposalData;
  onOpen: (proposal: ProposalData) => void;
  onRemoveProposal: (proposalId: number) => void;
};

const ProposalLine = ({ proposal, onOpen, onRemoveProposal, style, ...rest }: Props) => {
  function onRemove() {
    onRemoveProposal(proposal.id);
  }

  return (
    <TouchableOpacity
      onPress={() => onOpen(proposal)}
    >
      <View style={[styles.line]}>

        <View style={[styles.lineLeft]}>
          <View
            style={{
              position: 'absolute',
              left: -75,
              top: -15
            }}
          >
            <MaterialIcons
              name="announcement"
              size={50}
              color="#a7a7a7"
            />
            <Text style={{
              textAlign: "center",
              fontSize: 18,
              color: "#a7a7a7"}}>#{proposal.id}</Text>
          </View>
          <View style={[styles.lineTags]}>
            {proposal.tags.map((tag) => (
              <ThemedText
                key={tag.id} variant="tag"
              >
                {tag.name}
              </ThemedText>
            ))}
          </View>
        </View>

        <View style={[styles.lineRight]}>
          <View style={[styles.interactionBtns]}>
              <TouchableOpacity
                onPress={() => onRemove()}
              >
                <AntDesign name="closecircle" size={30} color="white" style={{ flex: 1, width: "100%" }} />
              </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  line: {
    padding: hp('1.5%'),
    width: "80%",
    margin: "auto",
    marginBottom: hp('1%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: "#c3c3c3",
    borderBottomWidth: 5,
    borderBottomColor: "#c4c4c4",
    borderRadius: 10,
    shadowOffset: {width: 0, height: 5},
    shadowColor: '#b9b9b9',
    backgroundColor: "#d5d5d5",
  },

  lineLeft: {
    flex: 1
  },
  lineRight: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  interactionBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15
  },

  lineTags: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

export default ProposalLine;