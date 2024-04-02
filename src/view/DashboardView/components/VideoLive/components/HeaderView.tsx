import { View, Text, Clipboard, Alert, Share } from 'react-native'
import React from 'react'
import { Button as ButtonPaper, IconButton } from 'react-native-paper'
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { CodeColor } from '../../../../../assets/style';
import { show_live_header_btn_copy } from '../../../../../functions/helperFunction';
import { account } from '../../../../../functions/functions';

const HeaderView: React.FC<{ setTopHeight?:(a:number)=>void, resetMeetingId:()=>void }> = ({ setTopHeight, resetMeetingId }) => {

    const { meetingId, leave } = useMeeting({});

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Rejoins-moi sur mon live avec le code: \n${meetingId}`,
                // url: 'https://utechaway.com'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };
    
    return (
        <View
            onLayout={e => {
                // @ts-ignore
                setTopHeight(e.nativeEvent.layout.height)
            }}
            style={{
                flexDirection: "row",
                // marginTop: 12,
                justifyContent: !meetingId ? 'flex-end' : show_live_header_btn_copy? "space-between" : "space-around",
                alignItems: "center",
                paddingHorizontal: 5,
                paddingVertical: 10,
            }}
        >
            {meetingId && (
                <>
                    <Text style={{ fontSize: 16, color: "grey", marginRight: 10 }}>MeI: {meetingId}</Text>
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
                            labelStyle={{fontSize: 12}}
                        >
                            Copy
                        </ButtonPaper>
                    )}
                </>
            )}

            {/* @ts-ignore */}
            {account == 'admin' && (
                <IconButton
                    icon='share-variant'
                    size={30}
                    // @ts-ignore
                    iconColor='#FFF'
                    // onPress={onShare}
                />
            )}
            <ButtonPaper
                onPress={()=>{
                    leave()
                    setTimeout(()=>{
                        if(!meetingId) {
                            resetMeetingId()
                        }
                    }, 1000)
                }}
                mode='contained'
                color={CodeColor.code1}
                labelStyle={{fontSize: 12}}
            >
                Leave
            </ButtonPaper>
        </View>
    );
}

export default HeaderView