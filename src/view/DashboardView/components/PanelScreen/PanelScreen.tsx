import React, { Children, useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { baseUri, componentPaddingHeader, getUser } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import  { default as HeaderP } from '../../../../components/Header';
import { Icon } from '@rneui/base';
import { ImageSource } from 'react-native-vector-icons/Icon';
import ImageView from 'react-native-image-viewing';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const Button: React.FC<{
    navigation: any,
    route: string,
    title: string,
    iconName: string
}> = ({navigation, route, title, iconName}) => {
    return (
        <Pressable 
            onPress={() => navigation.navigate(route)}
            style={[ tw`rounded-xl p-4 mb-4 justify-center`, {backgroundColor: CodeColor.code1, width: 150, minHeight: 120} ]}>
            <Icon type='material-community' name={iconName} size={40} color='#FFFFFF' />
            <Text style={[ tw`text-center text-white`, {fontFamily: 'YanoneKaffeesatz-Regular'} ]}>{title}</Text>
        </Pressable>
    )
}

interface PanelScreenProps {
    navigation?: any,
    route?: any
}
const PanelScreen: React.FC<PanelScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    // @ts-ignore
    const user = useSelector(state => state.user.data)
    
    const path = user.image ? {uri: user.image} : require('../../../../assets/images/user-1.png');

    const [visible, setVisible] = useState(false)

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

    // fontFamily: 'YanoneKaffeesatz-Regular',

    return (
        <Base>
            <ImageView 
                images={[path]} 
                imageIndex={0} 
                visible={visible}
                animationType='slide'
                // presentationStyle='fullScreen'
                doubleTapToZoomEnabled
                onRequestClose={function (): void {
                    setVisible(false)
                    // throw new Error('Function not implemented.');
                }}
                keyExtractor={(imageSrc: ImageSource, index: number) => index.toString()}
            />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('account_screen.screen_title')}`} />
                }
            />
            <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
                <ScrollView>
                    <View style={[tw`py-4 px-3 text-base`]}>
                        <View style={[tw`items-center`]}>
                            <Pressable onPress={() => setVisible(true)} disabled={user.image ? false : true} style={[tw`justify-center items-center rounded-full overflow-hidden`, { backgroundColor: '#f4f4f4', width: 130, height: 130 }]}>
                                <Image
                                    style={[tw`rounded-full`, { width: 100, height: 100, resizeMode: 'contain' }]}
                                    source={path} />
                            </Pressable>
                        </View>
                        <View style={[tw`mt-8 flex-row flex-wrap justify-around items-center`]}>
                            <Button route='DashboadPanelProfil' navigation={navigation} title={`${t('account_screen.edit_my_profile')}`} iconName='account-edit' />
                            <Button route='DashboadPanelPassword' navigation={navigation} title={`${t('account_screen.change_my_password')}`} iconName='account-key' />
                        </View>

                        <View style={[tw`mt-8 flex-row flex-wrap justify-around items-center`]}>
                            <Button route='DashboadMessages' navigation={navigation} title={`${t('account_screen.message')}`} iconName='message' />
                            <Button route='DashboadHistoriqueCdc' navigation={navigation} title={`${t('account_screen.projects')}`} iconName='history' />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Base>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        color: 'rgb(4,28,84)',
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 18,
        fontFamily: 'serif'
    },
    paragraph: {
        color: 'rgb(4,28,84)',
        lineHeight: 20,
        textAlign: 'justify',
        fontFamily: 'sans-serif'
    }
})

export default PanelScreen;