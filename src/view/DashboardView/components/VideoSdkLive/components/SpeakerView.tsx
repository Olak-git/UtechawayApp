import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Constants, useMeeting } from '@videosdk.live/react-native-sdk';
import HeaderView from './HeaderView';
import ParticipantView from './ParticipantView';
import Controls from './Controls';

// Responsible for Speaker side view, which contains Meeting Controls(toggle mic/webcam & leave) and Participant list
const SpeakerView = () => {
    // Get the Participant Map and meetingId
    const { meetingId, participants } = useMeeting({});

    const [topHeight, setTopHeight] = useState(0)
    const [bottomHeight, setBottomHeight] = useState(0)
  
    // For getting speaker participant, we will filter out `CONFERENCE` mode participant
    const speakers = useMemo(() => {
        const speakerParticipants = [...participants.values()].filter(
            (participant) => {
                return participant.mode == Constants.modes.CONFERENCE;
            }
        );
        return speakerParticipants;
    }, [participants]);

    useEffect(()=>{
        console.log('participants => ', participants)
    },[participants])

    useEffect(()=>{
        console.log('speakers => ', speakers)
    },[speakers])
  
    return (
        <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>

            {/* Render Header for copy meetingId and leave meeting*/}
            <HeaderView setTopHeight={setTopHeight} />
    
            {/* Render Participant List */}
            {
                // @ts-ignore
                speakers.length > 0 ? (
                    <FlatList
                        // @ts-ignore
                        data={speakers}
                        renderItem={({ item }) => {
                            return <ParticipantView participantId={item.id} counter={speakers.length} topHeight={topHeight} bottomHeight={bottomHeight} />;
                        }}
                        // contentContainerStyle={{backgroundColor: 'yellow'}}
                        showsVerticalScrollIndicator={false}
                    />
                ) : null}
    
            {/* Render Controls */}
            <Controls setBottomHeight={setBottomHeight} />
        </SafeAreaView>
    );
}

export default SpeakerView