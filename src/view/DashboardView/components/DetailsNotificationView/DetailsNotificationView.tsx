import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../../components/Base';
import Header from '../../../../components/Header';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalDate, getLocalTime, getLocalTimeStr } from '../../../../functions/helperFunction';
import { CodeColor } from '../../../../assets/style';
import { componentPaddingHeader } from '../../../../functions/functions';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { CommonActions } from '@react-navigation/native';
import '../../../../data/i18n';

interface DetailsNotificationViewProps {
    navigation: any,
    route: any
}
const DetailsNotificationView: React.FC<DetailsNotificationViewProps> = (props) => {

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const {navigation, route} = props;

    const {notification} = route.params;

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
        if(Object.keys(user).length == 0) {
            goHome();
        }
    }, [user])

    return (
        <Base>
            <Header
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title='Notification' />
                } />
            <View style={[tw`flex-1 py-5 bg-white`]}>
                <ScrollView contentContainerStyle={tw`px-4`}>
                    <Text style={tw`text-black text-justify`}>{notification.texte}</Text>
                    <Text style={tw`text-gray-400 mt-4 text-right`}>{getLocalDate(notification.dat)} à {getLocalTime(notification.dat)}</Text>
                </ScrollView>
            </View>

        </Base>
    )

}

export default DetailsNotificationView;