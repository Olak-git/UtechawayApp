import { View, Text, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { MediaStream, RTCView, useParticipant } from '@videosdk.live/react-native-sdk';

// Responsible for managing participant video stream
const ParticipantView: React.FC<{participantId: any, counter: number, topHeight?: number, bottomHeight?: number}> = ({ participantId, counter, topHeight=0, bottomHeight=0 }) => {
    const { webcamStream, webcamOn } = useParticipant(participantId);

    const _height = Dimensions.get('window').height

    const full_height = _height - 16 - topHeight - bottomHeight

    useEffect(() => {
        console.log('Length: ', counter)
    }, [counter])

    useEffect(()=>{
        console.log('_height: ', _height)
    }, [_height])

    return webcamOn && webcamStream ? (
        <RTCView
            streamURL={new MediaStream([webcamStream.track]).toURL()}
            objectFit={"cover"}
            style={{
                height: counter==1 ? full_height : (full_height - 88) / 2,
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        />
    ) : (
        <View
            style={{
                backgroundColor: "grey",
                height: 300,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        >
            <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
        </View>
    );
}

export default ParticipantView