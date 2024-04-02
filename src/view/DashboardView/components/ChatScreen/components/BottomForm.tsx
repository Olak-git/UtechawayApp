import React from 'react';
import { View, TextInput, Keyboard, Platform, Pressable } from 'react-native';
import { Icon, Text as TextRNE } from '@rneui/themed';
import { windowWidth } from '../../../../../functions/functions';
// @ts-ignore
import EmojiBoard from 'react-native-emoji-board';
import tw from 'twrnc';

interface BottomFormProps {
    showEmojiBoard: boolean,
    onClickEmoji: any,
    inputs: any,
    setShowEmojiBoard: any,
    handleOnChange: any,
    handleFilePicker: any,
    handleOnSubmit: any
}
const BottomForm: React.FC<BottomFormProps> = ({ showEmojiBoard, onClickEmoji = () => {}, inputs = {}, setShowEmojiBoard = () => {}, handleOnChange = () => {}, handleFilePicker = () => {}, handleOnSubmit = () => {} }) => {

    return (
        <>
            <View style={[ tw`bg-white flex-row items-center px-4 relative ${ showEmojiBoard ? 'mb-71' : ''  }`, {width: windowWidth, height: 80} ]}>
                {/* <EmojiBoard 
                    containerStyle={ showEmojiBoard ? { bottom: 80 } : {}}
                    scrollView={() => console.log()}
                    tabBarPosition='top'
                    showBoard={ showEmojiBoard }
                    onClick={ onClickEmoji } /> */}
                <View 
                    style={[ tw`flex-row flex-1 mr-3 border rounded-full items-center px-2`, {minHeight: 50, maxHeight: 60, height: 'auto', borderColor: '#2596be'} ]}>
                    <TextInput 
                        autoCorrect={ false }
                        autoCapitalize='none'
                        placeholder='message'
                        value={ inputs.texte }
                        onBlur={ Keyboard.dismiss }
                        onFocus={() => setShowEmojiBoard(false)}
                        onTextInput={() => setShowEmojiBoard(false)}
                        multiline
                        onChangeText={value => handleOnChange('texte', value)}
                        style={[ tw`flex-1 mr-1 text-black`, {maxHeight: '100%', textAlignVertical: 'top', justifyContent: 'flex-start'} ]} />
                    <Pressable onPress={ handleFilePicker }>
                        <Icon
                            type="font-awesome"
                            name={ 'paperclip'}
                            color={ '#2596be' }
                            size={25}
                            iconStyle={{ marginRight: 10, transform: [{ rotate: '40deg' }] }} />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setShowEmojiBoard((prevState:any) => (!prevState))
                            Keyboard.dismiss()
                        }}>
                        <Icon
                            type="material-icon"
                            name={ 'insert-emoticon'}
                            color={ '#2596be' }
                            size={25} />
                    </Pressable>
                </View>
                <Pressable onPress={handleOnSubmit}>
                    <Icon
                        type="ionicon"
                        name={ Platform.OS == 'android' ? 'send' : 'ios-send'}
                        color={ inputs.texte ? '#2596be' : 'rgb(209, 213, 219)' }
                        size={30} />
                </Pressable>
            </View>
            <View style={[ tw`relative` ]}>
                <EmojiBoard 
                    containerStyle={ showEmojiBoard ? {  } : {}}
                    scrollView={() => console.log()}
                    tabBarPosition='top'
                    showBoard={ showEmojiBoard }
                    onClick={ onClickEmoji } />
            </View>
        </>
    )
}

export default BottomForm;