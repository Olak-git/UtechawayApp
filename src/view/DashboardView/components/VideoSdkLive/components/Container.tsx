import { View, Text } from 'react-native'
import React from 'react'
import Button from './Button';
import SpeakerView from './SpeakerView';
import ViewerView from './ViewerView';
import { Constants, useMeeting } from '@videosdk.live/react-native-sdk';
import { DashboardHeaderSimple } from '../../../../../components/DashboardHeaderSimple';
import tw from 'twrnc'

// Responsible for managing two view (Speaker & Viewer) based on provided mode (`CONFERENCE` & `VIEWER`)
const Container: React.FC<{navigation: any, setMeetingId: (a: any) => void}> = ({ navigation, setMeetingId }) => {
    const { join, changeWebcam, localParticipant } = useMeeting({
        onError: (error) => {
            console.log(error.message);
        },
    });
  
    return (
        <View style={{ flex: 1 }}>
            {localParticipant?.mode == Constants.modes.CONFERENCE ? (
                <SpeakerView />
            ) : localParticipant?.mode == Constants.modes.VIEWER ? (
                <ViewerView />
            ) : (
                <View
                    style={{
                        flex: 1,
                        // justifyContent: "center",
                        // alignItems: "center",
                        backgroundColor: "black",
                    }}
                >
                    <DashboardHeaderSimple onPress={() => setMeetingId(null)} title={''} fontSize={'text-xl'} />

                    <View style={tw`flex-1 justify-center items-center px-10`}>
                        <Text style={{ fontSize: 20, color: "white" }}>Press Join button to enter studio.</Text>
                        {/* @ts-ignore */}
                        <Button
                            btnStyle={{
                                marginTop: 8,
                                paddingHorizontal: 22,
                                padding: 12,
                                borderWidth: 1,
                                borderColor: "white",
                                borderRadius: 8,
                            }}
                            buttonText={"Join"}
                            onPress={() => {
                                join();
                                setTimeout(() => {
                                    // @ts-ignore
                                    changeWebcam();
                                }, 300);
                            }}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

export default Container