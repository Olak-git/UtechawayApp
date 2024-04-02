import { Clipboard, FlatList, SafeAreaView, StyleSheet, Text, Alert, TextInput, TouchableOpacity, View, Platform } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'

import { MeetingProvider } from "@videosdk.live/react-native-sdk";
import { createMeeting } from "../../../../components/ApiVideoSdkLive";
import { useDispatch, useSelector } from 'react-redux';
import JoinScreen from './components/JoinScreen';
import Container from './components/Container';


interface VideoSdkLiveProps {
    navigation: any
}
const VideoSdkLive: React.FC<VideoSdkLiveProps> = ({ navigation }) => {

    const authToken = useSelector((state: any) => state.videosdk.token)

    const [meetingId, setMeetingId] = useState(null);

    //State to handle the mode of the participant i.e. CONFERNCE or VIEWER
    const [mode, setMode] = useState("CONFERENCE");
  
    //Getting MeetingId from the API we created earlier
    const getMeetingAndToken = async (id: any) => {
        // console.log('authToken: ', authToken)
        const meetingId = id == null ? await createMeeting({ token: authToken }) : id;
        setMeetingId(meetingId);
    };
  
    return authToken && meetingId ? (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: "Ahmed",
                //These will be the mode of the participant CONFERENCE or VIEWER
                // @ts-ignore
                mode: mode,
            }}
            token={authToken}
        >
            <Container navigation={navigation} setMeetingId={setMeetingId} />
        </MeetingProvider>
    ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} navigation={navigation} />
    );
}

export default VideoSdkLive

const styles = StyleSheet.create({})