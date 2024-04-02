import { View, Text, StyleSheet, Image, ImageBackground, Platform, StatusBar, Pressable, PixelRatio } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../../../../../functions/functions'
import { Icon } from '@rneui/base'
import tw from 'twrnc'
import '../../../../../data/i18n';

interface VideoProps {
    navigation: any,
    action: string,
    setMode: any
}
const Video: React.FC<VideoProps> = ({navigation, action, setMode}) => {
    return (
        <View style={[ tw`bg-blue-500`, styles.mainContainer ]}>
            <View style={[ tw`px-2 py-3`, {backgroundColor: '#000', height: 70} ]}>
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
                {/* <Text style={[ tw`text-white text-center` ]}>{ getTime() }</Text> */}
            </View>
            <View style={[ tw`bg-white flex-1`, ]}>
                <ImageBackground
                    resizeMode='center'
                    defaultSource={require('../../../../../assets/images/2.png')}
                    source={require('../../../../../assets/images/2.png')}
                    style={[ tw`flex-1 justify-center items-center` ]} 
                >
                    <View style={[ tw`absolute shadow top-0 left-0`, {width: 150, height: 220} ]}>
                        <Image
                            resizeMode='stretch'
                            source={require('../../../../../assets/images/3.png')}
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
                        <Pressable onPress={() => setMode('audio')}>
                        <Icon
                            type='feather'
                            name='phone'
                            color={'#000000'}
                            size={30} />
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: windowWidth,
        // @ts-ignore
        height: windowHeight - StatusBar.currentHeight
    }
})

export default Video