import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, DrawerLayoutAndroid } from 'react-native';
import { Image as ImageRNE } from '@rneui/themed/dist/Image';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Divider, Header, Icon, ListItem, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../../../components/DashboardHeader';
import { account, baseUri, fetchUri, formatDate, formatFullDate, format_size, getCurrentDate, getDate, getRandomInt, getUser, requestPermissions, sleep, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import IconSocial from '../../../../components/IconSocial';
import TextareaForm from '../../../../components/TextareaForm';
import FilePicker, { types } from 'react-native-document-picker';
// @ts-ignore
import EmojiBoard from 'react-native-emoji-board';
import { Alert } from 'react-native';
import { Modal } from 'react-native-form-component';
import { ScrollView } from 'react-native';
import { ColorsPers } from '../../../../components/Styles';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';

import BottomForm from './components/BottomForm';
import MessageLeft from './components/MessageLeft';
import MessageRight from './components/MessageRight';
import RenderMessage from './components/RenderMessage';
import { setDrawer } from '../../../../feature/drawer.slice';
import { addMessage, addMessages, setMessages as setReduxMessages } from '../../../../feature/messages.slice';
import { CommonActions } from '@react-navigation/native';
import { setStopped } from '../../../../feature/init.slice';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

const timer = require('react-native-timer');

interface ChatScreenProps {
    navigation?: any,
    route?: any
}
const ChatScreen: React.FC<ChatScreenProps> = (props) => {
    const {navigation, route} = props

    const dispatch = useDispatch();

    const msgs = useSelector((state: any) => state.messages.data)

    const stopped = useSelector((state: any) => state.init.stopped);

    const drawer = useRef(null)

    const [drawerZIndex, setDrawerZIndex] = useState(0)

    const [showModal, setShowModal] = useState(false)

    const [listViewRef, setListViewRef] = useState<any>(null);

    const [showEmojiBoard, setShowEmojiBoard] = useState(false)

    const [modal, setModal] = useState({
        _source: require('../../../../assets/images/empty.png'),
        show: false,
        imageWidth: 300,
        imageHeight: 300
    })

    const flatRef = useRef();

    // @ts-ignore
    const user1 = useSelector(state => state.user.data)

    // @ts-ignore
    const [fileName, setFileName] = useState<string>(undefined)

    const [inputs, setInputs] = useState({
        texte: '',
        file: {}
    })
    const [copieInputs, setCopieInputs] = useState({
        texte: '',
        file: {}
    })

    const [messages, setMessages] = useState<any>(msgs)

    const [user, setUser] = useState(null)

    const [endFetch, setEndFetch] = useState(true)

    // @ts-ignore
    const userAvatar = useSelector(state => state.avatar.src)

    const [timeSync, setTimeSync] = useState<any>(null)

    const validationFile = () => {
        // setShowModal(true)
        // handleError('file', null)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('verify_file', null)
        // @ts-ignore
        if(inputs.file.name) {
            formData.append('file', inputs.file)
        }
        console.log('Inp-File: ', inputs.file)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'multipart/form-data'
            }
        })
        .then(response => response.json())
        .then(json => {
            // setShowModal(false)
            console.log(json)
            if(json.success) {
                console.log('JsonData: ', json.file_name)
            } else {
                if(json.errors.file_error) {
                    console.warn(json.errors.file_error)
                }
            }
        })
        .catch(e => {
            // setShowModal(false)
            console.warn(e)
        })
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
        setCopieInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleFilePicker = async () => {
        try {
            const response = await FilePicker.pick({
                presentationStyle: 'pageSheet',
                type: [types.csv, types.doc, types.docx, types.images, types.pdf, types.plainText, types.ppt, types.pptx, types.zip]
            })
            console.log('ResponsePicker : ', response)
            // @ts-ignore
            setFileName(response[0].name + '(' + format_size(response[0].size) + ')')
            handleOnChange('file', response[0])
        } catch(e) {
            console.log(e)
        }
    }

    const onHandleImage = (source: string) => {
        setModal(state => ({...state, _source: {uri: source, width: modal.imageWidth, height: modal.imageHeight}, show: true}))
    }

    const onClickEmoji = (emoji: any) => {
        const text = inputs.texte + emoji.code
        handleOnChange('texte', text)
    }

    const creatMessageObject = async () => {
        const regExp = /image/;
        const message = {
            id: getRandomInt(0, 1000),
            slug: getRandomInt(0, 1000000),
            expediteur: account,
            texte: copieInputs.texte,
            // @ts-ignore
            fichier: copieInputs.file.name ? copieInputs.file.uri : null,
            // @ts-ignore
            name_fichier: copieInputs.file.name ? copieInputs.file.name : null,
            // @ts-ignore
            type_fichier: copieInputs.file.name ? (regExp.test(copieInputs.file.type) ? 'image' : 'doc') : null,
            dat: getDate(),
            create: true,
        }
        let copie = messages;
        copie.push(message)
        setMessages((prevState: any) => copie)
    }

    const handleOnSubmit = async () => {
        let valid = true
        // @ts-ignore
        if(!inputs.texte && !inputs.file.name) {
            valid = false
        }
        if(valid) {
            closeSync()
            creatMessageObject()

            setInputs(prevStat => ({ ...prevStat, texte: '', file: {} }))
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_chat[message]`, copieInputs.texte)
            // @ts-ignore
            if(copieInputs.file.name) {
                const regExp = /image/;
                // @ts-ignore
                if(regExp.test(copieInputs.file.type)) {
                    formData.append('image', copieInputs.file)
                } else {
                    formData.append('doc', copieInputs.file)
                }
            }
            // @ts-ignore
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
                    setCopieInputs(prevStat => ({ ...prevStat, texte: '', file: {} }))
                    if(json.message) {
                        // let copie = messages;
                        // copie.push(json.message)
                        // setMessages((prevState: any) => copie)
                        listViewRef?.scrollToEnd({animated: true})
                    }
                } else {
                    const errors = json.errors
                    console.log(errors);
                }
                beginSync()
            })
            .catch(e => {
                console.warn(e)
            })
        }
    }

    const closeSync = function () {
        clearTimeout(timeSync)
        setTimeSync(null)
    }
    const beginSync = function () {
        var node = setTimeout(getNewMessages, 1000)
        setTimeSync(node)
    }
    const recall = function () {
        closeSync();
        beginSync();
    }

    const getNewMessages = () => {
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
                if(json.messages && json.messages.length !== 0) {
                    setMessages((state: any) => state.concat(json.messages))
                }
            } else {
                if(json.errors) {
                    console.log('json.errors: ', json.errors)
                }
            }
            beginSync()
        })
        .catch(e => console.warn(e))
    }

    const getMessages = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_messages`, null)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                if(json.messages) {
                    await setMessages(json.messages)
                }
                // console.log('Messages: ', json.messages)
            } else {
                console.warn(json.errors)
            }
            !endFetch ? setEndFetch(true) : null;
            // load new messages
            // beginSync()
        })
        .catch(e => console.warn(e))
    }

    const removeMessages = () => {
        setShowModal(true)
        // setMessages
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_remove_messages`, null)
        formData.append('conversation_messages', messages[0].conversation.id)
        // @ts-ignore
        formData.append('token', user.slug)

        // setMessages([])
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            setShowModal(false)
            if(json.success) {
                setMessages(json.messages)
                // load new messages
                // beginSync()
            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            setShowModal(false)
            console.warn(e)
        })
    }

    const upButtonHandler = () => {
        //OnCLick of Up button we scrolled the list to top
        // @ts-ignore
        listViewRef.scrollToOffset({
          offset: 0,
          animated: true
        });
    };
     
    const downButtonHandler = () => {
        //OnCLick of down button we scrolled the list to bottom
        // @ts-ignore
        listViewRef.scrollToEnd({animated: true});
    }

    useEffect( () => {
        if(stopped) {
            dispatch(setStopped(true))
        }
        return () => {
            dispatch(setStopped(false))
            dispatch(setDrawer(false))
            setEndFetch(false)
            closeSync()
        }
    }, [])
    
    useEffect( () => {
        // @ts-ignore
        if(inputs.file.name) {
            validationFile()
        }
    }, [inputs.file])

    useEffect( () => {
        (async () => {
            const user2 = await getUser() || user1
            if(!user2) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {name: 'Home'}
                        ]
                    })
                )
            } else {
                setUser(user2)
                setEndFetch(true)
            }
        })()
    }, [])

    useEffect(() => {
        if(user) {
            if(!endFetch) {
                getMessages()
            } else {
                beginSync()
            }
        }
    }, [user, endFetch])

    // useEffect( () => {
    //     if(messages.length !== 0 && listViewRef !== null) {
    //         // downButtonHandler()
    //     }
    // }, [messages, listViewRef])

    return (
        user && endFetch ?
            <Base 
                componentScroll={ false }
                visible={true}
                headNav={
                    <>
                        <Modal
                            backgroundColor='rgba(0,0,0,0.5)'
                            show={ modal.show } 
                            children={
                                <View style={[ tw`flex-1 justify-center items-center border border-red-500` ]}>
                                    <Icon 
                                        onPress={() => setModal(state => ({...state, show: false}))}
                                        type='ant-design'
                                        name='closecircle'
                                        size={30}
                                        color='#ffffff'
                                        containerStyle={[ tw`absolute top-5 right-5` ]}
                                    />
                                    <Image 
                                        resizeMode='contain'
                                        style={{ width: modal.imageWidth, height: modal.imageHeight }}
                                        source={ modal._source } />
                                    <Text>Hello</Text>
                                </View>
                            } 
                        />

                        <ModalValidationForm showM={ showModal } />
                        <Header
                            elevated={true}
                            backgroundColor={ ColorsPers.palette_2 }
                            barStyle='default'
                            containerStyle={[ tw`flex-row items-center z-50`, { }]}
                            leftContainerStyle={[ tw`` ]}
                            leftComponent={
                                // width: 210
                                <View style={[ tw`flex-row`, {width: screen.width - 160} ]}>
                                    <Pressable onPress={() => navigation.goBack()} style={[ tw`flex-auto` ]}>
                                        <View style={[ tw`flex-row flex-wrap items-center flex-nowrap` ]}>
                                            <Image 
                                                style={[ tw`mr-1`, { width: 30, height: 60, resizeMode: 'contain' }]}
                                                source={require('../../../../assets/images/arrow-left.png')} />
                                            <View style={[ tw`flex-row items-center` ]}>
                                                <ImageRNE 
                                                    source={require('../../../../assets/images/logo.png')}
                                                    style={[ tw`rounded-full overflow-hidden`, { width: 40, height: 40 }]}
                                                    containerStyle={[ tw`bg-gray-200 rounded-full overflow-hidden mr-1`, { width: 40, height: 40 } ]} />
                                                {/* <View style={[ tw`bg-slate-200 rounded-full mr-1`, {width: 40, height: 40,} ]}></View> */}
                                                {/* width: 120 */}
                                                <View style={[ tw``, { width: screen.width - 250 }]}>
                                                    <Text style={[ tw`text-slate-300 text-xs` ]}>Assistant messagerie d'Amanou Tech</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                </View>
                            }
                            rightComponent={
                                <View style={[ tw`flex-row items-center flex-1`, {} ]}>
                                    <Icon
                                        onPress={() => navigation.navigate('DashboadChatCallAudio', {})}
                                        type="ionicon"
                                        name={ Platform.OS == 'android' ? 'call-outline' : 'ios-call-outline' }
                                        size={30}
                                        color={ Colors.white } />
                                    <Icon 
                                        onPress={() => navigation.navigate('DashboadChatCallVideo', {})}
                                        type="ionicon"
                                        name={ Platform.OS == 'android' ? 'videocam-outline' : 'ios-videocam-outline' }
                                        size={30}
                                        color={ Colors.white }
                                        containerStyle={[ tw`mx-4` ]} />
                                    <Icon 
                                        // @ts-ignore
                                        onPress={() => drawer?.current.openDrawer()}
                                        type="material-community"
                                        name="dots-vertical"
                                        size={30}
                                        color={ Colors.white } />
                                </View>
                            }>
                        </Header>
                    </>
                }
                visibleBottomView={ true }
                bottomView={
                    <BottomForm 
                        showEmojiBoard={ showEmojiBoard }
                        onClickEmoji={onClickEmoji}
                        inputs={inputs}
                        setShowEmojiBoard={setShowEmojiBoard}
                        handleOnChange={handleOnChange}
                        handleFilePicker={handleFilePicker}
                        handleOnSubmit={handleOnSubmit} />
                }
            >
                <DrawerLayoutAndroid 
                    ref={ drawer }
                    drawerWidth={280}
                    drawerBackgroundColor={ ColorsPers.palette_1 }
                    drawerPosition='right'
                    renderNavigationView={() => (
                        <View>
                            <TouchableOpacity
                                style={[ tw`py-5 px-6 border-b border-white`, {} ]}>
                                <Text style={[ tw`text-white font-bold` ]}>Rechercher</Text>
                            </TouchableOpacity>
                            {messages.length !== 0 && (
                                <TouchableOpacity
                                    onPress={removeMessages}
                                    style={[ tw`py-5 px-6 border-b border-white`, {} ]}>
                                    <Text style={[ tw`text-white font-bold` ]}>Effacer le contenu</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[ tw`py-5 px-6`, {} ]}>
                                <Text style={[ tw`text-white font-bold` ]}>Ajouter un raccourci à l'accueil</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                >
                    <View style={[ tw`flex-1`, {} ]}>
                        <RenderMessage messages={messages} listViewRef={listViewRef} setListViewRef={setListViewRef} onHandleImage={onHandleImage} setShowEmojiBoard={setShowEmojiBoard} scrollv={1} />
                    </View>
                </DrawerLayoutAndroid>
            </Base> : <ActivityLoading />
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

export default ChatScreen;