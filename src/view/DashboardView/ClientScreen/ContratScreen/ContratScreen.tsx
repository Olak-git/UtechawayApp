import React, { Children, createRef, useEffect, useRef, useState } from 'react';
import { Alert, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, SpeedDial, Header, Switch, Tab, TabView, ListItem, Avatar, Text as TextRNE, Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, customGenerationFunction, fetchUri, formatDate, getUser, toast, validatePassword, windowHeight } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { ColorsPers } from '../../../../components/Styles';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { ActivityIndicator, DataTable } from 'react-native-paper';
import { Modal } from 'react-native-form-component';
// @ts-ignore
import SignatureCapture from 'react-native-signature-capture';
import  { default as HeaderP } from '../../../../components/Header';

// @ts-ignore
// import RNHTMLtoPDF from 'react-native-html-to-pdf-rd';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import { WebView } from 'react-native-webview';
import Item from '../../../../view/PresentationView/components/Item';
import { capitalizeFirstLetter, getErrorsToString, isEmpty } from '../../../../functions/helperFunction';

import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface SignatureProps {
    visible: boolean,
    setShowSignModal: any,
    setSignature: any
}
const Signature: React.FC<SignatureProps> = ({visible, setShowSignModal, setSignature}) => {
    const { t } = useTranslation();

    const sign = useRef(null);

    const saveSign = () => {
        // @ts-ignore
        sign.current.saveImage();
    }

    const resetSign = () => {
        // @ts-ignore
        sign.current.resetImage()
    }

    const _onSaveEvent = (result: any) => {
        // result.encoded - for the base64 encoded png
        // result.pathName - for the file path name
        // setSignature({uri: 'data:image/png;base64,' + result.encoded})
        setSignature(`data:image/png;base64,${result.encoded}`)
        setShowSignModal(false)
    }

    const _onDragEvent = () => {
        // This callback will be called when the user enters signature
        console.log('dragged');
    }

    return (
        <Modal 
            show={visible}
            // backgroundColor='#fff'
            transparent
            animationType='slide'
        >
            <View style={tw`flex-1 bg-white rounded-lg`}>
                <View style={tw`flex-row justify-end items-center`}>
                    <Icon
                        containerStyle={tw`p-1`}
                        type='antdesign'
                        name='close'
                        color='black'
                        size={35}
                        onPress={() => setShowSignModal(false)} />
                </View>
                <View style={[tw`flex-1 justify-center px-3`]}>
                    <View style={[tw`flex-1 border border-gray-200 rounded-lg`, { }]}>
                        <SignatureCapture
                            style={[tw`flex-1 border`, styles.signature]}
                            ref={sign}
                            onSaveEvent={_onSaveEvent}
                            onDragEvent={_onDragEvent}
                            saveImageFileInExtStorage={false}
                            showNativeButtons={false}
                            showTitleLabel={false}
                            backgroundColor="#ffffff"
                            strokeColor="#000000"
                            minStrokeWidth={5}
                            maxStrokeWidth={5}
                            viewMode="portrait"
                        />
                    </View>
                </View>

                <View style={[tw`flex-row mt-3`]}>
                    <TouchableHighlight style={[tw`rounded-lg`, styles.buttonStyle]}
                        onPress={() => { saveSign() }} >
                        <Text style={styles.buttonText}>{t('agreement_screen.save')}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[tw`rounded-lg`, styles.buttonStyle]}
                        onPress={() => { resetSign() }} >
                        <Text style={styles.buttonText}>{t('agreement_screen.cancel')}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}

