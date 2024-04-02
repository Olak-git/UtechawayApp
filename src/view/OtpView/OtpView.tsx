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
import { Divider } from '@rneui/base';
import Copyright from '../../components/Copyright';
import { setStopped } from '../../feature/init.slice';
import '../../data/i18n';
import { useTranslation } from 'react-i18next';

interface OtpViewProps {
    navigation: any,
    route: any
}
const OtpView: React.FC<OtpViewProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    const {user: accountUser} = route.params;

    const [showModal, setShowModal] = React.useState(false)

    const [otp, setOtp] = useState('');

    const [error, setError] = useState<string|null>(null);

    const [height, setHeight] = useState(windowHeight - 152);

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
        if(!otp) {
            valid = false
            setError(t('account_confirmation_screen.is_required'));
        } else {
            setError(null)
        }

        if(!valid) {
            console.error('Invalid Form')
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_opt`, otp)
            formData.append(`token`, accountUser.slug)
            formData.append('confirmation-otp', null)
            fetch(fetchUri, {
                method: 'POST',
                headers: {},
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                if(json.success) {
                    const user = json.user;
                    let image = user.image;
                    const data = clone(user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setStopped(false))
                    dispatch(setUser({...data}));
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

    const getNewCode = () => {
        setShowModal(true)
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`token`, accountUser.slug)
        formData.append('new-otp-code', null)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {}
        })
        .then(response => response.json())
        .then(async json => {
            setShowModal(false)
            if(json.success) {
                toast('success', `${t('account_confirmation_screen.msg_new_otp_code_generated')}`)
            } else {
                const errors = json.errors
                toast('error', getErrorsToString(errors))
            }
        })
        .catch(e => {
            setShowModal(false)
            console.warn(e)
        })
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
            
            <View style={[tw`flex-1`, {height: windowHeight}]}>
                {/* <View style={[tw`justify-center items-center`, StyleSheet.absoluteFill]}>
                    <Image source={require('../../assets/images/prs_dans_le_monde.png')} style={[{width: PixelRatio.getPixelSizeForLayoutSize(80), height: PixelRatio.getPixelSizeForLayoutSize(80)}]} />
                </View> */}
                
                <ScrollView contentContainerStyle={[tw``, {minHeight: '100%'}]}>
                    <View style={[tw`flex-1 justify-center px-10`]}>

                        <Text style={tw`text-gray-500 mt-5`}>{t('account_confirmation_screen.confirmation_code_text')}</Text>
                            
                        <View style={[tw`mt-4 mb-6`, {}]}>
                            <Text style={[tw`text-gray-600 text-center text-lg font-medium`, {}]}>{t('account_confirmation_screen.account_confirmation')}</Text>
                        </View>

                        <Divider style={tw`mb-3`} />

                        <View style={[tw`px-7 py-4`, { height: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 20 }]}>
                            <>
                                <InputForm2
                                    placeholder={`${t('account_confirmation_screen.confirmation_code')}`}
                                    // keyboardType=''
                                    value={otp}
                                    onChangeText={(text: string) => setOtp(text)}
                                    error={error}
                                    formColor='#eee'
                                    inputStyle={tw`text-center`}
                                />

                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={onSubmit}
                                    style={[tw`mb-4 justify-center`, { backgroundColor: CodeColor.code1, borderRadius: 7, height: 50 }]}>
                                    <Text style={[tw`text-white text-center text-lg`]}>{t('account_confirmation_screen.confirm')}</Text>
                                </TouchableOpacity>
                            </>

                        </View>

                        <Divider />

                        <View style={[tw`mt-5 mb-2`, {}]}>
                            <Pressable onPress={getNewCode}>
                                <Text style={[tw`text-slate-400 text-center`, {}]}>{t('account_confirmation_screen.new_code')}</Text>
                            </Pressable>
                        </View>
                    
                    </View>

                    <Copyright />

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

export default OtpView;