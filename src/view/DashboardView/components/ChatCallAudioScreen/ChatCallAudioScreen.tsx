import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Divider, Header, Icon, ListItem, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { DashboardHeader } from '../../../../components/DashboardHeader';
import { baseUri, fetchUri, formatDate, formatFullDate, format_size, getDate, getRandomInt, getUser, sleep, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import IconSocial from '../../../../components/IconSocial';
import TextareaForm from '../../../../components/TextareaForm';
import FilePicker, { types } from 'react-native-document-picker';
// @ts-ignore
import EmojiBoard from 'react-native-emoji-board';
import { Alert } from 'react-native';
import { Modal } from 'react-native-form-component';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

const timer = require('react-native-timer');

interface ChatCallAudioScreenProps {
    navigation?: any,
    route?: any
}

const ChatCallAudioScreen: React.FC<ChatCallAudioScreenProps> = (props) => {
    const {navigation, route} = props

    // @ts-ignore
    let sync = null

    const [beginSpeak, setBeginSpeak] = useState(undefined)

    const [time, setTime] = useState({
        hours: 0,
        minutes: 0,
        secondes: 0
    })

    // @ts-ignore
    const user1 = useSelector(state => state.user.data)

    const [user, setUser] = useState(null)

    const [endFetch, setEndFetch] = useState(false)

    // @ts-ignore
    const userAvatar = useSelector(state => state.avatar.src)

    const padValue = (n: number) => {
        return n < 10 ? '0' + n : n;
    }

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
        (async () => {
            const user2 = await getUser() || user1
            if(!user2) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {name: 'Home'}
                        ]
                    })
                )
            } else {
                setUser(user2)
                setEndFetch(true)
            }
        })()
        return () => {
            // @ts-ignore
            clearInterval(sync)
            sync = null
            console.log('Success')
        }
    }, [])

    useEffect(() => {
        if(beginSpeak) {
            syncTime()
        } else {
            // @ts-ignore
            clearInterval(sync)
            sync = null
        }
    }, [beginSpeak, time])    


    return (
        <SafeAreaView style={tw`flex-1`}>
        { user && endFetch ?
            <View style={[ tw`bg-blue-500`, styles.mainContainer ]}>
                <View style={[ tw`px-2 py-3`, {backgroundColor: 'rgb(20,52,100)'} ]}>
                    <View style={[ tw`justify-center items-center relative` ]}>
                        <View style={[ tw`absolute left-0 top-2` ]}>
                            <Icon
                                onPress={() => navigation.navigate('DashboadChatScreen')}
                                type='entypo'
                                name='chevron-thin-left'
                                color={'#fff'}
                                size={18}/>
                        </View>
                        <Image
                            resizeMode='center'
                            source={require('../../../../assets/images/logo.png')}
                            style={[ tw``, {width: 100, height: 40} ]} />
                    </View>
                    <Text style={[ tw`text-white text-center mb-2` ]}>Assistant messagerie d'Amanou Tech</Text>
                    <Text style={[ tw`text-white text-center` ]}>{ getTime() }</Text>
                </View>

                <View style={[ tw`bg-blue-500 flex-1` ]}>
                    <View
                        style={[ tw`flex-1 justify-center items-center` ]}>

                        <Image
                            source={require('../../../../assets/images/person.png')}
                            style={[  ]} />

                        <View style={[ tw`absolute left-0 bottom-30 flex-row justify-around items-center`, {width: windowWidth} ]}>
                            <Icon
                                type='material-icon'
                                name='multitrack-audio'
                                color='#ffffff'
                                size={50} />
                        </View>
                    
                        <View style={[ tw`absolute left-0 bottom-5 flex-row justify-around items-center`, {width: windowWidth} ]}>
                            <Icon
                                // @ts-ignore
                                onPress={() => setBeginSpeak(true)}
                                type='material'
                                name='call-end'
                                reverse={true}
                                color={'#ff2222'}
                                size={27} />
                        </View>

                    </View>
                </View>
                <View style={[ tw`flex-row justify-around items-center`, {backgroundColor: 'rgb(20,52,100)', width: windowWidth, height: 70} ]}>
                    <Icon
                        type={ Platform.OS === 'android' ? 'font-awesome' : 'material'}
                        name={ Platform.OS === 'android' ? 'volume-down' : 'campaign' }
                        color={'#ffffff'}
                        size={30} />

                    <Icon
                        onPress={() => navigation.navigate('DashboadChatCallVideo')}
                        type='octicon'
                        name='device-camera-video'
                        color={'#ffffff'}
                        size={30} />

                    <Icon
                        type='father'
                        name='mic'
                        color={'#ffffff'}
                        size={30} />
                </View>
            </View> : <ActivityLoading />
        }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth,
        // @ts-ignore
        height: windowHeight - StatusBar.currentHeight
    }
})

export default ChatCallAudioScreen;