interface ContratScreenProps {
    navigation?: any,
    route?: any
}
const ContratScreen: React.FC<ContratScreenProps> = (props) => {

    const { t } = useTranslation();
    
    const {navigation, route} = props

    const user = useSelector((state: any) => state.user.data);

    const dispatch = useDispatch();
    
    const {item} = route.params;

    // require('../../../../assets/images/empty.png')
    const [signature, setSignature] = useState('');

    const [showSignModal, setShowSignModal] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const [contrat, setContrat] = useState(item);

    const [text, setText] = useState('');

    const [endFetch, setEndFetch] = useState(false)

    const [open, setOpen] = useState(false)

    const getData = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_contrat`, null)
        formData.append('key', item.slug)
        formData.append('token', user.slug)
        // console.log('FormData: ', formData)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(responseText => {
            setShowModal(false)
            // console.log('text: ',text);
            setText(responseText)
            setEndFetch(true);
        })
        .catch(e => {
            console.warn(e)
            setShowModal(false)
        })
    }
    
    const handleOnSubmit = () => {
        let valid = true    
        if(!signature) {
            toast('error', t('agreement_screen.msg_err_save_signt'), `${t('agreement_screen.error')}`)
            valid = false
        }

        if(valid) {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append('key', item.slug)
            formData.append(`${account}_signature`, signature)
            formData.append('token', user.slug)
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
                if(json.success) {
                    getData();
                    toast('success', t('agreement_screen.signed_contract'))
                    setContrat(json.contrat)
                } else {
                    setShowModal(false)
                    const errors = json.errors
                    toast('error', getErrorsToString(errors));
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
        } else {
            getData();
        }
    }, [user])

    return (
        <Base>
            <ModalValidationForm showM={showModal} />
            <Signature visible={showSignModal} setShowSignModal={setShowSignModal} setSignature={setSignature} />

            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    // @ts-ignore
                    <DashboardHeaderSimple navigation={navigation} title={`${t('agreement_screen.agreement')} (${item.cdc_nom || item.cdc.nom})`} />
                }
            />

            {endFetch
            ?
                <WebView
                    originWhitelist={['*']}
                    source={{ html: `${text}` }}
                    // source={{ uri: `https://team.utechaway.com/mobile-validation-contrat.php?token=${user.slug}&key=${item.slug}` }}
                    // mixedContentMode='never'
                    containerStyle={tw``}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    startInLoadingState
                />
            :
                <ActivityLoading />
            }

            {((contrat.signature == null || contrat.signature != '') && signature !== '') && (
            // {(!contrat.signature && signature !== '') && (
                <View style={[ tw`bg-white border-t border-slate-200 justify-center px-5`, {height: 70} ]}>
                    <TouchableOpacity 
                        onPress={handleOnSubmit}
                        activeOpacity={0.5} 
                        style={[ tw`rounded-lg px-2 py-3 border`, {borderColor: CodeColor.code1} ]}>
                        <Text style={[tw`text-center text-white text-xl`, {fontFamily: 'YanoneKaffeesatz-Regular', color: CodeColor.code1}]}>{capitalizeFirstLetter(t('agreement_screen.save'))}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!contrat.signature && (
                <SpeedDial
                    isOpen={open}
                    icon={{ name: 'edit', color: '#fff' }}
                    openIcon={{ name: 'close', color: '#fff' }}
                    color={CodeColor.code1}
                    onOpen={() => setOpen(!open)}
                    onClose={() => setOpen(!open)}
                >
                    {/* @ts-ignore */}
                    <SpeedDial.Action
                        icon={{ type: 'material-community', name: 'file-sign', color: '#fff' }}
                        color={CodeColor.code1}
                        title={`${t('agreement_screen.sign_contract')}`}
                        onPress={() => {
                            setOpen(false);
                            setShowSignModal(true);
                        }}
                    />
                </SpeedDial>
            )}

        </Base>
    )
}

const styles = StyleSheet.create({
    signature: {
        flex: 1,
        // width: '80%',
        // height: '40%',
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        height: 50,
        // backgroundColor: "#eeeeee",
        borderWidth: 1,
        borderColor: CodeColor.code1,
        margin: 10,
    },
    buttonText: {
        fontWeight: '800',
        color: CodeColor.code1,
        textTransform: 'uppercase',
        fontFamily: 'YanoneKaffeesatz-Regular'
    }
})

export default ContratScreen;