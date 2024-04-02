import { View, Text, FlatList, Dimensions } from 'react-native'
import React from 'react'
import { MeetingProvider, useMeeting, useParticipant, MediaStream, RTCView } from "@videosdk.live/react-native-sdk";

const ParticipantView: React.FC<{participantId: any, counter: number, topHeight?: number, bottomHeight?: number}> = ({ participantId, counter, topHeight=0, bottomHeight=0 }) => {
    const { webcamStream, webcamOn } = useParticipant(participantId);

    const _height = Dimensions.get('window').height

    const full_height = _height - topHeight - bottomHeight - 16;

    const fheight = counter==1 ? full_height : (full_height - 88) / 2;

    return webcamOn && webcamStream ? (
        <RTCView
            streamURL={new MediaStream([webcamStream.track]).toURL()}
            objectFit={"cover"}
            style={{
                // height: 300,
                height: fheight,
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        />
    ) : (
        <View
            style={{
                backgroundColor: "grey",
                // height: 300,
                height: fheight,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
        </View>
    );
}

const ParticipantList: React.FC<{topHeight: number, bottomHeight: number}> = ({ topHeight, bottomHeight }) => {
    // Get `participants` from useMeeting Hook
    const { participants } = useMeeting({});
    const participantsArrId = [...participants.keys()];

    return participantsArrId.length > 0 ? (
        <FlatList
            data={participantsArrId}
            renderItem={({ item }) => {
                return <ParticipantView participantId={item} counter={participantsArrId.length} topHeight={topHeight} bottomHeight={bottomHeight} />;
            }}
        />
    ) : (
        <View
            style={{
                flex: 1,
                backgroundColor: "#F6F6FF",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20 }}>Press Join button to enter meeting.</Text>
        </View>
    );
}

export default ParticipantList