import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { CodeColor } from '../../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../../components/DashboardHeaderSimple';
import tw from 'twrnc';

const JoinButton: React.FC<{value: any, onPress: any}> = ({ value, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: CodeColor.code1,
          padding: 12,
          marginVertical: 8,
          borderRadius: 6,
        }}
        onPress={onPress}
      >
        <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
          {value}
        </Text>
      </TouchableOpacity>
    );
}

// Responsible for either schedule new meeting or to join existing meeting as a host or as a viewer.
interface JoinScreenProps {
    getMeetingAndToken: any, 
    setMode: any,
    navigation: any
}
const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingAndToken, setMode, navigation }) => {
    const [meetingVal, setMeetingVal] = useState("");
  
    // const JoinButton = ({ value: any, onPress: any }) => {
    //   return (
    //     <TouchableOpacity
    //       style={{
    //         backgroundColor: "#1178F8",
    //         padding: 12,
    //         marginVertical: 8,
    //         borderRadius: 6,
    //       }}
    //       onPress={onPress}
    //     >
    //       <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
    //         {value}
    //       </Text>
    //     </TouchableOpacity>
    //   );
    // }
    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "black",
                // justifyContent: "center",
                // paddingHorizontal: 6 * 10,
            }}
        >
            <DashboardHeaderSimple navigation={navigation} title={''} fontSize={'text-xl'} />

            <View style={tw`flex-1 justify-center px-10`}>
                <TextInput
                    value={meetingVal}
                    onChangeText={setMeetingVal}
                    placeholder={"XXXX-XXXX-XXXX"}
                    placeholderTextColor={"grey"}
                    style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: "white",
                        borderRadius: 6,
                        color: "white",
                        marginBottom: 16,
                    }}
                />
                <JoinButton
                    onPress={() => {
                        getMeetingAndToken(meetingVal);
                    }}
                    value={"Join as Host"}
                />
                {/* <JoinButton
                    onPress={() => {
                        setMode("VIEWER");
                        getMeetingAndToken(meetingVal);
                    }}
                    value={"Join as Viewer"}
                /> */}

                {/* <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 22,
                        marginVertical: 16,
                        fontStyle: "italic",
                        color: "grey",
                    }}
                >
                ---------- OR ----------
                </Text>
        
                <JoinButton
                    onPress={() => {
                        getMeetingAndToken();
                    }}
                    value={"Create Studio Room"}
                /> */}
            </View>
        </SafeAreaView>
    );
}

export default JoinScreen