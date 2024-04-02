import React, { Children, useEffect, useState } from 'react';
import { Button, Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setNotify } from '../../../../feature/switch.notification.slice';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, componentPaddingHeader, fetchUri, getUser, toast } from '../../../../functions/functions';
import { deleteUser, setUser, setUserIndex } from '../../../../feature/user.slice';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { Modal } from 'react-native-form-component';
import IconSocial from '../../../../components/IconSocial';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { Dialog, ALERT_TYPE, Root } from 'react-native-alert-notification';
import { CommonActions } from '@react-navigation/native';
import  { default as HeaderP } from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { Divider, Icon } from '@rneui/base';
import { clearMessages } from '../../../../feature/messages.slice';
import { setStopped } from '../../../../feature/init.slice';
import { getApiLevel, getReadableVersion, getVersion, useDeviceName, useIsEmulator, useManufacturer } from 'react-native-device-info';
import { getErrorsToString, openUrl, rs } from '../../../../functions/helperFunction';
import { ActivityIndicator } from 'react-native-paper';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const timer = require('react-native-timer');

interface ParamItemProps {
    title?: string,
    titleComponent?: React.ReactElement,
    description?: string,
    onPress?: any,
    hasDivider?: boolean,
    disabled?: boolean
}
const ParamItem: React.FC<ParamItemProps> = ({title, titleComponent, description, onPress=()=>{}, hasDivider, disabled}) => {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                touchSoundDisabled
                activeOpacity={0.5}
                style={tw`flex-1 px-3`}
            >
                {titleComponent && (
                    titleComponent
                )}
                {title && (
                    <View style={tw`flex-row`}>
                        <Text style={[tw`text-base mb-1 text-gray-500`, styles.paramTitle]}>{title}</Text>
                    </View>
                )}
                {description && (
                    <Text style={tw`text-xs text-slate-500`}>{description}</Text>
                )}
            </TouchableOpacity>
            {hasDivider && (
                <View style={tw`px-5 my-3`}><Divider color='#ffffff' /></View>
            )}
        </>
    )
}

interface ParamProps {
    title: string,
    style?: any,
    onPress?: any
}
const Param: React.FC<ParamProps> = ({title, style, children, ...props}) => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={[ styles.paramsContainer, style ]}>
            <Text style={[ tw`text-lg text-slate-600 flex-1`, styles.paramTitle ]} {...props}>{ title }</Text>
            { children }
        </TouchableOpacity>
    )
}

