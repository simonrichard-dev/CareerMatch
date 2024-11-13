// frontend/components/MatchLine.tsx
import { useState } from "react";
import { type ViewProps, StyleSheet, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';

import ThemedText from "./ThemedText";

interface Props extends ViewProps {
  match: MatchData;
  method?: "default" | "received";
  onRemoveMatch: (proposalId: number) => void;
  onInteractMatch: (proposalId: number, status: number) => void;
};

const MatchLine = ({ match, method = "default", onRemoveMatch, onInteractMatch, style, ...rest }: Props) => {
  const [status, setStatus] = useState(match.status);

  function onLike() {
    if (method != "received") return;
    setStatus(2);
    onInteractMatch(match.proposal.id, 2);
  }

  function onDislike() {
    if (method != "received") return;
    setStatus(3);
    onInteractMatch(match.proposal.id, 3);
  }

  function onRemove() {
    if (method != "default") return;
    onRemoveMatch(match.proposal.id);
  }

  return (
    <View style={[
      styles.line,
      status == 1 ? (
        styles.linePending
      ) : status == 2 ? (
        styles.lineAccepted
      ) : (
        styles.lineRejected
      ),
    ]}>

      <View style={[styles.lineLeft]}>
        <View style={[styles.lineTags]}>
          {match.proposal.tags.map((tag) => (
            <ThemedText
              key={tag.id} variant="tag"
            >
              {tag.name}
            </ThemedText>
          ))}
        </View>
        <ThemedText variant="text">Match #{match.id}</ThemedText>
      </View>

      <View style={[styles.lineRight]}>
        <View style={[styles.interactionBtns]}>
          {method == "received" && (
            <>
              {status == 1 && (
                <>
                  <TouchableOpacity
                    onPress={() => onLike()}
                  >
                    <Fontisto name="like" size={30} color="white"
                      style={{ flex: 1, width: "100%" }}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDislike()}
                  >
                  <Fontisto name="dislike" size={30} color="white"
                    style={{ flex: 1, width: "100%" }}/>
                  </TouchableOpacity>
                </>
              )}
              {status == 2 && (
                <Fontisto name="like" size={30} color="green"
                  style={{ flex: 1, width: "100%" }}/>
              )}
              {status == 3 && (
                <Fontisto name="dislike" size={30} color="red"
                  style={{ flex: 1, width: "100%" }}/>
              )}
            </>
          )}
          
          {method == "default" && (
            <>
              <TouchableOpacity
                onPress={() => onRemove()}
              >
              <Ionicons name="remove-circle-sharp" size={30} color="white"
                style={{ flex: 1, width: "100%" }}/>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  line: {
    padding: hp('1.5%'),
    width: "100%",
    marginBottom: hp('1%'),
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  linePending: {
    backgroundColor: "#d5d5d5",
  },
  lineAccepted: {
    backgroundColor: "#86ff4d7a",
  },
  lineRejected: {
    backgroundColor: "#ff6b4d63",
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

export default MatchLine;