import { View, Text, StyleSheet, Image, Platform, StatusBar, Pressable, PixelRatio } from 'react-native'
import React, { useEffect, useState } from 'react'
import { windowHeight, windowWidth } from '../../../../../functions/functions'
import tw from 'twrnc'
import {Icon} from '@rneui/base';
import { CodeColor } from '../../../../../assets/style';
import '../../../../../data/i18n';

const timer = require('react-native-timer');

interface AudioProps {
    navigation: any,
    action: string,
    setMode: any,
}
const Audio: React.FC<AudioProps> = ({navigation, action, setMode}) => {

    let sync: any = null

    const [beginSpeak, setBeginSpeak] = useState(undefined)
    const [accept, setAccept] = useState<boolean>(false);
    const [reject, setReject] = useState<boolean>(false);

    const onHandleReject = () => {
        setReject(true);
    }

    const padValue = (n: number) => {
        return n < 10 ? '0' + n : n;
    }

    const [time, setTime] = useState({
        hours: 0,
        minutes: 0,
        secondes: 0
    })

    const timer = () => {
        let _secondes = time.secondes;
        _secondes = _secondes + 1;
        let _minutes = time.minutes;
        // @ts-ignore
        _minutes = _minutes + parseInt(_secondes/60)
        let _hours = time.hours
        // @ts-ignore
        _hours = _hours + parseInt(_minutes/60)
        _minutes = _minutes%60
        _secondes = _secondes%60
        setTime(prevState => ({...prevState, hours: _hours, minutes: _minutes, secondes: _secondes}))
    }

    const getTime = () => {
        return padValue(time.hours) + ':' + padValue(time.minutes) + ':' + padValue(time.secondes)
    }

    const syncTime = () => {
        sync = setTimeout(timer, 1000)
    }

    useEffect(() => {
        if(accept) {
            syncTime()
        } else {
            clearInterval(sync)
            sync = null
        }
        return () => {
            clearInterval(sync);
            sync = null
        }
    }, [accept, time])

    useEffect(() => {
        if(reject) {
            navigation.goBack();
        }
    }, [reject])
    
    return (
        <View style={[ tw`flex-1 bg-white`, styles.mainContainer ]}>
            <View style={[ tw`px-2 py-3`, {backgroundColor: '#000'} ]}>
                <View style={[ tw`border flex-row justify-between items-center relative` ]}>
                    <Pressable onPress={() => navigation.goBack()} style={[ tw`self-start` ]}>
                        <Icon type='ant-design' name='arrowleft' size={25} color='#FFFFFF' containerStyle={tw`mr-2`} />
                        {/* <Icon type='ionicon' name='chevron-back' size={30} color='#FFFFFF' containerStyle={tw`mr-2`} /> */}
                    </Pressable>
                    <View style={[tw`items-center absolute`, {zIndex: -1, width: '100%'}]}>
                        <Image
                            source={require('../../../../../assets/images/logo.png')}
                            style={[ tw`mt-2`, {width: PixelRatio.getPixelSizeForLayoutSize(30), height: PixelRatio.getPixelSizeForLayoutSize(30)} ]} />
                    </View>
                </View>
                <Text style={[ tw`text-white text-center text-xs mt-4` ]}>Assistant messagerie de Utechaway</Text>
                {/* <Text style={[ tw`text-white text-center` ]}>{ getTime() }</Text> */}
            </View>

            <View style={[ tw`flex-1 bg-white justify-center items-center`, {} ]}>

                    <Icon type='octicon' name='feed-person' size={100} />

                    {accept && (
                        <>
                            <Icon type='material-icon' name='multitrack-audio' color='#000' size={50} containerStyle={tw`mt-5`} />
                            <Text style={[ tw`text-black mt-2` ]}>{ getTime() }</Text>
                        </>
                    )}

                    {action == 'received'
                    ?
                        accept
                        ?
                            <View style={[ tw`absolute left-0 bottom-5 flex-row justify-around items-center`, {width: '100%'} ]}>
                                <Pressable onPress={onHandleReject} style={tw``}>
                                    <Icon type='material' name='call-end' reverse={true} color={CodeColor.code1} size={27} />
                                </Pressable>
                            </View>
                        :
                            <View style={[ tw`absolute left-0 bottom-5 flex-row justify-around items-center`, {width: '100%'} ]}>
                                <Pressable onPress={() => setAccept(true)} style={tw``}>
                                    <Icon type='material' name='call' reverse={true} color='green' size={27} />
                                </Pressable>
                                <Pressable onPress={() => setReject(true)} style={tw``}>
                                    <Icon type='material' name='call-end' reverse={true} color={CodeColor.code1} size={27} />
                                </Pressable>                        
                            </View>
                    : null
                    }
                
                    {action == 'emit' && (
                        <View style={[ tw`absolute left-0 bottom-5 flex-row justify-around items-center`, {width: '100%'} ]}>
                            <Pressable onPress={onHandleReject} style={tw``}>
                                <Icon type='material' name='call-end' reverse={true} color={CodeColor.code1} size={27} />
                            </Pressable>
                        </View>
                    )}
            </View>

            <View style={[ tw`flex-row justify-around items-center`, {backgroundColor: '#000', height: 70} ]}>
                <Icon
                    type={ Platform.OS === 'android' ? 'font-awesome' : 'material'}
                    name={ Platform.OS === 'android' ? 'volume-down' : 'campaign' } 
                    color='#ffffff' size={30} 
                />
                <Pressable onPress={() => setMode('video')}>
                <Icon type='octicon' name='device-camera-video' color={'#ffffff'} size={30} />
                </Pressable>
                <Icon type='father' name='mic' color={'#ffffff'} size={30} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        // width: windowWidth,
        // // @ts-ignore
        // height: windowHeight - StatusBar.currentHeight
    }
})

export default Audio