interface ParametresScreenProps {
    navigation?: any,
    route?: any
}
const ParametresScreen: React.FC<ParametresScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch()

    // @ts-ignore
    const user = useSelector(state => state.user.data)

    const [showModal, setShowModal] = useState(false)

    const [activeModal, setActiveModal] = useState(false)

    const [visible, setVisible] = useState(false)

    const { loading, result } = useManufacturer();

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

    const signOut = async () => {
        setShowModal(true)
        dispatch(setStopped(true));
        dispatch(clearMessages());
        timer.setTimeout('params', () => {
            if(timer.intervalExists('home-get-data')) timer.clearInterval('home-get-data')
            setShowModal(false);
            dispatch(deleteUser());
        }, 3000);
    }

    const onHandlePickerNotification = async (value: boolean) => {
        console.log('Value: ', value)
        // setShowModal(true)
        setVisible(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append(`${account}_notification`, null)
        formData.append('value', value ? 1 : 0);
        // @ts-ignore
        formData.append('token', user.slug)

        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(async json => {
            // setShowModal(false)
            setVisible(false);
            if(json.success) {
                dispatch(setUserIndex({accept_notification: json.user.accept_notification}))
            } else {
                const errors = json.errors
                toast('error', getErrorsToString(errors.account))
                console.warn(errors)
            }
        })
        .catch(e => {
            console.warn(e)
            setVisible(false);
        })
    }

    const deleteAccount = async () => {
        setShowModal(true)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append(`${account}_delete_account`, null)
        // @ts-ignore
        formData.append('token', user.slug)

        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(async json => {
            setShowModal(false)
            if(json.success) {
                if(timer.intervalExists('home-get-data')) timer.clearInterval('home-get-data')
                dispatch(setStopped(true));
                dispatch(clearMessages())
                dispatch(deleteUser());
                // goHome()
            } else {
                const errors = json.errors
                console.warn(errors.account)
            }
        })
        .catch(e => console.warn(e))
    }

    useEffect(() => {
        if(Object.keys(user).length == 0) {
            goHome();
        }
    }, [user])

    useEffect(() => {
        return () => {
            if(timer.timeoutExists('params')) timer.clearTimeout('params')
        }
    },[])

    return (
        <Root theme='dark'>
        <Base>
            <Modal
                animationType='fade'
                show={activeModal}
                backgroundColor={'rgba(0,0,0,0.4)'}>
                <View style={tw`flex-1 justify-center items-center`}>
                    <View style={[tw`p-10 rounded-xl relative`, { backgroundColor: CodeColor.code1 }]}>
                        <View style={[tw`absolute top-2 right-5`]}>
                            <IconSocial iconName='close' iconColor='black' iconSize={15} onPress={() => setActiveModal(false)} />
                        </View>
                        <Text style={[tw`mt-5 text-xl text-center`, { color: Colors.light }]}>{t('settings_screen.msg_modal_delete_account')}</Text>
                        <TouchableOpacity
                            onPress={() => deleteAccount()}
                            style={[tw`mt-8 p-4 rounded-2xl`, { backgroundColor: CodeColor.code3 }]}>
                            <Text style={[tw`text-white text-center text-2xl font-semibold`]}>{t('settings_screen.continue')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ModalValidationForm showM={showModal} />

            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('settings_screen.screen_title')}`} fontSize={'text-xl'} />
                }
            />

            <View style={[tw`flex-1 py-5`, { backgroundColor: '#ffffff' }]}>
                <ScrollView>
                    <View style={tw`mx-3 bg-gray-50 rounded-xl p-4`}>
                        <ParamItem hasDivider
                            onPress={() => onHandlePickerNotification(user.accept_notification !== 1)}
                            titleComponent={
                                <View style={[tw`flex-row justify-between items-center`]}>
                                    <View style={tw`flex-row items-center mb-1 mr-2`}>
                                        <Text style={[tw`text-base text-gray-500 mr-2`, styles.paramTitle]}>{t('settings_screen.notifications')}</Text>
                                        {visible && (
                                            <ActivityIndicator size={20} color='silver' />
                                        )}
                                    </View>
                                    <Switch trackColor={{
                                        false: 'gray',
                                        true: '#000'
                                    }} color='#000' value={user.accept_notification == 1} onValueChange={onHandlePickerNotification} />
                                </View>
                            }
                            description={`${t('settings_screen.receive_notifications')}`}
                        />
                        <ParamItem title={`${t('settings_screen.logout')}`} hasDivider
                            onPress={() => {
                                Dialog.show({
                                    type: ALERT_TYPE.DANGER,
                                    title: `${t('settings_screen.disconnect')}`,
                                    textBody: `${t('settings_screen.msg_logged_out')}`,
                                    button: `${t('settings_screen.continue')}`,
                                    onPressButton: () => signOut()
                                })
                            }}
                        />
                        <ParamItem title={`${t('settings_screen.about_utech')}`} hasDivider
                            onPress={() => openUrl(rs.a_propos)}
                            // onPress={() => navigation.navigate('DashboadSetting', { title: t('settings_screen.about_utech'), key: 'a-propos', index: 3 })}
                        />
                        <ParamItem title={`${t('settings_screen.terms')}`} hasDivider
                            onPress={() => openUrl(rs.conditions_d_utilisation)}
                            // onPress={() => navigation.navigate('DashboadSetting', { title: t('settings_screen.terms'), key: 'conditions-d-utilisation', index: 4 })}
                        />
                        <ParamItem title={`${t('settings_screen.privacy_policy')}`} hasDivider
                            onPress={() => openUrl(rs.politique_de_confidentialite)}
                            // onPress={() => navigation.navigate('DashboadSetting', { title: t('settings_screen.privacy_policy'), key: 'politique-de-confidentialte', index: 5 })}
                        />
                        <ParamItem title={`${t('settings_screen.help')}`} hasDivider
                            onPress={() => navigation.navigate('DashboadAide')}
                        />
                        <ParamItem title={`${t('settings_screen.delete_account')}`} hasDivider
                            onPress={() => setActiveModal(true)}
                        />
                        <ParamItem title={`${t('settings_screen.version')}`} description={getVersion()} disabled />
                    </View>
                </ScrollView>
            </View>
        </Base>
        </Root>
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
    },
    paramsContainer: {
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 12,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    paramTitle: {
        fontFamily: 'YanoneKaffeesatz-Regular',
        // fontWeight: '600',
    }
})

export default ParametresScreen;