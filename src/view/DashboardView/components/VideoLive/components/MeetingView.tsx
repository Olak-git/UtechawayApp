import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MeetingProvider, useMeeting, useParticipant, MediaStream, RTCView } from "@videosdk.live/react-native-sdk";
import ControlsContainer from './ControlsContainer';
import ParticipantList from './ParticipantList';
import HeaderView from './HeaderView';

const MeetingView: React.FC<{resetMeetingId:()=>void}> = ({ resetMeetingId }) => {
  const { meetingId, leave } = useMeeting({});
  const [topHeight, setTopHeight] = useState(0)
  const [bottomHeight, setBottomHeight] = useState(0)

  useEffect(() => {
    console.log('MeetingId1: ', meetingId)
}, [meetingId])
  
  return (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Render Header for copy meetingId and leave meeting*/}
        <HeaderView setTopHeight={setTopHeight} resetMeetingId={resetMeetingId} />

        <ParticipantList topHeight={topHeight} bottomHeight={bottomHeight} />

        {/* Render Controls */}
        <ControlsContainer setBottomHeight={setBottomHeight} />
      </View>
    </SafeAreaView>
  );
}

export default MeetingView