// frontend/components/MatchLine.tsx
import { useState } from "react";
import { type ViewProps, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import ThemedText from "./ThemedText";
import LineBreak from "./LineBreak";


interface Props extends ViewProps {
  match: MatchData;
  method?: "default" | "received";
  onOpen: (match: MatchData) => void;
  onRemoveMatch: (proposalId: number) => void;
  onInteractMatch: (matchId: number, status: number) => void;
};

const MatchLine = ({ match, method = "default", onOpen, onRemoveMatch, onInteractMatch, style, ...rest }: Props) => {
  const [status, setStatus] = useState(match.status);

  function onLike() {
    if (method != "received") return;
    setStatus(2);
    onInteractMatch(match.id, 2);
  }

  function onDislike() {
    if (method != "received") return;
    setStatus(3);
    onInteractMatch(match.id, 3);
  }

  function onRemove() {
    if (method != "default") return;
    onRemoveMatch(match.proposal.id);
  }

  return (
    <TouchableOpacity
      onPress={() => onOpen(match)}
    >
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
          <View
            style={{
              position: 'absolute',
              left: -75
            }}
          >
            {match.proposal.type == 1 ? (
              <MaterialIcons
                name="announcement"
                size={50}
                color={
                  status == 1 ? (
                    "#a7a7a7"
                  ) : status == 2 ? (
                    "#d5d5d5"
                  ) : (
                    "#d5d5d5"
                  )
                }
              />
            ) : (
              <MaterialIcons
                name="announcement"
                size={50}
                color="black"
              />
            )}
            <Text style={{
              textAlign: "center",
              fontSize: 18,
              color: status == 1 ? (
                  "#a7a7a7"
                ) : status == 2 ? (
                  "#d5d5d5"
                ) : (
                  "#d5d5d5"
                )
            }}>#{match.id}</Text>
          </View>
          <View style={[styles.lineTags]}>
            {match.proposal.tags.map((tag) => (
              <ThemedText
                key={tag.id} variant="tag"
              >
                {tag.name}
              </ThemedText>
            ))}
          </View>
          <ThemedText variant="text" styles={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <View>
              {method == "received" ? (
                <>{match.user.profile?.first_name} {match.user.profile?.last_name}</>
              ) : (
                <>{match.proposal.author.profile.first_name} {match.proposal.author.profile.last_name}</>
              )}
            </View>
            {status == 2 && (
              <>
              <LineBreak />
              <View>
                <AntDesign name="contacts" size={24} color="#b68200" />
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 20,
                    color: "#d29600",
                  }}
                >
                  {method == "received" ? (
                    <>{match.user.email}</>
                  ) : (
                    <>{match.proposal.author.email}</>
                  )}
                </Text>
              </View>
              </>
            )}
          </ThemedText>
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
                  <AntDesign name="closecircle" size={30} color="white" style={{ flex: 1, width: "100%" }} />
                </TouchableOpacity>
              </>
            )}
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