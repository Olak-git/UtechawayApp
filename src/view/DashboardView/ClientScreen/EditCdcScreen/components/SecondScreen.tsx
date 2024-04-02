import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import SelectPicker from "react-native-form-select-picker";
import { ActivityIndicator, Text } from "react-native-paper";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Icon} from '@rneui/themed'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import InputForm from "../../../../../components/InputForm";
import TextareaForm from "../../../../../components/TextareaForm";
import { baseUri, downloadFile, format_size, getRandomInt, windowWidth } from "../../../../../functions/functions";
import tw from 'twrnc';
import InputForm2 from "../../../../../components/InputForm2";

import '../../../../../data/i18n';
import { useTranslation } from "react-i18next";

interface SecondScreenProps {
    inputs: any,
    errors: any,
    handleOnChange: any,
    item: any,
    endFetch: boolean,
    docs: any,
    handleOnSelected?: any,
    handleFilePicker: any,
    selected: string
}
export const SecondScreen: React.FC<SecondScreenProps> = ({ inputs={}, errors={}, handleOnChange=()=>{}, item, endFetch, docs, selected, handleOnSelected=()=>{}, handleFilePicker }) => {
    const { t } = useTranslation();

    const freqs = [
        {
            label: 'Semaines',
            key: getRandomInt(1, 100)
        },
        {
            label: 'Mois',
            key: getRandomInt(1, 100)
        }
    ];

    const removeFile = (index: number) => {
        const jh = [...inputs.docs];
        jh.splice(index, 1);
        handleOnChange('docs', jh)
    }
    
    return (
        <>
            <View style={[tw``, { width: windowWidth }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-2 py-2`}>
                    <InputForm2
                        placeholder={`${t('specification_edition_screen.no_file_chosen')}`}
                        rightContent={
                            <Pressable onPress={() => handleFilePicker('fichier')}>
                                <Icon
                                    // style={[ tw`ml-1` ]}
                                    color={'gray'}
                                    size={30}
                                    name='cloud-upload'
                                />
                            </Pressable>
                        }
                        editable={false}
                        value={Object.keys(inputs.fichier).length !== 0 ? `1 ${t('specification_edition_screen.files_selected')}` : undefined}
                        error={errors.fichier}
                        constructHelper={
                            <>
                                <Text style={[tw`text-black`]}>{t('specification_edition_screen.msg_critical_file_project')}</Text>
                                {item && (
                                    <Text style={tw`text-neutral-400 my-2`}>{item.nom_fichier_cdc_uploader} (<Text onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${item.fichier_lien_util}`, item.nom_fichier_cdc_uploader)} style={tw`text-blue-500`}>{t('specification_edition_screen.download')}</Text>)</Text>
                                )}
                                {Object.keys(inputs.fichier).length !== 0 && (
                                    <View style={tw`flex-row`}>
                                        <Text style={[tw`flex-1 text-gray-600`]}>{`${inputs.fichier.name} (${format_size(inputs.fichier.size)})`}</Text>
                                        <Pressable onPress={() => handleOnChange('fichier', {})}>
                                            <Icon name='close' />
                                        </Pressable>
                                    </View>
                                )}
                            </>
                        }
                    />
                    <InputForm2
                        placeholder={`${t('specification_edition_screen.no_file_chosen')}`}
                        // helper="Télécharger ici tout fichier utils pour l'élaboration de votre projet."
                        rightContent={
                            <Pressable onPress={() => handleFilePicker('docs', true)}>
                                <Icon
                                    // style={[ tw`ml-1` ]}
                                    color={'gray'}
                                    size={30}
                                    name='cloud-upload'
                                />
                            </Pressable>
                        }
                        editable={false}
                        value={inputs.docs.length !== 0 ? `${inputs.docs.length} ${t('specification_edition_screen.files_selected')}` : undefined}
                        error={errors.docs}
                        constructHelper={
                            <>
                                <Text style={[tw`text-black`]}>{`${t('specification_edition_screen.upload_any_files_project')}`}</Text>
                                {item && (
                                    <View style={tw`my-2`}>
                                    {endFetch
                                    ?
                                        docs.map((doc:any, index:number) => <Text key={index.toString()} style={tw`text-neutral-400`}>{doc.name_doc} (<Text onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${doc.doc}`, doc.name_doc)} style={tw`text-blue-500`}>{t('specification_edition_screen.download')}</Text>)</Text>)
                                    : <ActivityIndicator size={20} color="silver" />
                                    }
                                    </View>
                                )}
                                {inputs.docs.map((item:any, index: number) => 
                                    <View key={index.toString()} style={tw`flex-row`}>
                                        <Text style={[tw`flex-1 text-gray-600`]}>{`${item.name} (${format_size(item.size)})`}</Text>
                                        <Pressable onPress={() => removeFile(index)}>
                                            <Icon name='close' />
                                        </Pressable>
                                    </View>
                                )}
                            </>
                        }
                    />

                    <View style={[tw`mb-6`]}>
                        <Text style={{marginBottom: 2,fontSize: 14,color: Colors.dark}}>{t('specification_edition_screen.technical_deadline')}</Text>
                        <View style={[tw`flex-row`]}>
                            <InputForm2
                                keyboardType='numeric'
                                placeholder={`${t('specification_edition_screen.deadline')}`}
                                // label='Projet*'
                                containerStyle={[tw`mr-4 mb-0`, { width: 100 }]}
                                value={inputs.nb_freq}
                                error={errors.nb_freq}
                                onChangeText={(text: string) => handleOnChange('nb_freq', text)}
                            />
                            <View style={tw`flex-1`}>
                                <View style={[tw`flex-row justify-between items-center rounded-md border p-0`, { borderColor: errors.freq ? '#ff2222' : '#ccc' }]}>
                                    <SelectPicker
                                        doneButtonText='Ok'
                                        doneButtonTextStyle={[tw`font-bold`]}
                                        style={[tw`flex-1 justify-center`, { height: 50 }]}
                                        onValueChange={(value, index) => {
                                            handleOnSelected(value);
                                        }}
                                        selected={selected}
                                    >
                                        <SelectPicker.Item value='semaines' label={t('specification_edition_screen.weeks')} />
                                        <SelectPicker.Item value='mois' label={t('specification_edition_screen.month')} />
                                    </SelectPicker>
                                    <Icon type='ionicon' name='chevron-down' />
                                </View>
                                {errors.freq && (
                                    <Text style={[tw`text-orange-700 text-sm`]}>{errors.freq}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <InputForm2
                        keyboardType='url'
                        placeholder={`${t('specification_edition_screen.prototype')}`}
                        label={`${t('specification_edition_screen.prototype')}`}
                        containerStyle={[tw``]}
                        value={inputs.prototype}
                        error={errors.prototype}
                        onChangeText={(text: string) => handleOnChange('prototype', text)}
                        helper={`${t('specification_edition_screen.prototype_link')}`}
                    />
                </ScrollView>
            </View>
                                
            {/* <View style={[ tw`flex-row` ]}>
                <Icon
                    name='asterisk'
                    color={'#000000'}
                    size={25}
                    style={ tw`mr-1` } />
                <Text style={[ tw`text-black text-2xl mb-5 font-900` ]}>Contraintes techniques</Text>
            </View> */}
        </>
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