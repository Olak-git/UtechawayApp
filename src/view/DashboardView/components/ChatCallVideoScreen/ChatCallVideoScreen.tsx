import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
import { Card, Divider, Header, Icon, ListItem, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { getUser, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import IconSocial from '../../../../components/IconSocial';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

interface ChatCallVideoScreenProps {
    navigation?: any,
    route?: any
}

const ChatCallVideoScreen: React.FC<ChatCallVideoScreenProps> = (props) => {
    const {navigation, route} = props

    // @ts-ignore
    const user1 = useSelector(state => state.user.data)

    const [user, setUser] = useState(null)

    const [endFetch, setEndFetch] = useState(false)

    // @ts-ignore
    const userAvatar = useSelector(state => state.avatar.src)

    useEffect( () => {
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
    }, [])

    return (
        <SafeAreaView style={tw`flex-1`}>
        { user && endFetch ?
            <View style={[ tw`bg-blue-500`, styles.mainContainer ]}>
                <View style={[ tw`bg-black justify-center items-center relative`, {height: 75} ]}>
                    <View style={[ tw`absolute left-5 top-6` ]}>
                        <Icon
                            onPress={() => navigation.navigate('DashboadChatScreen')}
                            type='entypo'
                            name='chevron-thin-left'
                            color={'#fff'}
                            style={{ }}/>
                    </View>
                    <Image
                        source={require('../../../../assets/images/logo.png')}
                        style={[ tw``, {width: 100, height: 40} ]} />
                </View>
                <View style={[ tw`bg-white flex-1`, ]}>
                    <ImageBackground
                        resizeMode='center'
                        defaultSource={require('../../../../assets/images/2.png')}
                        source={require('../../../../assets/images/2.png')}
                        style={[ tw`flex-1 justify-center items-center` ]} 
                    >
                        <View style={[ tw`absolute shadow top-0 left-0`, {width: 150, height: 220} ]}>
                            <Image
                                resizeMode='stretch'
                                source={require('../../../../assets/images/3.png')}
                                style={[ tw``, {width: '100%', height: '100%'} ]} />
                        </View>

                        <View style={[ tw`absolute left-0 bottom-20 flex-row justify-around items-center`, {width: windowWidth} ]}>
                            <Icon
                                type='material'
                                name='call-end'
                                reverse={true}
                                color={'#ff2222'}
                                size={20}
                                containerStyle={{ marginLeft: -6 }} />
                        </View>

                        <View style={[ tw`absolute left-0 bottom-0 flex-row justify-around items-center`, {width: windowWidth, height: 70} ]}>
                            <Icon
                                type={ Platform.OS === 'android' ? 'font-awesome' : 'material'}
                                name={ Platform.OS === 'android' ? 'volume-down' : 'campaign' }
                                color={'#000000'}
                                size={35} />

                            <Icon
                                type='material'
                                name={ Platform.OS === 'android' ? 'flip-camera-android' : 'flip-camera-ios' }
                                reverse={Platform.OS === 'android' ? false : true}
                                color={'#000000'}
                                size={Platform.OS === 'android' ? 35 : 25} />

                            <Icon
                                type='father'
                                name='mic'
                                color={'#000000'}
                                size={35} />
                        </View>

                        {/* @ts-ignore */}
                        <View style={[ tw`absolute top-0 right-0 justify-center`, {width: 60, height: windowHeight - StatusBar.currentHeight - 75} ]}>
                            <Icon
                                type='material-community'
                                name='monitor-screenshot'
                                color={'#000000'}
                                size={40}
                                containerStyle={[ tw`mb-10` ]} />
                            <Icon
                                onPress={() => navigation.navigate('DashboadChatCallAudio')}
                                type='feather'
                                name='phone'
                                color={'#000000'}
                                size={30} />
                        </View>
                    </ImageBackground>
                </View>
            </View>
            : <ActivityLoading />
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

export default ChatCallVideoScreen;