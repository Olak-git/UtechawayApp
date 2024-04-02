import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableHighlight, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Voice from '@react-native-community/voice';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { Modal } from 'react-native-form-component';

interface RecognationProps {
    setPrepareRecognation: any,
    handleOnChange: any,
    visible: boolean
}
const Recognation: React.FC<RecognationProps> = ({setPrepareRecognation = () => {}, handleOnChange = () => {}, visible = false}) => {
    const [pitch, setPitch] = useState('');
    const [error, setError] = useState('');
    const [end, setEnd] = useState<string|boolean|null>('');
    const [started, setStarted] = useState<boolean>(false);
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);

    const  onSpeechStart = (e: any) => {
        //Invoked when .start() is called without error
        console.log('onSpeechStart: ', e);
        setStarted(true)
    };
    const onSpeechEnd = (e: any) => {
        //Invoked when SpeechRecognizer stops recognition
        console.log('onSpeechEnd: ', e);
        setStarted(false);
        setEnd(true);
    };
    const onSpeechError = (e: any) => {
        //Invoked when an error occurs.
        console.log('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
    };
    const onSpeechResults = (e: any) => {
        //Invoked when SpeechRecognizer is finished recognizing
        console.log('onSpeechResults: ', e);
        setResults(e.value)
    };
    const onSpeechPartialResults = (e: any) => {
        //Invoked when any results are computed
        console.log('onSpeechPartialResults: ', e);
        setPartialResults(e.value)
    };
    const onSpeechVolumeChanged = (e: any) => {
        setPitch(e.value)
    };

    const startSpeechRecognizing = async () => {
        setPitch('')
        setError('')
        setStarted(true)
        setResults([])
        setPartialResults([])
        setEnd('')
        try {
            await Voice.start(
                'fr-FR',
                { RECOGNIZER_ENGINE: 'GOOGLE', EXTRA_PARTIAL_RESULTS: true, }
                // {EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 10000}
            );
        } catch (e) {
            console.error(e);
        }
    }

    const stopSpeechRecognizing = async () => {
        try {
        	await Voice.stop();
        	setStarted(false);
        } catch (e) {
        	console.error(e);
        }
    };

    const cancelRecognizing = async () => {
        //Cancels the speech recognition
        try {
          await Voice.cancel();
          setPrepareRecognation(false)
        } catch (e) {
          //eslint-disable-next-line
          console.error(e);
        }
    };

    const finishRecognizing = async () => {
        try {
            await Voice.cancel();
            setPrepareRecognation(false)
            // copie de results
            handleOnChange('description', results[0])
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    }

    const destroyRecognizer = async () => {
        //Destroys the current SpeechRecognizer instance
        try {
            await Voice.destroy();
            setPitch('');
            setError('');
            setStarted(false);
            setResults([]);
            setPartialResults([]);
            setEnd('');
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    const onHandleRecognation = async () => {
        // await setScrollable(false);
        await setPrepareRecognation(true)
    }

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [])

    return (
        <Modal 
            show={ visible }
            backgroundColor={'rgba(0,0,0,0.8)'}
            style={[ {} ]}>
            <View style={[ tw`flex-1 justify-center`, {} ]}>
                <Text style={[ tw`text-gray-100 text-xl text-center mt-3` ]}>Parler pour écrire</Text>
                <Text style={[ tw`text-gray-300 text-base text-center mt-3 mb-7` ]}>Appuyez sur le microphone pour commencer l'enregistrement</Text>
                <View style={[ tw`px-6`, {} ]}>
                    <View style={[ tw`bg-white rounded-md`, {height: 200} ]}>
                        <ScrollView
                            nestedScrollEnabled={ true }>
                            <View style={[ tw`py-2 px-3` ]}>
                                <Text style={ tw`text-black` }>{ results[0] }</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={[ tw`flex-row justify-center`, {marginVertical: 100} ]}>
                    {!started?
                        <TouchableOpacity
                            onPress={ startSpeechRecognizing }
                            style={[ tw`justify-center items-center`, { width: 80 }]}>
                            <IconFontAwesome
                                color={ '#ffffff' }
                                name='microphone'
                                size={ 40 } 
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={ stopSpeechRecognizing }
                            style={[ tw`justify-center items-center`, { width: 80 }]}>
                            <IconFontisto
                                color={ '#ff2222' }
                                name='record'
                                size={ 40 } 
                            />
                        </TouchableOpacity>
                    }
                </View>
                {/* <View style={[ tw`absolute flex-row bottom-0 justify-around items-center`, { height: 50, width: windowWidth } ]}> */}
                <View style={[ tw`flex-row bottom-0 justify-around items-center`, { height: 50 } ]}>
                    <TouchableOpacity
                        onPress={ cancelRecognizing }
                        activeOpacity={ .5 }
                        style={[ tw`bg-white rounded-lg` ]}>
                        <Text style={[ tw`px-6 py-3 text-black font-bold` ]}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ finishRecognizing }
                        activeOpacity={ .5 }
                        style={[ tw`bg-white rounded-lg` ]}>
                        <Text style={[ tw`px-6 py-3 text-black font-bold` ]}>Terminer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    button: {
        // resizeMode: 'center',
        width: 60,
        height: 60
    }
})

export default Recognation;