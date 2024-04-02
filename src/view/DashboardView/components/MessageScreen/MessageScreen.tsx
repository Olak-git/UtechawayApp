import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { account, baseUri, componentPaddingHeader, customGenerationFunction, downloadFile, fetchUri, getDate, getRandomInt, toast, windowWidth } from '../../../../functions/functions';
import { Bubble, Composer, GiftedChat, SystemMessage, IMessage, Send, SendProps, InputToolbar, } from 'react-native-gifted-chat'
import { ActivityLoading } from '../../../../components/ActivityLoading';
import Header from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import tw from 'twrnc';
import { Image, Platform, Pressable, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/base';
import FilePicker, { types } from 'react-native-document-picker';
// @ts-ignore
import EmojiBoard from 'react-native-emoji-board';
import Gifted from './components/Gifted';
import { addMessages, clearMessages, setMessages as setMessagesStore } from '../../../../feature/messages.slice';
import { callable, cameraPermission, getErrorsToString, live, saveMessages } from '../../../../functions/helperFunction';
import Base from '../../../../components/Base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { setStopped } from '../../../../feature/init.slice';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const timer = require('react-native-timer');

interface MessageScreenProps {
    navigation: any,
    route: any
}
const MessageScreen: React.FC<MessageScreenProps> = ({navigation, route}) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);
    const stopped = useSelector((state: any) => state.init.stopped);
    // const msgs = new Array();
    const msgs = useSelector((state: any) => state.messages.data);

    const [endFetch, setEndFetch] = useState(false);
    const [init, setInit] = useState(false);
    const [copy, setCopy] = useState<any>([]);
    const [messages, setMessages] = useState<any>([]);
    const [multipleFiles, setMultipleFiles] = useState(false)

    // @ts-ignore
    const [fileName, setFileName] = useState<string>(undefined)

    const [inputs, setInputs] = useState({
        texte: '',
        file: []
    })

    const [state, setState] = useState({
        inverted: false,
        step: 0,
        messages: [],
        loadEarlier: true,
        typingText: null,
        isLoadingEarlier: false,
        appIsReady: false,
        isTyping: false,
    });

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(false);
    const openPanel = () => {
        setIsPanelActive(true);
    };
    const closePanel = () => {
        setIsPanelActive(false);
    };

    const onClickEmoji = (emoji: any) => {
        const text = inputs.texte + emoji.code
        handleOnChange('texte', text)
    }

    const handleOnChange = (input: string, text: any) => {
        // console.log('Text: ', text);
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const configs = (data: any) => {
        const messags: any = [];
        data.reverse().map((item: any, index: number) => {
            const obj = {
                _id: `${item.id}-${customGenerationFunction()}`,
                text: item.texte,
                createdAt: item.dat,
                user: {
                    _id: item.expediteur,
                    name: item.expediteur.toLowerCase() == account ? (user.nom + ' ' + user.prenom) : 'Utechaway',
                    avatar: null//item.expediteur.toLowerCase() !== account ? `${baseUri}/assets/avatars/${item.conversation.receveur.image}` : null,
                },
                system: false
            };
            if(item.fichier) {
                if(item.type_fichier.toLowerCase() == 'image') {
                    Object.assign(obj, {image: `${baseUri}/assets/files/message/${item.fichier}`})
                } else if(item.type_fichier.toLowerCase() == 'doc') {
                    Object.assign(obj, {text: `${baseUri}/assets/files/message/${item.fichier}`})
                    Object.assign(obj, {file: item.name_fichier})
                }
            }
            messags.push(obj);
        })
        if(endFetch || !init) {
            dispatch(addMessages(messags));
            setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messags))
        } else {
            dispatch(setMessagesStore(messags));
            setMessages(messags);
            setEndFetch(true);
        }
    }

    const getMessages = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_messages`, null)
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                setMultipleFiles(json.multipleFiles);
                if(json.messages) {
                    setCopy(json.messages);
                    setInit(true);
                }
            } else {
                setCopy([]);
                setInit(true);
                console.log('Errors: ',json.errors)
            }
        })
        .catch(e => {
            setCopy([]);
            setInit(true);
            console.warn('Error: ', e)
        })
    }

    const getNewMessages = () => {
        console.log('NEW');
        if(endFetch) {
            console.log('ACRON')
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`${account}_upd_chat`, null);
            // @ts-ignore
            formData.append('token', user.slug)
            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(function(json) {
                if(json.success) {
                    // console.log('Messages => ', json.messages);
                    if(json.messages && json.messages.length !== 0) {
                        configs(json.messages);
                    }
                } else {
                    if(json.errors) {
                        console.log('json.errors: ', json.errors)
                    }
                }
            })
            .catch(e => console.warn(e))
        }
    }

    const handleOnSubmit = () => {
        let valid = true
        console.log('Inputs: ', inputs);
        if(!inputs.texte && inputs.file.length == 0) {
            valid = false
        }
        if(valid) {
            // @ts-ignore
            if(inputs.file.length !== 0 && inputs.file[0].type.indexOf('image') == -1) {
                setState((prevState) => ({...prevState, isTyping: true}));
                if(Platform.OS == 'android') {
                    ToastAndroid.showWithGravity(
                        t('message_screen.file_being_sent'),
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER
                    )
                } else {
                    toast('info', t('message_screen.file_being_sent'));
                }
            }
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_chat[message]`, inputs.texte)
            let length = inputs.file.length;
            const regExp = /image/g;
            for (let i = 0 ; i < length ; i++) {
                // @ts-ignore
                if(regExp.test(inputs.file[i].type)) {
                    if(multipleFiles) 
                        formData.append('image[]', inputs.file[i])
                    else
                        formData.append('image', inputs.file[i])
                } else {
                    if(multipleFiles)
                        formData.append('doc[]', inputs.file[i])
                    else
                        formData.append('doc', inputs.file[i])
                }
            }
            formData.append('token', user.slug)
            // console.log('FormData: ', formData);
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
                    setInputs(prevStat => ({ ...prevStat, texte: '', file: [] }))
                    console.log('JSON: ', json)
                    if(json.message) {
                        if(json.message.fichier && json.message.type_fichier.toLowerCase() == 'doc') {
                            setState((prevState) => ({...prevState, isTyping: false}));
                            configs([json.message]);
                        }
                    }
                } else {
                    const errors = json.errors
                    toast('error', getErrorsToString(errors));
                    console.log('errors: ', errors);
                }
            })
            .catch(e => {
                console.warn(e)
            })
        }
    }


    const fileResponse = (response: any) => {
        response.map((item: any) => {
            const obj = {
                _id: customGenerationFunction(),
                text: '',
                createdAt: new Date(),
                user: {
                    _id: account,
                    name: user.nom,
                    avatar: undefined, //user.image.uri
                },
                system: false
            };
            if(item.type?.indexOf('image') !== -1) {
                Object.assign(obj, {image: item.uri})
                setMessages((previousMessages: any) => GiftedChat.append(previousMessages, [obj]))
            } else if(item.type?.indexOf('application') !== -1) {
                Object.assign(obj, {text: item.uri})
            }
            // setMessages((previousMessages: any) => GiftedChat.append(previousMessages, [obj]))
        })
        handleOnChange('file', response)   
    }

    let options = {
        // saveToPhotos: true,
        mediaType: 'photo',
        quality: 1
    }

    const openCamera = async () => {
        const granted = await cameraPermission()
        if(granted) {
            // @ts-ignore
            const result = await launchCamera(options);
            if(result.assets) {
                // @ts-ignore
                const resp = result.assets[0];
                const response = [{
                    "fileCopyUri": null, 
                    "name": resp.fileName, 
                    "size": resp.fileSize, 
                    "type": resp.type, 
                    "uri": resp.uri
                }]; 
                fileResponse(response)
            }
            closePanel()
        }
    }

    const handleFilePicker = async () => {
        try {
            const response = await FilePicker.pick({
                allowMultiSelection: multipleFiles,
                presentationStyle: 'pageSheet',
                type: [types.csv, types.doc, types.docx, types.images, types.pdf, types.plainText, types.ppt, types.pptx, types.zip]
            })
            // console.log('ResponsePicker : ', response)
            // @ts-ignore
            // setFileName(response[0].name + '(' + format_size(response[0].size) + ')')
            closePanel();
            fileResponse(response)
        } catch(e) {
            console.log(e)
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
        if(saveMessages) {
            setMessages(msgs);
        }
    }, [])

    useEffect(() => {
        if(init) {
            console.log('TOP');
            configs(copy);
        }
    }, [init, copy])

    useEffect(() => {
        if(Object.keys(user).length !== 0) {
            getMessages();
        } else {
            goHome()
        }
    }, [user])

    useEffect(() => {
        if(!stopped) dispatch(setStopped(true))
        timer.setInterval('get-new-messages', getNewMessages, 5000);
        // const timer = setInterval(getNewMessages, 5000)
        return () => {
            if(stopped) dispatch(setStopped(false))
            if(timer.intervalExists('get-new-messages')) timer.clearInterval('get-new-messages')
            // clearInterval(timer)
        }
    }, [endFetch])

    useEffect(() => {
        if(inputs.file.length !== 0) {
            handleOnSubmit();
        }
    }, [inputs])

    return (
        <Base>
            <Header
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader, height: 60 }}
                leftComponent={
                    <View style={[tw`flex-row px-3`]}>
                        <Pressable onPress={() => navigation.goBack()} style={[tw`flex-row items-center flex-nowrap`]}>
                            <Icon type='ant-design' name='arrowleft' size={25} color='#FFFFFF' containerStyle={tw`mr-2`} />
                            <View style={[tw`flex-row items-center`]}>
                                <ImageRNE
                                    source={require('../../../../assets/images/logo-2.png')}
                                    style={[tw``, { width: 40, height: 40 }]}
                                    containerStyle={[tw`mr-1`, { width: 40, height: 40 }]} />
                                <Text style={[tw`text-slate-300`, { fontFamily: 'YanoneKaffeesatz-Regular' }]}>Utechaway</Text>
                            </View>
                        </Pressable>
                    </View>
                }
                rightComponent={
                    callable
                        ?
                        <View style={[tw`flex-row justify-end items-center flex-1`, {}]}>
                            {live
                                ?
                                    <Pressable onPress={() => navigation.navigate('DashboadVideoSdkLive', { type: 'audio', action: 'emit' })} style={tw`px-3`}>
                                        <Icon
                                            type="material-community"
                                            name="video"
                                            size={30}
                                            color='#FFF' />
                                    </Pressable>
                                : <>
                                    <Pressable onPress={() => navigation.navigate('DashboadCall', { type: 'audio', action: 'emit' })}>
                                        <Icon
                                            type="ionicon"
                                            name={Platform.OS == 'android' ? 'call-outline' : 'ios-call-outline'}
                                            size={30}
                                            color='#FFF' />
                                    </Pressable>
                                    <Pressable onPress={() => navigation.navigate('DashboadCall', { type: 'video', action: 'emit' })} style={tw`mx-4`}>
                                        <Icon
                                            type="ionicon"
                                            name={Platform.OS == 'android' ? 'videocam-outline' : 'ios-videocam-outline'}
                                            size={30}
                                            color='#FFF' />
                                    </Pressable>
                                </>
                            }
                            {/* <Icon 
                        // @ts-ignore
                        onPress={() => drawer?.current.openDrawer()}
                        type="material-community"
                        name="dots-vertical"
                        size={30}
                        color='#FFF' /> */}
                        </View>
                        : undefined
                }
            />
            {messages.length !== 0 || endFetch
                ?
                <Gifted endFetch={endFetch} state={state} messages={messages} setMessages={setMessages} inputs={inputs} handleOnChange={handleOnChange} handleFilePicker={handleFilePicker} handleOnSubmit={handleOnSubmit} onClickEmoji={onClickEmoji} />
                :
                <ActivityLoading backgroundColor='#000000' />
            }

            <SwipeablePanel
                {...panelProps}
                smallPanelHeight={100}
                // onlySmall
                onlyLarge
                isActive={isPanelActive}
                style={[tw``, { height: 100 }]}
                // openLarge
                showCloseButton={false}
                scrollViewProps={{
                    scrollEnabled: false
                }}
            >
                <View style={tw`flex-row justify-around`}>
                    <TouchableOpacity activeOpacity={0.8} onPress={openCamera}>
                        <Icon type='ionicon' name='camera' color='rgb(2, 132, 199)' size={30} />
                        <Text style={tw`text-black`}>{t('message_screen.camera')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleFilePicker}>
                        <Icon type='ionicon' name='image' color='rgb(220, 38, 38)' size={30} />
                        <Text style={tw`text-black`}>{t('message_screen.gallery')}</Text>
                    </TouchableOpacity>
                </View>
            </SwipeablePanel>
        </Base>
    )
}

export default MessageScreen;