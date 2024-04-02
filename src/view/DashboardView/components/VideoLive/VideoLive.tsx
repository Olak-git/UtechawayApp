import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { MeetingProvider } from "@videosdk.live/react-native-sdk";
import { useDispatch, useSelector } from 'react-redux';
import { createMeeting } from "../../../../components/ApiVideoSdkLive";
import MeetingView from "./components/MeetingView";
import JoinScreen from "./components/JoinScreen";
import { clearMeeting } from "../../../../feature/meeting.slice";
import { setVideoSdkToken } from '../../../../feature/videosdk.authtoken.slice';
import { fetchUri } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import WebView from "react-native-webview";
import tw from 'twrnc'
import { DashboardHeaderSimple } from "../../../../components/DashboardHeaderSimple";
import { CodeColor } from "../../../../assets/style";

const VideoLive: React.FC<{navigation: any}> = ({navigation}) => {
    
    const dispatch = useDispatch();
    const authToken = useSelector((state: any) => state.videosdk.token)
    const meeting= useSelector((state: any) => state.meeting)
    const { id: meeting_id, shared_screen } = meeting
    const [meetingId, setMeetingId] = useState(null);
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [url, setUrl] = useState('https://utechaway.com/live/agency')
    const user = useSelector((state: any) => state.user.data);

    //State to handle the mode of the participant i.e. CONFERNCE or VIEWER
    const [mode, setMode] = useState("CONFERENCE");
  
    //Getting MeetingId from the API we created earlier
    const getMeetingId = async (id: any) => {
        setLoading(true)
        // console.log('authToken: ', authToken)
        const meetingId = id == null ? await createMeeting({ token: authToken }) : id;
        setLoading(false)
        setMeetingId(meetingId);
    };

    const resetMeetingId = () => {
        if(meeting_id) {
            dispatch(clearMeeting())
        } else {
            setMeetingId(null)
        }
    }

    const getLiveToken = () => {
        console.log('Yakkoooo')
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`live_auth_token`, null)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                if(json.videosdk_auth_token && json.videosdk_auth_token !== authToken) {
                    dispatch(setVideoSdkToken(json.videosdk_auth_token))
                }
                if(json.live_url) {
                    setUrl(json.live_url)
                }
            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            console.warn(e)
        })
        // @ts-ignore
        .finally(()=>{
            setFetchLoading(false)
        })
    }

    useEffect(() => {
        getLiveToken()
    }, [])

    return !fetchLoading ? (
        <SafeAreaView style={tw`flex-1`}>
            <StatusBar hidden />
            <DashboardHeaderSimple navigation={navigation} title='Meeting' containerStyle={[{backgroundColor: CodeColor.code0}]} />
            <WebView
                source={{uri: url}}
                cacheEnabled
                scrollEnabled
            />
        </SafeAreaView>
    ) : <ActivityLoading />

    useEffect(()=>{
        console.log('Meeting ID: ', meeting_id)
        setMeetingId(meeting_id)
    },[meeting_id])

    return fetchLoading ? (
        <ActivityLoading />
    ) : (authToken && meetingId) ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <MeetingProvider
                config={{
                    // @ts-ignore
                    meetingId,
                    micEnabled: false,
                    webcamEnabled: true,
                    name: "Test User",
                    //These will be the mode of the participant CONFERENCE or VIEWER
                    // mode: mode,
                }}
                token={authToken}
            >
                <MeetingView resetMeetingId={resetMeetingId} />
            </MeetingProvider>
        </SafeAreaView>
    ) : (
        <JoinScreen getMeetingId={getMeetingId} setMode={setMode} loading={loading} />
    );
}

export default VideoLive;