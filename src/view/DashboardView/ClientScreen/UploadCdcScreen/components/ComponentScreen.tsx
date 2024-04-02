import React from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import InputForm from "../../../../../components/InputForm";
import TextareaForm from "../../../../../components/TextareaForm";
import SelectPicker from "react-native-form-select-picker";
import tw from 'twrnc';
import { freqs } from "../../../../../functions/functions";
import { Colors } from "react-native-paper";
import { ColorsPers } from "../../../../../components/Styles";
import '../../../../../data/i18n';


interface ComponentScreenProps {
    errors: any,
    handleOnChange: any,
    handleFilePicker: any,
    inputs: any,
    fileName?: string,
    handleOnSelected?: any,
    selected: string,
    setPrepareRecognation: any
}
export const ComponentScreen: React.FC<ComponentScreenProps> = ({errors = {}, handleOnChange = () => {}, handleFilePicker = () => {}, fileName, handleOnSelected = () => {}, setPrepareRecognation = () => {}, selected, inputs}) => {

    const onHandleRecognation = async () => {
        await setPrepareRecognation(true)
    }

    return (
        <ScrollView nestedScrollEnabled={true}>
            <View style={[ tw`flex-row` ]}>
                <Icon
                    name='asterisk'
                    color={'#000000'}
                    size={25}
                    style={ tw`mr-1` } />
                <Text style={[ tw`text-black text-2xl mb-5 font-900` ]}>Délai technique</Text>
            </View>

            <View style={[ tw`mb-8 flex flex-row`, {flex: 1} ]}>
                <InputForm 
                    placeholder='Freq.'
                    keyboardType={'numeric'}
                    formColor='#ccc'
                    className='mb-0 flex-2 mr-3'
                    // @ts-ignore
                    value={ inputs.nb_freq }
                    // @ts-ignore
                    error={ errors.nb_freq }
                    onChangeText={(text: string) => handleOnChange('nb_freq', text)} />
                <View style={[ tw`flex-5 flex-col` ]}>
                    <View style={[ tw`flex-1 flex-row` ]}>
                        {/* @ts-ignore */}
                        <View style={[ tw`flex-3 justify-between rounded border p-0`, styles.inputContainer, {borderColor: errors.freq ? '#ff2222' : '#ccc'} ]}>
                            <SelectPicker 
                                doneButtonText='Ok'
                                doneButtonTextStyle={[ tw`font-bold` ]}
                                // @ts-ignore
                                style={[ tw`flex-1 mb-0` ]}
                                onValueChange={(value, index) => handleOnSelected(value)}
                                selected={ selected }>
                                    { freqs.map((value, id) => (
                                        <SelectPicker.Item key={ value.key.toString() } value={ value.label.toLowerCase() } label={ value.label } />
                                    )) }
                            </SelectPicker>
                            <IconFontAwesome
                                style={[ tw`mx-2` ]}
                                name="sort"
                                size={20} />
                        </View>
                        <View style={tw`flex-2`} />
                    </View>
                    {/* @ts-ignore */}
                    { errors.freq && (
                        // @ts-ignore
                        <Text style={[ tw`text-orange-700 text-sm` ]}>{ errors.freq }</Text>
                    )}
                </View>
            </View>

            <InputForm 
                placeholder='Nom'
                formColor='#ccc'
                className='mb-8'
                // @ts-ignore
                value={ inputs.nom }
                // @ts-ignore
                error={ errors.nom }
                onChangeText={(text: string) => handleOnChange('nom', text)} />

            { Platform.OS == 'android' && Platform.Version > 10 && (
                <View style={[ tw`flex-row justify-end` ]}>
                    <IconFontAwesome
                        color={ ColorsPers.palette_1 }
                        onPress={ onHandleRecognation }
                        name='microphone'
                        size={ 30 } />
                </View>
            )}
            <TextareaForm
                placeholder='Description'
                formColor='#ccc'
                className='mb-8'
                numberOfLines={6}
                // @ts-ignore
                value={ inputs.description }
                // @ts-ignore
                error={ errors.description }
                onChangeText={(text: string) => handleOnChange('description', text)}
                helper={ 'Faites une description de votre projet si vous ne l\'avez pas fait dans votre cahier de charge.' } />

            <InputForm 
                placeholder='Aucun fichier choisi'
                formColor='#ccc'
                className='mb-8'
                helper={ 'Télécharger votre cahier de charge (zip) ici.' }
                // @ts-ignore
                error={ errors.file }
                editable = { false }
                defaultValue={ fileName }
                rightContent={
                    <Icon 
                        style={[ tw`ml-1` ]}
                        color={ 'gray' }
                        size={ 30 }
                        name='cloud-upload'
                        onPress={ handleFilePicker } />
                } 
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 50,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 6,
        // borderWidth: 0.5
    }
})