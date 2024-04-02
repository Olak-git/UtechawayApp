import { View, Text, Platform, Pressable, TextInput, StyleSheet, PixelRatio, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native'
import React, { Children, useCallback, useState } from 'react'
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Message, MessageContainer, MessageText, MessageTextProps, Send, SystemMessage } from 'react-native-gifted-chat'
import { Icon } from '@rneui/base'
import { CodeColor } from '../../../../../assets/style'
import { account, baseUri, downloadFile, windowHeight } from '../../../../../functions/functions'
// @ts-ignore
import EmojiBoard from 'react-native-emoji-board'
import tw from 'twrnc'
import { ActivityIndicator, Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { addMessages } from '../../../../../feature/messages.slice'
import Image from '@rneui/themed/dist/Image'
import { openUrl } from '../../../../../functions/helperFunction'
import InputForm2 from '../../../../../components/InputForm2'
import '../../../../../data/i18n';
import { useTranslation } from 'react-i18next'

const SIZE = {
    minHeight: 30,
    maxHeight: 70
}

interface GiftedProps {
    endFetch: boolean,
    state: any,
    messages: any,
    setMessages: any,
    inputs: any,
    handleOnChange: any,
    handleFilePicker: any,
    handleOnSubmit: any,
    onClickEmoji: any
}
const Gifted: React.FC<GiftedProps> = ({endFetch, state, messages=[], setMessages, inputs, handleOnChange=(x:string,v:any)=>{}, handleFilePicker=()=>{}, handleOnSubmit}) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [layoutHeight, setLayoutHeight] = useState<number>(0);

    const onSend = useCallback((messages = []) => {
        handleOnSubmit({texte: messages[0].text})
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messages))
        // console.log('Msg: ', messages)
        dispatch(addMessages(messages));
    }, [inputs])

    // const onLoadEarlier = () => {
    //     this.setState(() => {
    //       return {
    //         isLoadingEarlier: true,
    //       }
    // })

    // const onSendFromUser = (messages: IMessage[] = []) => {
    //     const createdAt = new Date()
    //     const messagesToUpload = messages.map(message => ({
    //       ...message,
    //       user,
    //       createdAt,
    //       _id: Math.round(Math.random() * 1000000),
    //     }))
    //     this.onSend(messagesToUpload)
    //   }

    // setIsTyping = () => {
    //     setState({
    //       isTyping: !state.isTyping,
    //     })
    // }

    // const renderAccessory = () => (
    //     <AccessoryBar onSend={this.onSendFromUser} isTyping={this.setIsTyping} />
    //   )
    
    // const renderCustomActions = props =>
    //     Platform.OS === 'web' ? null : (
    //       <CustomActions {...props} onSend={onSendFromUser} />
    // )

    const onLayout = (event: any) => {
        setLayoutHeight(event.nativeEvent.layout.height);
        // console.log('Event: ', event.nativeEvent.layout.height)
    }

    const parsePatterns = (linkStyle: any) => {
        return [
            // { type: 'phone', style: {...linkStyle}, onPress: ()=>{} },
            { pattern: /#(\w+)/, style: { ...linkStyle, textDecorationLine: 'underline', color: 'orange' }}
            // { pattern: /http(s?):\/{2}(\w+)\.(\w+)[a-zA-Z0-9=?/]+/, style: { ...linkStyle, textDecorationLine: 'underline', color: '#ccc' } },
        ]
    }

    const renderActions = (props: any) => {
        return (
            <Pressable {...props} onPress={handleFilePicker} style={tw`self-center p-2`}>
                <Icon
                    type="ant-design"
                    name='addfile'
                    // name='pluscircleo'
                    color={'gray'}
                    size={25}
                    containerStyle={[tw``, {}]} 
                />
            </Pressable>
        )
    }
    
    const renderChatEmpty = () => {
        return (
            <View style={[tw`flex-1 justify-end items-center pb-10`, {transform: [{rotateX: '180deg'}]} ]}>
                <Image
                    source={require('../../../../../assets/images/logo.png')}
                    style={[ tw`rounded-full overflow-hidden mb-2`, { width: PixelRatio.getPixelSizeForLayoutSize(40), height: PixelRatio.getPixelSizeForLayoutSize(40) }]}
                />
                <Text style={[tw`text-black px-2`, {fontFamily: 'YanoneKaffeesatz-Regular'}]}>{t('message_screen.utechaway_agency_team')}</Text>
            </View>
        )
    }

    const renderSend = (props: any) => {
        return (
            <Send {...props} containerStyle={[tw`ml-0 self-center justify-center items-center p-1`, {height: 40}]}>
                {/* <Icon
                    type="ionicon"
                    // name={Platform.OS == 'android' ? 'send' : 'ios-send'}
                    name='md-navigate-circle-outline'
                    color='gray'
                    size={42}
                    style={tw`border`}
                    containerStyle={tw`border border-red-600 items-center justify-center`}
                /> */}
                <Image
                    defaultSource={require('../../../../../assets/images/sender-3.png')}
                    source={require('../../../../../assets/images/sender-3.png')}
                    style={[tw``,{width: PixelRatio.getPixelSizeForLayoutSize(17), height: PixelRatio.getPixelSizeForLayoutSize(17)}]}
                    PlaceholderContent={<Text style={tw`text-center text-xs text-gray-600`}>{t('message_screen.send')}</Text>}
                    placeholderStyle={tw`bg-white`}
                />
            </Send>
        )
    }

    const renderFooter = () => {
        return (
            state.isTyping
            ?
                <View style={[tw``,{marginBottom: (layoutHeight > 0 ? layoutHeight - 22 : layoutHeight)}]}>
                    <Text style={tw`text-black text-right pr-3`}>{t('message_screen.transfer_in_progress')}</Text>
                </View>
            :
                !endFetch 
                    ? <ActivityIndicator color={CodeColor.code1} style={[tw``,{marginBottom: (layoutHeight > 0 ? layoutHeight - 22 : layoutHeight)}]} />
                    : null
        )
    }

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#FFFFFF',
                    },
                    right: {
                        backgroundColor: CodeColor.code2//'rgb(248, 113, 113)' //'#A0E759' //rgb(55, 48, 163)
                    }
                }}
                timeTextStyle={{
                    right: {
                        color: 'rgb(226, 232, 240)',
                    }
                }}
            />
        );
    }

    const renderMessageText = (messageText: MessageTextProps<IMessage>) => {
        const item = messageText.currentMessage;
        return (
            <MessageText 
                    {...messageText} 
                    // @ts-ignore
                    currentMessage={item.file ? {text: <Text style={tw`underline`} onPress={() => downloadFile(item.text, item.file)}>{item.file}</Text>} : {text: item.text}} 
                    // parsePatterns={(linkStyle) => [
                    //     {
                    //         // pattern: /(https:\/\/utechaway.com\/assets\/assets\/files)\w+/, 
                    //         pattern: /\w+utechaway.com\w+/, 
                    //         style: { ...linkStyle, color: 'red'}, 
                    //         // @ts-ignore
                    //         onPress:() => downloadFile(item.text, item.file)
                    //     } 
                    // ]}
                />
        )
    }

    const renderSystemMessage = (props: any) => {
        return (
          <SystemMessage
            {...props}
            containerStyle={{
                marginBottom: 10,
            }}
            textStyle={{
                fontSize: 10,
            }}
          />
        )
    }

    const renderComposer = (props: any) => {
        return (
            <Composer 
                {...props} 
                multiline
                // onInputSizeChanged={(layout) => console.log('Layout:', layout)} 
            />
        )
    }
    
    const renderInputToolbar = (props: any) => {
        //Add the extra styles via containerStyle
        // return <InputToolbar {...props} containerStyle={[tw`items-center justify-center`, {borderTopWidth: 1.5, minHeight: size.maxHeight, maxHeight: size.maxHeight, height: 'auto'}]} />
        return <InputToolbar {...props} containerStyle={[tw`flex-row items-center justify-center py-2`, {backgroundColor: '#F6F6F6'}]} />
    }

    return (
    <>
        <GiftedChat
            messagesContainerStyle={[tw`bg-white`, {backgroundColor: '#F6F6F6', paddingBottom: layoutHeight - 25}]}
            renderChatEmpty={renderChatEmpty}
            renderFooter={renderFooter}
            // isTyping={true}
            renderSystemMessage={renderSystemMessage}
            placeholder='Message'
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            textInputProps={{onLayout: onLayout, style: styles.textInput}}
            renderActions={renderActions}
            messages={messages}
            onSend={onSend}
            renderSend={renderSend}
            renderMessageText={renderMessageText}
            // showUserAvatar={true}
            user={{
                _id: account,
                // avatar: 'https://utechaway.com/assets/assets/avatars/1d8bd16d52b8fc025355876054b35bc2.jpeg'
            }}
            renderBubble={renderBubble}
            scrollToBottom={true}
            scrollToBottomComponent={() => <Icon type='font-awesome' name='angle-double-down' />}
            inverted={true} //messages.length !== 0
            // isTyping
            onInputTextChanged={(text) => handleOnChange('texte', text)}
            // renderMessage={(props:any) => {
            //     return <Message {...props} containerStyle={tw`mb-5`} />
            // }}
            // forceGetKeyboardHeight
            alwaysShowSend={false}
            onLoadEarlier={() => <ActivityIndicator color='gray' />}
            infiniteScroll
            // loadEarlier
            parsePatterns={parsePatterns}
        />
        {/* {Platform.OS === 'android' && (
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={40} children={<EmojiBoard showBoard={true} />} />
        )} */}
    </>
    )
}

const styles = StyleSheet.create({
    hashtag: {},
    textInput: {
        flex:1, 
        alignSelf: 'center', 
        // textAlignVertical: 'top', 
        fontSize: 13, 
        paddingHorizontal: 15, 
        marginRight: 10,
        paddingVertical: 4,
        borderRadius: 20, 
        color: 'black', 
        borderWidth: 1, 
        borderColor: '#ddd', 
        // minHeight: SIZE.minHeight, 
        maxHeight: SIZE.maxHeight, 
        height: 'auto',
    }
})

export default Gifted