import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useMeeting } from '@videosdk.live/react-native-sdk';
import Video from '../../CallScreen/components/Video';
import HeaderView from './HeaderView';

// Responsible for Viewer side view, which contains video player for streaming HLS and managing HLS state (HLS_STARTED, HLS_STOPPING, HLS_STARTING, etc.)
const ViewerView = ({}) => {
    const { hlsState, hlsUrls } = useMeeting();
  
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            {hlsState == "HLS_PLAYABLE" ? (
            <>
                {/* Render Header for copy meetingId and leave meeting*/}
                <HeaderView />
    
                {/* Render VideoPlayer that will play `downstreamUrl`*/}
                <Video
                    // @ts-ignore 
                    controls={true}
                    source={{
                        uri: hlsUrls.downstreamUrl,
                    }}
                    resizeMode={"stretch"}
                    style={{
                        flex: 1,
                        backgroundColor: "black",
                    }}
                    onError={(e: any) => console.log("error", e)}
                />
            </>
            ) : (
                <SafeAreaView
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <Text style={{ fontSize: 20, color: "white" }}>
                    HLS is not started yet or is stopped
                    </Text>
                </SafeAreaView>
            )}
        </SafeAreaView>
    );
}

export default ViewerView