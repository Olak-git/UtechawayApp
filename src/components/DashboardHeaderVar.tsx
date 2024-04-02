import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { baseUri } from '../functions/functions';

interface DashboardHeaderVarProps {
    navigation?: any,
    route?: any,
    textTitle?: string,
    userImage?: any | null
}

export const DashboardHeaderVar: React.FC<DashboardHeaderVarProps> = ({navigation, route, textTitle, userImage = null}) => {
    
    const imageSrc = userImage ? { uri: baseUri + '/assets/avatars/' + userImage } : require('../assets/images/user.png')

    return (
        <View style={[ tw`w-100 px-4` ]}>
            <View style={[ tw`flex-row flex-wrap justify-between items-center` ]}>
                <Pressable onPress={() => navigation.goBack()} style={[ tw`` ]}>
                    <View style={[ tw`flex-row flex-wrap items-center` ]}>
                        <Image 
                            style={[ tw`mr-2`, { width: 30, height: 60, resizeMode: 'contain' }]}
                            source={require('../assets/images/arrow-left.png')} />
                        <Image
                            style={{ width: 100, minHeight: 40, resizeMode: 'contain' }}
                            source={require('../assets/images/logo.png')} />
                    </View>
                </Pressable>
                <View style={[ tw`flex-row items-center` ]}>
                    <Pressable onPress={() => navigation.navigate('DashboadPanel')}
                        style={[ tw`justify-center items-center border-2 border-white rounded-full overflow-hidden mr-3`, {width: 45, height: 45} ]}>
                        <Image 
                            style={[ tw`rounded-full`, { width: 30, minHeight: 30, resizeMode: 'contain' }]}
                            source={ imageSrc } />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('DashboadSettings')}>
                        <Image 
                            style={{ width: 30, minHeight: 30, resizeMode: 'contain' }}
                            source={require('../assets/images/settings.png')} />
                    </Pressable>
                </View>
            </View>
            <View>
                {textTitle && (
                    <Text style={[ tw`text-white text-lg text-center`, {textDecorationLine: 'underline'} ]}>{ textTitle }</Text>
                )}
            </View>
        </View>
    )
}