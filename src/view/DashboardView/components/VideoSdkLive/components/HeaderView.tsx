import { View, Text, Clipboard, Alert } from 'react-native'
import React from 'react'
import { Button as ButtonPaper } from 'react-native-paper'
import Button from './Button';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { CodeColor } from '../../../../../assets/style';
import { show_live_header_btn_copy } from '../../../../../functions/helperFunction';

const HeaderView: React.FC<{ setTopHeight?:(a:number)=>void }> = ({ setTopHeight }) => {
    const { meetingId, leave } = useMeeting();
    return (
        <View
            onLayout={e => {
                // @ts-ignore
                setTopHeight(e.nativeEvent.layout.height)
            }}
            style={{
                flexDirection: "row",
                marginTop: 12,
                justifyContent: show_live_header_btn_copy? "space-evenly" : "space-around",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 18, color: "white" }}>{meetingId}</Text>
            {show_live_header_btn_copy && (
                <ButtonPaper
                    onPress={()=>{
                        Clipboard.setString(meetingId);
                        Alert.alert("MeetingId copied successfully");
                    }}
                    icon='content-copy'
                    mode='outlined'
                    color='white'
                    style={{ borderColor: CodeColor.code1 }}
                >
                    Copy
                </ButtonPaper>
            )}
            <ButtonPaper
                onPress={()=>{
                    leave()
                }}
                mode='contained'
                color={CodeColor.code1}
            >
                Leave
            </ButtonPaper>
        </View>
    );
}

export default HeaderView