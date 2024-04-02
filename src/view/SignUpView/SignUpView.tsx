import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, Image, ImageBackground, Keyboard, Linking, PixelRatio, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Base from '../../components/Base';
import tw from 'twrnc';
import { Card, Header, Icon, Button as ButtonRNE, CheckBox } from '@rneui/themed';
import  { default as HeaderP } from '../../components/Header';
import { Divider } from '@rneui/base';
import { account, baseUri, componentPaddingHeader, fetchUri, show_sign_checbox, toast, validateEmail, validatePassword, windowHeight } from '../../functions/functions';
import { useDispatch, useSelector } from 'react-redux';
import { ModalValidationForm } from '../../components/ModalValidationForm';
import { setSrc } from '../../feature/avatar.slice';
import { setVideoSdkToken } from '../../feature/videosdk.authtoken.slice';
import { CommonActions } from '@react-navigation/native';
import { clone, openUrl } from '../../functions/helperFunction';
import AuthBottomForm from '../../components/AuthBottomForm';
import InputForm2 from '../../components/InputForm2';
import Copyright from '../../components/Copyright';
import Termes from '../../components/Termes';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'

import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';

import '../../data/i18n';
import { useTranslation } from 'react-i18next';
import OAuthButton from '../../components/OAuthButton';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

interface SignUpViewProps {
    navigation: any,
    route: any
}

