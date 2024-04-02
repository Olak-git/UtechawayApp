import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, ImageBackground, Keyboard, Linking, PixelRatio, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../components/Base';
import tw from 'twrnc';
import { Card, Header, Button as ButtonRNE, CheckBox } from '@rneui/themed';
import  { default as HeaderP } from '../../components/Header';
import { ModalValidationForm } from '../../components/ModalValidationForm';
import { account, baseUri, componentPaddingHeader, fetchUri, show_sign_checbox, toast, windowHeight, windowWidth } from '../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { clone, getErrorsToString, openUrl } from '../../functions/helperFunction';
import { setUser } from '../../feature/user.slice';
import { CodeColor } from '../../assets/style';
import AuthBottomForm from '../../components/AuthBottomForm';
import InputForm2 from '../../components/InputForm2';
import { Divider, Icon } from '@rneui/base';
import Copyright from '../../components/Copyright';
import '../../data/i18n';
import { useTranslation } from 'react-i18next';

interface ResetPasswordViewProps {
    navigation: any,
    route: any
}
const ResetPasswordView: React.FC<ResetPasswordViewProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    const [showModal, setShowModal] = React.useState(false)

    const [email, setEmail] = useState('');

    const [error, setError] = useState<string|null>(null);

    const [height, setHeight] = useState(windowHeight - 152);

    const [visible, setVisible] = useState(false);

    Keyboard.addListener('keyboardDidShow', (listener) => {
        setHeight(windowHeight - 152 - listener.endCoordinates.height)
        console.log('Show');
    })
    
    Keyboard.addListener('keyboardDidHide', (listener) => {
        setHeight(windowHeight - 152 - listener.endCoordinates.height)
        console.log('Hide');
    })

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'DashboadClientHome'}
                ]
            })
        )
    }

    const onSubmit = () => {
        Keyboard.dismiss()
        let valid = true
        if(!email) {
            valid = false
            setError('Est requis');
        } else {
            setError(null)
        }

        if(!valid) {
            console.error('Invalid Form')
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('user', null)
            formData.append('reset-password', null)
            formData.append(`${account}_psw_f[email]`, email)
            // formData.append('confirmation-otp', null)
            fetch(fetchUri, {
                method: 'POST',
                headers: {},
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                if(json.success) {
                    toast('success', json.success_message || `${t('rest_password_screen.msg_new_password_generate')}`)
                    setVisible(true)
                } else {
                    const errors = json.errors
                    for(let k in errors) {
                        setError(errors[k])
                    }
                }
            })
            .catch(e => {
                setShowModal(false)
                console.warn(e)
            })
        }
    }

    useEffect(() => {
        if(Object.keys(user).length !== 0) {
            goDashboard();
        }
    }, [user])

    useEffect(() => {
        return () => {
            Keyboard.removeAllListeners('keyboardDidShow')
            Keyboard.removeAllListeners('keyboardDidHide')
        }
    }, [])

    return (
        <Base>
            <ModalValidationForm showM={showModal} />
            <HeaderP
                elevated={true}
                withStatusbar
                backgroundColor='#000'
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <Pressable onPress={() => navigation.goBack()}>
                        <Image 
                            style={{ width: 30, height: 60, resizeMode: 'contain' }}
                            source={require('../../assets/images/arrow-left.png')} />
                    </Pressable>
                }
                centerComponent={
                    <Image
                        resizeMode='contain'
                        style={{ width: 150, height: 70, resizeMode: 'contain' }}
                        source={require('../../assets/images/logo.png')} />
                }
                centerContainerStyle={tw`items-center`}
                rightComponent={
                    <></>
                }
            />
            
            <View style={[tw`flex-1`, {}]}>
                <View style={[tw`justify-center items-center`, StyleSheet.absoluteFill]}>
                    <Image source={require('../../assets/images/prs_dans_le_monde.png')} style={[{width: PixelRatio.getPixelSizeForLayoutSize(80), height: PixelRatio.getPixelSizeForLayoutSize(80)}]} />
                </View>
                
                <ScrollView contentContainerStyle={[tw``, {minHeight: height}]}>
                    <View style={[tw`flex-1 justify-center px-10`]}>
                            
                        <View style={[tw`mt-4 mb-6`, {}]}>
                            <Text style={[tw`text-gray-600 text-center text-lg font-medium`, {}]}>{t('rest_password_screen.password_reset')}</Text>
                        </View>

                        <Divider style={tw`mb-3`} />

                        <View style={[tw`px-7 py-4`, { height: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 20 }]}>
                            <>
                                <InputForm2
                                    placeholder={`${t('rest_password_screen.account')}`}
                                    label={`${t('rest_password_screen.enter_addr_email')}`}
                                    // keyboardType=''
                                    value={email}
                                    onChangeText={(text: string) => setEmail(text)}
                                    error={error}
                                    formColor='#eee'
                                    inputStyle={tw``}
                                />

                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={onSubmit}
                                    style={[tw`mb-4 justify-center`, { backgroundColor: CodeColor.code1, borderRadius: 7, height: 50 }]}>
                                    <Text style={[tw`text-white text-center text-lg`]}>{t('rest_password_screen.confirm')}</Text>
                                </TouchableOpacity>
                            </>

                        </View>

                        {visible && (
                            <>
                                <Divider />
                                <View style={[tw`mt-5 mb-2`, {}]}>
                                    <Pressable onPress={() => navigation.goBack()}>
                                        <Icon type='ant-design' name='arrowleft' color={CodeColor.code1} />
                                        <Text style={[tw`text-slate-400 text-center`, {}]}>{t('rest_password_screen.back_to_login_page')}</Text>
                                    </Pressable>
                                </View>  
                            </>
                        )}
                    
                    </View>
                </ScrollView>

            </View>

            <Copyright />

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

export default ResetPasswordView;