import { View, Text, StyleSheet, SafeAreaView, Pressable, Touchable, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import tw from 'twrnc';
import { TOAST_TYPE } from '../functions/functions'
import { Divider, Icon } from '@rneui/base';
import { Notifier } from 'react-native-notifier';
// @ts-ignore
import CardView from 'react-native-cardview'
import { Button } from 'react-native-paper';
import '../data/i18n';
import { useTranslation } from 'react-i18next';

interface CustomComponentProps {
    type: TOAST_TYPE,
    title?: string,
    description: string
}
const CustomComponent: React.FC<CustomComponentProps> = ({title, description, type}) => {
    const { t } = useTranslation();
    const isDarkMode = useColorScheme() === 'dark';
    const [state, setState] = useState({
        iconType: 'feather',
        iconName: 'info',
        color: '#000'
    });

    const fetch = useCallback(() => {
        if(type == 'error') {
            setState({
                iconType: 'ant-design',
                iconName: 'closecircleo',
                color: 'rgb(220, 38, 38)'
            })
        } else if(type == 'warn') {
            setState({
                iconType: 'font-awesome',
                iconName: 'trash-o',
                color: 'rgb(249, 115, 22)'
            })
        } else if(type == 'success') {
            setState({
                iconType: 'ant-design',
                iconName: 'check',
                color: 'rgb(22, 163, 74)'
            })
        } else {
            setState({
                iconType: 'feather',
                iconName: 'info',
                color: 'rgb(96, 165, 250)'
            })
        }
    }, [type])

    useEffect(() => {
        fetch();
    }, [type])

    return (
        <SafeAreaView style={tw`mx-3`}>
            <CardView cardElevation={8} cardMaxElevation={10} cornerRadius={3}>
                <View style={tw`px-3 pb-3`}>
                    <View style={tw`py-3 flex-row`}>
                        <Icon type={state.iconType} name={state.iconName} color={state.color} size={30} containerStyle={[tw`mr-2`, {}]} />
                        <View style={tw`flex-1`}>
                            {title && (
                                <Text style={tw`uppercase ${isDarkMode ? 'text-white' : 'text-black'} font-bold mb-1`}>{title}</Text>
                            )}
                            <Text style={tw`${isDarkMode ? 'text-white' : 'text-black'}`}>{description}</Text>
                        </View>
                    </View>
                    <Divider />
                    <Button onPress={() => Notifier.hideNotification()} color={state.color}>{t('alert_component.close')}</Button>
                </View>
            </CardView>
        </SafeAreaView>
        // <SafeAreaView style={tw`rounded-lg mx-2 border-b border-gray-400 ${type == 'error' ? 'bg-black' : (type == 'info' ? 'bg-teal-800' : (type == 'success' ? 'bg-white' : 'bg-orange-500'))}`}>
        //     <View style={tw`p-3`}>
        //         {title && (
        //             <Text style={tw`font-bold ${type == 'success' ? 'text-blue-500' : 'text-white'}`}>{title}</Text>
        //         )}
        //         <Text style={tw`${type == 'success' ? 'text-black' : (type == 'error' ? 'text-red-500' : 'text-white')}`}>{description}</Text>
        //     </View>
        //     <Pressable onPress={() => Notifier.hideNotification()} style={[tw`absolute`, {bottom: -8, right: -5}]}>
        //         <Icon type="ant-design" name="closecircle" size={30} color={type == 'error' ? 'rgb(185, 28, 28)' : '#000'} />
        //     </Pressable>
        // </SafeAreaView>   
    )
}

export default CustomComponent