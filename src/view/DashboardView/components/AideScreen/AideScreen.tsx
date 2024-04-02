import React, { Children, useEffect, useState } from 'react';
import { Button, Dimensions, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, componentPaddingHeader, fetchUri, getUser, toast } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { CommonActions } from '@react-navigation/native';
import  { default as HeaderP } from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import InputForm2 from '../../../../components/InputForm2';
import TextareaForm2 from '../../../../components/TextareaForm2';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface AideScreenProps {
    navigation?: any,
    route?: any
}
const AideScreen: React.FC<AideScreenProps> = (props) => {
    const { t } = useTranslation()

    const {navigation, route} = props

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const [visible, setVisible] = useState(false);

    const [inputs, setInputs] = useState({
        objet: '',
        message: ''
    })

    const [errors, setErrors] = useState({
        objet: null,
        message: null
    })

    const handleOnChange = (input: string, text?: any) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const onSubmit = () => {
        Keyboard.dismiss();
        let valid = true;

        if(!inputs.objet) {
            handleError('objet', t('help_screen.is_required'))
            valid = false
        } else if(inputs.objet.trim() == '') {
            handleError('objet', t('help_screen.no_blank'))
            valid = false
        } else {
            handleError('objet', null)
        }

        if(!inputs.message) {
            handleError('message', t('help_screen.is_required'))
            valid = false
        } else if(inputs.message.trim() == '') {
            handleError('message', t('help_screen.no_blank'))
            valid = false
        } else {
            handleError('message', null)
        }

        if(!valid) {
            console.error('Erreur validation.')
            console.log('errors:', errors)
        } else {
            setVisible(true);
            const formData = new FormData()
            formData.append('js', null)
            // formData.append('csrf', null)
            formData.append('account', account);
            formData.append('token', user.slug)
            formData.append('aide[sujet]', inputs.objet);
            formData.append('aide[message]', inputs.message);
            // console.log('FormaData: ', formData)

            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                setVisible(false);
                if(json.success) {
                    // const user = json.user;
                    // let image = user.image;
                    // const data = clone(user);
                    // if(data.image) {
                    //     data.image = `${baseUri}/assets/avatars/${image}`;
                    // }
                    // dispatch(setUser({...data}));
                    toast('success', t('help_screen.msg_request_success_send'));
                } else {
                    const errors = json.errors
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                    console.log('Err => ', errors);
                }
            })
            .catch(e => {
                setVisible(false);
                console.warn(e)
                toast('error', JSON.stringify(e));
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
            <ModalValidationForm showM={visible} />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{paddingTop: componentPaddingHeader}}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('help_screen.help')}`} />
                }
            />
            <View style={[tw`bg-white flex-1`]}>
                <ScrollView contentContainerStyle={tw`px-4 py-4`}>
                    <InputForm2
                        label={`${t('help_screen.reason')}`}
                        labelStyle={tw`mb-2`}
                        placeholder={`${t('help_screen.subject')}`}
                        value={inputs.objet}
                        error={errors.objet}
                        formColor='rgb(209, 213, 219)'
                        onChangeText={(text: any) => handleOnChange('objet', text)}
                    />
                    <TextareaForm2
                        label={`${t('help_screen.message')}`}
                        labelStyle={tw`mb-2`}
                        placeholder={`${t('help_screen.your_message')}`}
                        value={inputs.message}
                        error={errors.message}
                        inputStyle={[tw`px-1`,{maxHeight: 200}]} 
                        onChangeText={(text: any) => handleOnChange('message', text)}
                        inputContainerStyle={tw`rounded-lg`}
                    />

                    <TouchableOpacity 
                        onPress={onSubmit}
                        activeOpacity={0.5} 
                        style={[ tw`rounded-lg px-2 py-3 mt-8 border`, {borderColor: CodeColor.code1} ]}>
                        <Text style={[tw`text-center text-white text-xl`, {fontFamily: 'YanoneKaffeesatz-Regular', color: CodeColor.code1}]}>{t('help_screen.send')}</Text>
                    </TouchableOpacity>

                    <View style={[tw`py-4 px-3 text-base`]}></View>
                </ScrollView>
            </View>
        </Base>
    );
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

export default AideScreen;