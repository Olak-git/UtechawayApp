import React, { Children, useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, fetchUri, headers, requestPermissions, toast, validateEmail, validatePhoneNumber } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import InputForm from '../../../../components/InputForm';
import InputForm2 from '../../../../components/InputForm2';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { setUser } from '../../../../feature/user.slice';
import IconSocial from '../../../../components/IconSocial';
import FilePicker, { types } from  'react-native-document-picker';
import { CommonActions } from '@react-navigation/native';
import { cameraPermission, clone } from '../../../../functions/helperFunction';
import { CodeColor } from '../../../../assets/style';
import  { default as HeaderP } from '../../../../components/Header';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal'
import { Icon } from '@rneui/base';
import { SwipeablePanel } from 'rn-swipeable-panel';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

interface PanelProfilScreenProps {
    navigation?: any,
    route?: any
}

const PanelProfilScreen: React.FC<PanelProfilScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const path = user.image ? {uri: user.image} : require('../../../../assets/images/user-1.png');

    const [profil, setProfil] = useState(path);

    const [endFetch, setEndFetch] = useState(false)

    const [showModal, setShowModal] = useState(false);

    const [visible, setVisible] = useState({
        pickerCountry: false,
        pickerPhoneCountry: false
    })

    const [inputs, setInputs] = useState({
        nom: '',
        prenom: '',
        email: '',
        country: 'Bénin',
        country_code: 'BJ',
        ville: '',
        phone: '',
        calling_code: '+229',
        phone_country_code: 'BJ',
        avatar: {}
    })

    const [errors, setErrors] = useState({
        nom: null,
        prenom: null,
        email: null,
        country: null,
        country_code: null,
        ville: null,
        phone: null,
        calling_code: null,
        phone_country_code: null,
        avatar: null
    })

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(false);

    const handleOnPickerChange = (key: string, value: boolean) => {
        setVisible(prevState => ({...prevState, [key]: value}))
    }
    
    const handleOnChange = (input: string, text?: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const options = {
        // saveToPhotos: true,
        mediaType: 'photo'
    }

    const openCamera = async () => {
        const granted = await cameraPermission()
        if(granted) {
            // @ts-ignore
            const result = await launchCamera(options);
            if(result.assets) {
                // @ts-ignore
                const resp = result.assets[0];
                setProfil({uri: resp.uri});
                setInputs((prevState: any) => ({
                    ...prevState,
                    avatar: {
                        "fileCopyUri": null, 
                        "name": resp.fileName,
                        "size": resp.fileSize, 
                        "type": resp.type, 
                        "uri": resp.uri
                    }
                }))
            }
            closePanel()
        }
    }

    const openGallery = async () => {
        // @ts-ignore
        const result = await launchImageLibrary(options)
        console.log('Result: ', result);
        closePanel()
    }
    
    const openPanel = () => {
        setIsPanelActive(true);
    };
    
    const closePanel = () => {
        setIsPanelActive(false);
    };

    const onSelectCountry = (country: Country) => {
        console.log('Country: ', country)
        handleOnChange('country', country.name)
        handleOnChange('country_code', country.cca2)
    }

    const onSelectPhoneCalling = (country: Country) => {
        console.log('Country: ', country)
        handleOnChange('phone_country_code', country.cca2)
        handleOnChange('calling_code', '+' + (country.callingCode[0] == undefined ? '00' : country.callingCode[0]))
    }

    const getValue = (value: any, b:any = '') => {
        return value ? value : b;
    }

    const onSubmit = () => {
        Keyboard.dismiss()
        let valid = true;

        if(!inputs.nom) {
            handleError('nom', t('profile_edition_screen.is_required'))
            valid = false
        } else if(inputs.nom.trim() == '') {
            handleError('nom', t('profile_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('nom', null)
        }

        if(!inputs.prenom) {
            handleError('prenom', t('profile_edition_screen.is_required'))
            valid = false
        } else if(inputs.prenom.trim() == '') {
            handleError('prenom', t('profile_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('prenom', null)
        }

        if(!inputs.email) {
            handleError('email', t('profile_edition_screen.is_required'))
            valid = false
        } else if(!validateEmail (inputs.email)) {
            handleError('email', t('profile_edition_screen.invalid_email'))
            valid = false
        } else {
            handleError('email', null)
        }

        // if(inputs.phone !== '' && inputs.phone !== null && !validatePhoneNumber(inputs.phone)) {
        //     handleError('phone', 'Format invalide (Ex: +14151234567)')
        //     valid = false
        // } else {
        //     handleError('phone', null)
        // }

        // handleError('avatar', null)

        if(!valid) {
            console.error('Erreur validation.')
            console.log('errors:', errors)
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append('token', user.slug)
            formData.append(`${account}_upd_profil[nom]`, inputs.nom)
            formData.append(`${account}_upd_profil[prenom]`, inputs.prenom)
            formData.append(`${account}_upd_profil[email]`, inputs.email)
            formData.append(`${account}_upd_profil[country]`, inputs.country)
            formData.append(`${account}_upd_profil[country_code]`, inputs.country_code)
            formData.append(`${account}_upd_profil[ville]`, inputs.ville)
            formData.append(`${account}_upd_profil[phone]`, inputs.phone == null ? '' : inputs.phone)
            formData.append(`${account}_upd_profil[phone_country_code]`, inputs.phone_country_code)
            // formData.append(`${account}_upd_profil[phone_country_code]`, inputs.phone == null ? '' : inputs.phone_country_code)
            formData.append(`${account}_upd_profil[calling_code]`, inputs.calling_code)
            // formData.append(`${account}_upd_profil[calling_code]`, inputs.phone == null ? '' : inputs.calling_code)
            // @ts-ignore
            if(Object.keys(inputs.avatar).length !== 0) {
                console.log('FileAvatar: ', inputs.avatar)
                formData.append('avatar', inputs.avatar)
            }
            console.log('FormaData: ', formData)

            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'multipart/form-data'
                }
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false);
                if(json.success) {
                    const _user = json.user;
                    let image = _user.image;
                    const data = clone(_user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
                    toast('success', t('profile_edition_screen.msg_success_change_profile'), 'Notification', true)
                } else {
                    const errors = json.errors
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                    console.log('Errors: ', errors);
                }
            })
            .catch(e => {
                setShowModal(false)
                console.warn(e)
            })
        }
    }

    const handleFilePicker = async () => {
        try {
            const response = await FilePicker.pick({
                presentationStyle: 'fullScreen',
                type: types.images,
                allowMultiSelection: false
            })
            FilePicker.isCancel((err: any) => {
                console.log(err);
            })
            console.log('ResponseFilePicker: ', response)
            setProfil({uri: response[0].uri})
            setInputs((prevState) => ({ ...prevState, avatar: response[0]}))
            closePanel()
        } catch(err) {
            console.log(err)
        }
    }

    const getProfil = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('profile', null)
        formData.append('user', account)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(async json => {
            setEndFetch(true);
            if(json.success) {
                const _user = json.user;
                let image = _user.image;
                const data = clone(_user);
                // console.log('User: ', json.user);
                if(data.image) {
                    data.image = `${baseUri}/assets/avatars/${image}`;
                }

                dispatch(setUser({...data}));
                setInputs(prevState => ({
                    ...prevState, 
                    nom: _user.nom, 
                    prenom: _user.prenom, 
                    email: _user.email, 
                    country: _user.country,
                    country_code: getValue(_user.country_code, 'BJ'),
                    ville: getValue(_user.ville),
                    phone: _user.phone ? _user.phone.replace(/ /g, '').replace(_user.calling_code, '') : _user.phone,
                    calling_code: getValue(_user.calling_code, '+229'),
                    phone_country_code: getValue(_user.phone_country_code, 'BJ'),
                    // avatar: null
                }))
            } else {
                console.warn(json.errors);
            }
        })
        .catch(e => {
            console.warn(e)
        })
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

    const kj = async () => {
        const granted = await cameraPermission()
        if(granted) {
            const result = await launchCamera({
                mediaType: 'photo',
                maxWidth: 100
            })
            console.log('Result: ', result);
        }

        // const result = await launchCamera({
        //     mediaType: 'photo',
        //     maxWidth: 100
        // })
        // console.log('Result: ', result);
    }

    useEffect(() => {
        if(Object.keys(user).length == 0) {
            goHome();
        } else {
            getProfil();
        }
    }, [user])

    return (
        <Base>
            <ModalValidationForm showM={ showModal } />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('profile_edition_screen.profile')}`} />
                }
            />
            {endFetch ? 
            <>
                <View style={[ tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                    <ScrollView>
                        <View style={[ tw`py-4 px-3 text-base` ]}>

                            <View style={[ tw`items-center` ]}>
                                <View style={[ tw`justify-center items-center rounded-full relative`, {backgroundColor: '#f4f4f4', width: 130, height: 130} ]}>
                                    <View style={[ tw`justify-center items-center rounded-full overflow-hidden relative`, {backgroundColor: '#f4f4f4', width: 130, height: 130} ]}>
                                        <Image 
                                            style={[tw`rounded-full`, { width: '95%', height: '95%', resizeMode: 'contain' }]}
                                            source={profil} />
                                    </View>
                                    <TouchableOpacity activeOpacity={0.5} onPress={() => setIsPanelActive(!isPanelActive)} style={[ tw`absolute`, {bottom: -10, right: -10} ]}>
                                        <IconSocial
                                            iconName='camera'
                                            iconColor={CodeColor.code1} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[ tw`mt-8`, { } ]}>
                                <View style={[tw`px-5`, {  }]}>

                                    <InputForm2
                                        value={inputs.prenom}
                                        placeholder={`${t('profile_edition_screen.first_name')}`}
                                        // formColor={Colors.dark}
                                        error={errors.prenom}
                                        onChangeText={(text: any) => handleOnChange('prenom', text)} />

                                    <InputForm2
                                        value={inputs.nom }
                                        placeholder={`${t('profile_edition_screen.last_name')}`}
                                        // formColor={ Colors.dark }
                                        error={errors.nom}
                                        onChangeText={(text: any) => handleOnChange('nom', text)} />

                                    <InputForm2
                                        keyboardType='email-address'
                                        value={inputs.email}
                                        placeholder={`${t('profile_edition_screen.email')}`}
                                        // formColor={Colors.dark}
                                        error={errors.email}
                                        onChangeText={(text: any) => handleOnChange('email', text)} />

                                    <View style={tw`mb-6`}>
                                        <View style={[ tw`flex-row justify-between items-center px-3 rounded-md border`, {borderColor: errors.country_code ? '#ff2222' : '#ccc', height: 50} ]}>
                                            <CountryPicker
                                                filterProps={{
                                                    placeholder: `${t('profile_edition_screen.search')}`
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
                                        placeholder={`${t('profile_edition_screen.city')}`}
                                        // formColor={Colors.dark}
                                        error={errors.ville}
                                        onChangeText={(text: any) => handleOnChange('ville', text)} />

                                    <InputForm2 
                                        placeholder={`${t('profile_edition_screen.phone')}`}
                                        keyboardType='number-pad'
                                        maxLength={16}
                                        value={inputs.phone}
                                        codeCountry={inputs.calling_code}
                                        codeCountryStyle={tw`text-sm`}
                                        leftComponent={
                                            <View style={[ tw`mr-0 flex-row items-center`, {} ]}>
                                                <CountryPicker
                                                    filterProps={{
                                                        placeholder: `${t('profile_edition_screen.search')}`
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

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={[ tw`bg-white border-t border-slate-200 justify-center px-5`, {height: 70} ]}>
                    <TouchableOpacity 
                        onPress={onSubmit}
                        activeOpacity={0.5} 
                        style={[ tw`rounded-lg px-2 py-3 border`, {borderColor: CodeColor.code1} ]}>
                        <Text style={[tw`text-center text-white text-xl`, {fontFamily: 'YanoneKaffeesatz-Regular', color: CodeColor.code1}]}>{t('profile_edition_screen.validate_changes')}</Text>
                    </TouchableOpacity>
                </View>

                <SwipeablePanel 
                    {...panelProps} 
                    smallPanelHeight={100}
                    // onlySmall
                    onlyLarge
                    isActive={isPanelActive}
                    style={[tw``, {height: 100}]}
                    // openLarge
                    showCloseButton={false}
                    scrollViewProps={{
                        scrollEnabled: false
                    }}
                >
                    <View style={tw`flex-row justify-around`}>
                        <TouchableOpacity activeOpacity={0.8} onPress={openCamera}>
                            <Icon type='ionicon' name='camera' color='rgb(2, 132, 199)' size={30} />
                            <Text style={tw`text-black`}>{t('profile_edition_screen.camera')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={handleFilePicker}>
                            <Icon type='ionicon' name='image' color='rgb(220, 38, 38)' size={30} />
                            <Text style={tw`text-black`}>{t('profile_edition_screen.gallery')}</Text>
                        </TouchableOpacity>
                    </View>
                </SwipeablePanel>

            </>
            : <ActivityLoading />
            }
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

export default PanelProfilScreen;