const SignUpView: React.FC<SignUpViewProps> = (props) => {

    const { t, i18n } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    const [googleUser, setGoogleUser] = useState({});
    
    const [accountUser, setAccountUser] = useState({});

    const [showModal, setShowModal] = useState(false)

    const [visible, setVisible] = useState({
        pickerCountry: false,
        pickerPhoneCountry: false
    })

    const [inputs, setInputs] = useState({
        nom: '',
        prenom: '',
        country: 'Bénin',
        country_code: 'BJ',
        ville: '',
        phone: '',
        calling_code: '+229',
        phone_country_code: 'BJ',
        email: '',
        password: '',
        isChecked: show_sign_checbox
    })

    const [errors, setErrors] = useState({
        nom: null,
        prenom: null,
        country: null,
        country_code: null,
        ville: null,
        phone: null,
        calling_code: null,
        phone_country_code: null,
        email: null,
        password: null,
    })

    const handleOnPickerChange = (key: string, value: boolean) => {
        setVisible(prevState => ({...prevState, [key]: value}))
    }

    const handleOnChange = (input: string, text?: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const onSelectCountry = (country: Country) => {
        // console.log('Country: ', country)
        handleOnChange('country', country.name)
        handleOnChange('country_code', country.cca2)
    }

    const onSelectPhoneCalling = (country: Country) => {
        console.log('Country: ', country)
        handleOnChange('phone_country_code', country.cca2)
        handleOnChange('calling_code', '+' + (country.callingCode[0] == undefined ? '00' : country.callingCode[0]))
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

    const onSubmit = () => {
        Keyboard.dismiss()
        let valid = true;

        if(!inputs.nom) {
            handleError('nom', `${t('sign_up_screen.is_required')}`)
            valid = false
        } else if(inputs.nom.trim() == '') {
            handleError('nom', `${t('sign_up_screen.no_blank')}`)
            valid = false
        } else {
            handleError('nom', null)
        }

        if(!inputs.prenom) {
            handleError('prenom', `${t('sign_up_screen.is_required')}`)
            valid = false
        } else if(inputs.prenom.trim() == '') {
            handleError('prenom', `${t('sign_up_screen.no_blank')}`)
            valid = false
        } else {
            handleError('prenom', null)
        }

        if(!inputs.email) {
            handleError('email', `${t('sign_up_screen.is_required')}`)
            valid = false
        } else if(!validateEmail(inputs.email)) {
            handleError('email', `${t('sign_up_screen.invalid_email')}`)
            valid = false
        } else {
            handleError('email', null)
        }

        if(!inputs.password) {
            handleError('password', `${t('sign_up_screen.is_required')}`)
            valid = false
        } else if(!validatePassword(inputs.password)) {
            handleError('password', `${t('sign_up_screen.password_contain')}`)
            valid = false
        } else {
            handleError('password', null)
        }

        if(!valid) {
            console.error('Erreur validation.')
        }
        else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_signup[nom]`, inputs.nom)
            formData.append(`${account}_signup[prenom]`, inputs.prenom)
            formData.append(`${account}_signup[email]`, inputs.email)
            formData.append(`${account}_signup[password]`, inputs.password)

            formData.append(`${account}_signup[country]`, inputs.country)
            formData.append(`${account}_signup[country_code]`, inputs.country_code)
            formData.append(`${account}_signup[ville]`, inputs.ville)

            formData.append(`${account}_signup[phone]`, inputs.phone)
            formData.append(`${account}_signup[phone_country_code]`, inputs.phone_country_code)
            formData.append(`${account}_signup[calling_code]`, inputs.calling_code)

            console.log('Form: ', formData)

            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                // console.log(json);
                if(json.success) {
                    if(json.videosdk_auth_token) {
                        dispatch(setVideoSdkToken(json.videosdk_auth_token))
                    }
                    toast('success', `${t('sign_up_screen.success_registration_text')}`, 'Notification', true)
                    const _user = json.user;
                    let image = _user.image;
                    const data = clone(_user);
                    if(data.img) {
                        data.img = `${baseUri}/assets/avatars/${image}`;
                    }
                    setAccountUser({...data})
                    // dispatch(setUser({...data}));
                } else {
                    const errors = json.errors;
                    console.log('Errors: ', errors);
                    for(let k in errors) {
                        handleError(k, errors[k]);
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
                    // width: 150, height: 70
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
                    <View style={[tw`flex-1 justify-center`, {}]}>
                        <View style={tw`flex-1 px-5 py-6`}>

                            <Text style={[tw`mt-0 mb-6 text-black text-center text-xl`, {fontFamily: 'YanoneKaffeesatz-Bold'}]}>{t('sign_up_screen.am_customer')}</Text>

                            <Divider style={tw`mx-20 mb-5`} color='#ccc' />

                            <View style={tw`py-4`}>

                                <InputForm2
                                    placeholder={`${t('sign_up_screen.first_name')}`}
                                    error={errors.prenom}
                                    onChangeText={(text: any) => handleOnChange('prenom', text)} />

                                <InputForm2
                                    placeholder={`${t('sign_up_screen.last_name')}`}
                                    error={errors.nom}
                                    onChangeText={(text: any) => handleOnChange('nom', text)} />

                                <View style={tw`mb-6`}>
                                    <View style={[ tw`flex-row justify-between items-center px-3 rounded-md border bg-white`, {borderColor: errors.country_code ? '#ff2222' : '#ccc', height: 50} ]}>
                                        <CountryPicker
                                            filterProps={{
                                                placeholder: `${t('sign_up_screen.search_placeholder')}`
                                            }}
                                            translation='fra'
                                            // @ts-ignore
                                            countryCode={inputs.country_code}
                                            withFilter
                                            withFlag
                                            withCountryNameButton
                                            // withAlphaFilter
                                            withCallingCode
                                            withEmoji
                                            onSelect={onSelectCountry}
                                            onClose={() => handleOnPickerChange('pickerCountry', false)}
                                            visible={visible.pickerCountry}
                                            containerButtonStyle={[tw``, {}]}
                                        />
                                        <Icon type='material-community' name='chevron-down' containerStyle={tw``} onPress={() => handleOnPickerChange('pickerCountry', true)} />
                                    </View>
                                    {errors.country && (
                                        <Text style={[ tw`text-orange-700 text-sm` ]}>{ errors.country }</Text>
                                    )}
                                </View>

                                <InputForm2
                                    value={inputs.ville}
                                    placeholder={`${t('sign_up_screen.city')}`}
                                    // formColor={Colors.dark}
                                    error={errors.ville}
                                    onChangeText={(text: any) => handleOnChange('ville', text)} />

                                <InputForm2 
                                    placeholder={`${t('sign_up_screen.phone')}`}
                                    keyboardType='number-pad'
                                    maxLength={16}
                                    value={inputs.phone}
                                    codeCountry={inputs.calling_code}
                                    codeCountryStyle={tw`text-sm`}
                                    leftComponent={
                                        <View style={[ tw`mr-0 flex-row items-center`, {} ]}>
                                            <CountryPicker
                                                filterProps={{
                                                    placeholder: `${t('sign_up_screen.search_placeholder')}`
                                                }}
                                                translation='fra'
                                                // @ts-ignore
                                                countryCode={inputs.phone_country_code}
                                                withFilter
                                                withFlag
                                                // withCountryNameButton
                                                // withAlphaFilter
                                                withCallingCode
                                                withEmoji
                                                onSelect={onSelectPhoneCalling}
                                                onClose={() => handleOnPickerChange('pickerPhoneCountry', false)}
                                                visible={visible.pickerPhoneCountry}
                                            />
                                            <Icon type='material-community' name='chevron-down' containerStyle={tw``} onPress={() => handleOnPickerChange('pickerPhoneCountry', true)} />
                                        </View>
                                    }
                                    error={errors.phone}
                                    onChangeText={(text: any) => handleOnChange('phone', text)}
                                />

                                <InputForm2
                                    placeholder={`${t('sign_up_screen.email')}`}
                                    keyboardType='email-address'
                                    error={errors.email}
                                    onChangeText={(text: any) => handleOnChange('email', text)} />

                                <InputForm2
                                    placeholder={`${t('sign_up_screen.password')}`}
                                    password={true}
                                    error={errors.password}
                                    onChangeText={(text: any) => handleOnChange('password', text)} />

                                <Termes style={tw`mb-5 text-slate-600`} />

                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={onSubmit}
                                    style={[tw`mb-4 font-bold justify-center bg-black`, {borderRadius: 7, height: 50 }]}>
                                    <Text style={[tw`text-white text-center text-lg`]}>{t('sign_up_screen.sign_up')}</Text>
                                </TouchableOpacity>

                                <View style={tw`flex-row items-center mx-10`}>
                                    <Divider style={tw`flex-1`} />
                                    <Text style={tw`mx-3 uppercase text-black`}>Or</Text>
                                    <Divider style={tw`flex-1`} />
                                </View>
                                <OAuthButton setUser={setGoogleUser} signin='non' setShowValidationModal={setShowModal} />

                            </View>

                            <Text style={[tw`mt-0 text-black text-center`]}>{t('sign_up_screen.have_account')} <Text onPress={() => navigation.navigate('SignIn')} style={[tw`text-amber-800`]}>{t('sign_up_screen.log_in')}</Text></Text>

                        </View>

                        <View style={tw`mt-8 px-10`}>
                            <Text style={tw`text-black text-center mb-3`}>{t('sign_up_screen.follow_us')}:</Text>
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

export default SignUpView;