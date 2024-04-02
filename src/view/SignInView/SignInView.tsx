import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, Image, ImageBackground, Keyboard, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../components/Base';
import tw from 'twrnc';
import { Card, Header, Button as ButtonRNE, CheckBox } from '@rneui/themed';
import  { default as HeaderP } from '../../components/Header';
import { ModalValidationForm } from '../../components/ModalValidationForm';
import { account, baseUri, componentPaddingHeader, fetchUri, show_sign_checbox, windowHeight } from '../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { clone, openUrl } from '../../functions/helperFunction';
import { setUser } from '../../feature/user.slice';
import AuthBottomForm from '../../components/AuthBottomForm';
import Copyright from '../../components/Copyright';
import InputForm2 from '../../components/InputForm2';
import { setStopped } from '../../feature/init.slice';
import { setVideoSdkToken } from '../../feature/videosdk.authtoken.slice';
import Termes from '../../components/Termes';
import { Divider } from '@rneui/base';
import '../../data/i18n';
import { useTranslation } from 'react-i18next';
import OAuthButton from '../../components/OAuthButton';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

interface SignInViewProps {
    navigation: any,
    route: any
}

const SignInView: React.FC<SignInViewProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    const [googleUser, setGoogleUser] = useState({});

    const [accountUser, setAccountUser] = useState({});

    const [showModal, setShowModal] = React.useState(false)

    const [inputs, setInputs] = React.useState({
        email: '',
        password: '',
        isChecked: !show_sign_checbox
    })

    const [errors, setErrors] = React.useState({
        email: null,
        password: null
    })

    const handleOnChange = (text: any, input: string) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (text: any, input: string) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const confirmationAccount = () => {
        navigation.navigate('Otp', {user: accountUser})
    }

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

    const onSubmit = async () => {
        Keyboard.dismiss()
        let valid = true
        if(!inputs.email) {
            valid = false
            handleError(`${t('login_screen.is_required')}`, 'email')
        } else {
            handleError(null, 'email')
        }

        if(!inputs.password) {
            valid = false
            handleError(`${t('login_screen.is_required')}`, 'password')
        } else {
            handleError(null, 'password')
        }

        if(!valid) {
            console.error('Invalid Form')
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_signin[email]`, inputs.email)
            formData.append(`${account}_signin[password]`, inputs.password)
            fetch(fetchUri, {
                method: 'POST',
                headers: {},
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                if(json.success) {
                    if(json.videosdk_auth_token) {
                        dispatch(setVideoSdkToken(json.videosdk_auth_token))
                    }
                    const _user = json.user;
                    let image = _user.image;
                    const data = clone(_user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    if(data.valide == 1) {
                        dispatch(setStopped(false))
                        dispatch(setUser({...data}));
                    } else {
                        setAccountUser({...data})
                    }
                } else {
                    const errors = json.errors
                    console.log('errors: ', errors)
                    for(let k in errors) {
                        handleError(errors[k], k);
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
        if(Object.keys(accountUser).length !== 0) {
            confirmationAccount();
        }
    }, [accountUser])

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
                        style={{ width: 100, height: 70, resizeMode: 'contain' }}
                        source={require('../../assets/images/logo-4.png')} />
                }
                centerContainerStyle={tw`items-center`}
                rightComponent={
                    <></>
                }
            />

            <View style={[tw`flex-1 bg-white`, {height: windowHeight}]}>
                <ScrollView contentContainerStyle={[tw``, {minHeight: '100%'}]}>
                    <View style={[tw`flex-1 justify-center`]}>
                        <View style={tw`flex-1 px-5 py-6`}>

                            <Text style={[ tw`mt-0 mb-6 text-black text-center text-xl`, {fontFamily: 'YanoneKaffeesatz-Bold'}]}>{t('login_screen.am_customer')}</Text>

                            <Divider style={tw`mx-20 mb-5`} color='#ccc' />

                            <View style={[tw`py-4`, { height: 'auto' }]}>
                                <>
                                    <InputForm2
                                        placeholder={`${t('login_screen.email')}`}
                                        keyboardType='email-address'
                                        onChangeText={(text: string) => handleOnChange(text, 'email')}
                                        error={errors.email} />

                                    <InputForm2
                                        placeholder={`${t('login_screen.password')}`}
                                        password={true}
                                        onChangeText={(text: string) => handleOnChange(text, 'password')}
                                        error={errors.password} />

                                    <View style={tw`items-end mb-4`}>
                                        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} activeOpacity={0.5} style={tw``}>
                                            <Text style={tw`text-black`}>{t('login_screen.forgot_password')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={onSubmit}
                                        style={[ tw`mb-4 justify-center bg-black`, {borderRadius: 7, height: 50} ]}>
                                        <Text style={[ tw`text-white text-center text-lg` ]}>{t('login_screen.login')}</Text>
                                    </TouchableOpacity>
                                </>

                                <Termes style={tw`mb-5 text-slate-600`} />

                                <View style={tw`flex-row items-center mx-10`}>
                                    <Divider style={tw`flex-1`} />
                                    <Text style={tw`mx-3 uppercase text-black`}>Or</Text>
                                    <Divider style={tw`flex-1`} />
                                </View>
                                <OAuthButton setUser={setGoogleUser} signin='oui' setShowValidationModal={setShowModal} />

                            </View>

                            <Text style={[ tw`mt-0 text-black text-center`, { }]}>{t('login_screen.no_account')} <Text onPress={() => navigation.goBack()} style={[ tw`text-amber-800` ]}>{t('login_screen.sign_up')} !</Text></Text>

                        </View>

                        <View style={tw`mt-8 px-10`}>
                            <Text style={tw`text-black text-center mb-3`}>{t('login_screen.follow_us')}:</Text>
                            <AuthBottomForm />
                        </View>

                        <Copyright />

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

export default SignInView;