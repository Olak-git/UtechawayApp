import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CommonActions } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import Base from '../../../../components/Base';
import Audio from './components/Audio';
import Video from './components/Video';
import '../../../../data/i18n';

interface CallScreenProps {
    navigation: any
    route: any
}
const CallScreen: React.FC<CallScreenProps> = ({navigation, route}) => {

    const { type, action } = route.params;

    const user = useSelector((state: any) => state.user.data);

    const [mode, setMode] = useState<string>(type);

    const goHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Home'}
                ]
            })
        )
    }

    useEffect(() => {
        if(Object.keys(user).length !== 0) {
            
        } else {
            goHome()
        }
    }, [user])

    return (
        <Base>
            {mode == 'audio'
            ? <Audio navigation={navigation} action={action} setMode={setMode} />
            : <Video navigation={navigation} action={action} setMode={setMode} />
            }
        </Base>
    )
}

export default CallScreen