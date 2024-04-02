import { SafeAreaView, TouchableOpacity, View, Text, TextInput, ActivityIndicator,  } from 'react-native'
import React, { useState } from 'react'
import { CodeColor } from '../../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../../components/DashboardHeaderSimple';
import tw from 'twrnc';
import { MeetingProvider, useMeeting, useParticipant, MediaStream, RTCView } from "@videosdk.live/react-native-sdk";
import { useNavigation } from '@react-navigation/native';
import { account } from '../../../../../functions/functions';
// import { ActivityIndicator as ActivityIndicatorPaper } from 'react-native-paper';

const JoinButton: React.FC<{value: any, onPress: any, loading?: boolean}> = ({ value, onPress, loading }) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: CodeColor.code1,
                padding: 12,
                marginVertical: 8,
                borderRadius: 6,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={onPress}
        >
            {loading && (
                <ActivityIndicator color='#FFF' size={20} style={{ marginRight: 8 }} />
            )}
            <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>{value}</Text>
        </TouchableOpacity>
    );
}

const JoinScreen: React.FC<{getMeetingId: (a?:any)=>void, setMode: (a:string)=>void, loading: boolean}> = ({ getMeetingId, setMode, loading }) => {

    const navigation = useNavigation()
    const [meetingVal, setMeetingVal] = useState("");

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#000",
                justifyContent: "center",
                paddingHorizontal: 6,
            }}
        >
            <DashboardHeaderSimple navigation={navigation} title={''} fontSize={'text-xl'} />

            <View style={tw`flex-1 justify-center px-10`}>
                {/* @ts-ignore */}
                {account == 'admin' && (
                    <>
                        <JoinButton
                            onPress={() => {
                                getMeetingId();
                            }}
                            value="Create Meeting"
                            loading={loading}
                        />

                        <Text
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
                    </>
                )}
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
                        fontStyle: "italic",
                        color: "white",
                        marginBottom: 16,
                    }}
                />
                <JoinButton
                    onPress={() => {
                        getMeetingId(meetingVal);
                    }}
                    value="Join Meeting"
                />
                {/* <JoinButton
                    onPress={() => {
                        setMode("VIEWER");
                        getMeetingId(meetingVal);
                    }}
                    value="Join as Viewer"
                /> */}
            </View>
        </SafeAreaView>
    );
}

export default JoinScreen