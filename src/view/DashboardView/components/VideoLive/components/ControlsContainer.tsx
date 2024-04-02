import { TouchableOpacity, View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { MeetingProvider, useMeeting, useParticipant, MediaStream, RTCView } from "@videosdk.live/react-native-sdk";
import { toast } from '../../../../../functions/functions';
import { CodeColor } from '../../../../../assets/style';
import { Icon } from '@rneui/base';
import { Button as ButtonPaper, IconButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { setLiveMeetingId, setLiveSharedScreen } from '../../../../../feature/meeting.slice';

const ControlsContainer: React.FC<{ setBottomHeight?:(a:number)=>void }> = ({ setBottomHeight }) => {

    const dispatch = useDispatch();
    const meeting_id = useSelector((state: any) => state.meeting.id)
    const meeting_shared_screen = useSelector((state: any) => state.meeting.shared_screen)
    const { meetingId, join, leave, end, stopRecording, stopVideo, toggleScreenShare, localScreenShareOn, toggleWebcam, changeWebcam, localWebcamOn, toggleMic, localMicOn, startHls, stopHls, hlsState } = useMeeting({});

    const onHandleShareScreen = async () => {
        const lcs = localScreenShareOn
        if(lcs) {
            await dispatch(setLiveMeetingId(meetingId))
            await dispatch(setLiveSharedScreen(true))
            Alert.alert('Partage d\'écran activé')
            toast('success', 'Partage d\'écran activé')
        } else {
            dispatch(setLiveSharedScreen(false))
            // Alert.alert('Partage d\'écran désactivé')
            // toast('success', 'Partage d\'écran désactivé')
        }
    }

    useEffect(() => {
        onHandleShareScreen()
    }, [localScreenShareOn])

    useEffect(() => {
        console.log('meetingId => ', meetingId)
        console.log('meeting_id => ', meeting_id)
        // if(meeting_shared_screen && !localScreenShareOn) {
        //     toggleScreenShare()
        // }
    }, [meetingId, meeting_id, meeting_shared_screen, localScreenShareOn])

    return (
        <View
            onLayout={e => {
                // @ts-ignore
                setBottomHeight(e.nativeEvent.layout.height)
            }}
            style={{
                height: 65,
                paddingVertical: 2,
                paddingHorizontal: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                // backgroundColor: 'green'
            }}
        >
            <ButtonPaper
                onPress={()=>{
                    join()
                }}
                mode='contained'
                color={CodeColor.code1}
                labelStyle={{fontSize: 12}}
            >
                Join
            </ButtonPaper>

            {meetingId && (
                <>
                    <Icon 
                        type='ionicon' 
                        name='camera-reverse-sharp' 
                        color={'#FFF'} 
                        onPress={()=>{
                            // @ts-ignore
                            changeWebcam()
                        }} 
                        reverse 
                        reverseColor={CodeColor.code1} 
                    />

                    {/* Toggle Webcam */}
                    <Icon 
                        type='material-icon' 
                        name={localWebcamOn?'videocam':'videocam-off'} 
                        color={'#FFF'} 
                        onPress={()=>toggleWebcam()} 
                        // reverse 
                        reverseColor={CodeColor.code1}
                    />

                    {/* Toggle MIC */}
                    <Icon 
                        type='font-awesome-5' 
                        name={localMicOn?'microphone':'microphone-slash'} 
                        color={'#FFF'} 
                        // @ts-ignore
                        onPress={toggleMic} 
                        // reverse={true}
                        reverseColor={CodeColor.code1} 
                    />

                    {/* Off for moment */}
                    {/* <Icon 
                        type={localScreenShareOn?'material-icon':'font-awesome-5' }
                        name={localScreenShareOn?'stop-screen-share':'share-alt'} 
                        color={'#FFF'} 
                        // @ts-ignore
                        onPress={toggleScreenShare} 
                        // reverse 
                        reverseColor={CodeColor.code1} 
                    /> */}

                    {/* Off */}
                    {/* <ButtonPaper
                        onPress={()=>{
                            leave()
                        }}
                        mode='contained'
                        color={CodeColor.code1}
                        labelStyle={{fontSize: 12}}
                    >
                        Leave
                    </ButtonPaper> */}
                </>
            )}
        </View>
    );
}

export default ControlsContainer