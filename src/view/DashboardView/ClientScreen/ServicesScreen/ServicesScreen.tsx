import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, CheckBox, Header, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { DashboardHeaderVar } from '../../../../components/DashboardHeaderVar';
import { baseUri, componentPaddingHeader, fetchUri, format_size, getCurrency, getRandomInt, getUser, headers, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { ALERT_TYPE, Dialog, Root } from 'react-native-alert-notification';
import { Icon } from "@rneui/themed";
import { ColorsPers } from '../../../../components/Styles';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import  { default as HeaderP } from '../../../../components/Header';
import { refreshColor } from '../../../../data';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface ServicesScreenProps {
    navigation?: any,
    route?: any
}
const ServicesScreen: React.FC<ServicesScreenProps> = (props) => {
    const { t } = useTranslation();

    const user = useSelector((state: any) => state.user.data);

    const {navigation, route} = props

    const [endFetch, setEndFetch] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const [elements, setElements] = useState([]);

    const [services, setServices] = useState<any>([]);

    const [total, setTotal] = useState(0);

    const evaluateTotal = (value: number) => {
        setTotal(state => state + value)
    }

    const handleOnSubmit = () => {
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'TOTAL:',
            textBody: getCurrency(total) + ' €',
            button: 'OK'
        })
    }

    // @ts-ignore
    const renderItem = (item, index) => (
        <TouchableOpacity
            key={index.toString()}
            onPress={() => navigation.navigate('DashboadClientServiceDevis', {item: item})}
            style={[tw`bg-white rounded-lg px-1 py-1 mb-4 border-gray-100`, {elevation: 5, shadowColor: 'gray', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {width: 0, height: 5}, minWidth: 150, maxWidth: 400, width: windowWidth/2 - 20, minHeight: 200}]}
        >
            {/* <View></View> */}
            <Image 
                resizeMode='contain'
                defaultSource={require('../../../../assets/images/vectorpaint.png')}
                progressiveRenderingEnabled
                onProgress={(event) => event.nativeEvent}
                source={{uri: `${baseUri}/assets/files/service-devis/${item.image}`}}
                style={[tw``,{width: '100%', height: 200}]}
            />
            <View style={tw`px-2 flex-row justify-between items-center`}>
                <Text style={tw`text-center text-black flex-1`}>{item.intituler.replace('&amp;', '&')}</Text>
                <Icon type='evil-icon' name='chevron-right' color={CodeColor.code1} containerStyle={tw``} />
            </View>
        </TouchableOpacity>
    )

    const getServices = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('services', null)
        // @ts-ignore
        formData.append('token', user.slug)

        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                setServices([...json.services]);
                setEndFetch(true)
            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            console.warn(e)
        })
    }

    const onRefresh = () => {
        setRefresh(true);
        getServices();
    }

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
        } else {
            getServices();
        }
    }, [user])

    return (
        <Root theme='dark'>
        <Base>
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('services_screen.screen_title')}`} />
                }
            />
            {endFetch ? 
                <View style={[ tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl 
                                colors={refreshColor}
                                refreshing={refresh}
                                onRefresh={onRefresh}
                            />
                        }
                        contentContainerStyle={tw`pt-5 px-2 flex-row justify-between flex-wrap`}
                    >
                        {services.map((item: any, index: number) => renderItem(item, index))}
                    </ScrollView>
                </View>
            : <ActivityLoading />
            }

        </Base> 
        </Root>
    )
}

export default ServicesScreen;