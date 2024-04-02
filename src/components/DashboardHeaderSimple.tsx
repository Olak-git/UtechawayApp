import { Icon } from '@rneui/base';
import React from 'react';
import { Image, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { windowWidth } from '../functions/functions';

// text-xl

interface DashboardHeaderSimpleProps {
    navigation?: any,
    title?: string,
    fontSize?: string,
    rightComponent?: React.ReactElement,
    onPress?: () => void,
    containerStyle?: StyleProp<ViewStyle>
}

export const DashboardHeaderSimple: React.FC<DashboardHeaderSimpleProps> = ({navigation, title, fontSize = 'text-lg', rightComponent, onPress, containerStyle}) => {

    const handlePress = () => {
        if(navigation) {
            navigation.goBack()
        } else {
            // @ts-ignore
            onPress();
        }
    }

    return (
        <View style={[ tw`flex-row justify-between items-center px-3`, {height: 60, width: windowWidth}, containerStyle ]}>
            <View style={tw`flex-1 flex-row items-center`}>
                <Pressable onPress={handlePress} style={[ tw`items-center mr-2` ]}>
                    {/* <Icon type='ionicon' name='chevron-back' size={30} color='#FFFFFF' containerStyle={tw`mr-2`} /> */}
                    <Icon type='ant-design' name='arrowleft' size={25} color='#FFFFFF'/>
                </Pressable>
                <Text numberOfLines={1} style={[ tw`flex-1 text-white ${fontSize}`, {fontFamily: 'YanoneKaffeesatz-Regular'} ]}>{ title }</Text>
            </View>
            {rightComponent}
        </View>
    )
}