import React, { Children, useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, fetchUri, getUser, toast, validatePassword } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { setUser } from '../../../../feature/user.slice';
import InputForm from '../../../../components/InputForm';
import { ColorsPers } from '../../../../components/Styles';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { CommonActions } from '@react-navigation/native';
import { clone } from '../../../../functions/helperFunction';
import { CodeColor } from '../../../../assets/style';
import  { default as HeaderP } from '../../../../components/Header';
import InputForm2 from '../../../../components/InputForm2';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface PanelPasswordScreenProps {
    navigation?: any,
    route?: any
}

const PanelPasswordScreen: React.FC<PanelPasswordScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data)

    const [showModal, setShowModal] = useState(false)

    const [inputs, setInputs] = useState({
        password: '',
        new_password: '',
        confirmation: ''
    })

    const [errors, setErrors] = useState({
        password: null,
        new_password: null,
        confirmation: null
    })

    const handleOnChange = (input: string, text?: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const onSubmit = () => {
        Keyboard.dismiss()
        let valid = true;

        if(!inputs.password) {
            handleError('password', t('password_change_screen.is_required'))
            valid = false
        } else if(inputs.password.trim() == '') {
            handleError('password', t('password_change_screen.no_blank'))
            valid = false
        } else {
            handleError('password', null)
        }

        if(!inputs.new_password) {
            handleError('new_password', t('password_change_screen.is_required'))
            valid = false
        } else if(inputs.new_password.trim() == '') {
            handleError('new_password', t('password_change_screen.no_blank'))
            valid = false
        } else if(!validatePassword(inputs.new_password)) {
            handleError('new_password', t('password_change_screen.msg_password_contain'))
            valid = false;
        } else {
            handleError('new_password', null)
        }

        if(!inputs.confirmation) {
            handleError('confirmation', t('password_change_screen.is_required'))
            valid = false
        } else if(inputs.confirmation.trim() == '') {
            handleError('confirmation', t('password_change_screen.no_blank'))
            valid = false
        } else {
            handleError('confirmation', null)
        }

        console.log('errors:', errors)

        if(!valid) {
            console.error('Erreur validation.')
        }
        else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_upd_password[password]`, inputs.password)
            formData.append(`${account}_upd_password[new_password]`, inputs.new_password)
            formData.append(`${account}_upd_password[confirmation_password]`, inputs.confirmation)
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
                    const user = json.user;
                    let image = user.image;
                    const data = clone(user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    dispatch(setUser({...data}));
                    toast('success', t('password_change_screen.msg_success'), 'Notification', true)
                } else {
                    const errors = json.errors
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
            <ModalValidationForm showM={showModal} />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('password_change_screen.screen_title')}`} />
                }
            />

            <View style={[tw`flex-1 bg-white`]}>
                <ScrollView>
                    <View style={[tw`py-4 px-3 text-base`]}>

                        <View style={[tw`px-5 mt-8`, {}]}>
                            <InputForm2
                                password
                                label={`${t('password_change_screen.old_password')}`}
                                labelStyle={[tw`mb-2`, { fontSize: 15 }]}
                                placeholder={`${t('password_change_screen.old_password')}`}
                                // formColor={ Colors.dark }
                                error={errors.password}
                                onChangeText={(text: any) => handleOnChange('password', text)} />

                            <InputForm2
                                password
                                label={`${t('password_change_screen.new_password')}`}
                                labelStyle={[tw`mb-2`, { fontSize: 15 }]}
                                placeholder={`${t('password_change_screen.new_password')}`}
                                // formColor={ Colors.dark }
                                error={errors.new_password}
                                onChangeText={(text: any) => handleOnChange('new_password', text)} />

                            <InputForm2
                                password
                                label={`${t('password_change_screen.confirmation')}`}
                                labelStyle={[tw`mb-2`, { fontSize: 15 }]}
                                placeholder={`${t('password_change_screen.confirmation')}`}
                                // formColor={ Colors.dark }
                                error={errors.confirmation}
                                onChangeText={(text: any) => handleOnChange('confirmation', text)} />
                        </View>

                    </View>
                </ScrollView>
            </View>

            <View style={[tw`bg-white border-t border-slate-200 justify-center px-5`, { height: 70 }]}>
                <TouchableOpacity
                    onPress={onSubmit}
                    activeOpacity={0.5}
                    style={[tw`rounded-lg px-2 py-3 border`, { borderColor: CodeColor.code1 }]}>
                    <Text style={[tw`text-center text-white text-xl`, { fontFamily: 'YanoneKaffeesatz-Regular', color: CodeColor.code1 }]}>{t('password_change_screen.validate')}</Text>
                </TouchableOpacity>
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

export default PanelPasswordScreen;