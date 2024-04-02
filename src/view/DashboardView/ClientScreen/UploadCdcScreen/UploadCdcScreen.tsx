import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { baseUri, componentPaddingHeader, downloadFile, fetchUri, format_size, getRandomInt, getUser, headers, toast } from '../../../../functions/functions';
import FilePicker, { types } from 'react-native-document-picker';
import SelectPicker from 'react-native-form-select-picker';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { Icon } from "@rneui/themed";
import Recognation from '../../../../components/Recognation';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import  { default as HeaderP } from '../../../../components/Header';
import InputForm2 from '../../../../components/InputForm2';
import TextareaForm2 from '../../../../components/TextareaForm2';
import { refreshHistoriqueProjects } from '../../../../feature/refresh.slice';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface UploadCdcScreenProps {
    navigation?: any,
    route?: any
}
const UploadCdcScreen: React.FC<UploadCdcScreenProps> = ({navigation, route}) => {
    const { t } = useTranslation();

    const {item} = route.params;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const [showModal, setShowModal] = useState(false)

    const [endFetch, setEndFetch] = useState(false);

    const [docs, setDocs] = useState([]);

    const [inputs, setInputs] = useState({
        nom: '',
        description: '',
        fichier: {},
        docs: [],
        nb_freq: '1',
        freq: 'semaines'
    })

    const [errors, setErrors] = useState({
        nom: null,
        description: null,
        fichier: null,
        docs: null,
        nb_freq: null,
        freq: null
    })

    const [selected, setSelected] = useState('semaines')

    const [prepareRecognation, setPrepareRecognation] = useState<boolean>(false);

    const validationFile = () => {
        setShowModal(true)
        handleError('fichier', null)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('verify_file', null)
        if(Object.keys(inputs.fichier).length !== 0) {
            formData.append('file', inputs.fichier)
        }
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(json => {
            setShowModal(false)
            console.log(json)
            if(json.success) {
                console.log('JsonData: ', json.file_name)
            } else {
                if(json.errors.file_error) {
                    handleError('fichier', json.errors.file_error)
                }
            }
        })
        .catch(e => {
            setShowModal(false)
            console.warn(e)
        })
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const removeFile = (index: number) => {
        const jh = [...inputs.docs];
        jh.splice(index, 1);
        handleOnChange('docs', jh)
    }

    const handleFilePicker = async (key: string, multiple: boolean = false) => {
        try {
            let _types;
            if(multiple) {
                _types = [types.zip, types.doc, types.docx, types.pdf, types.ppt, types.pptx, types.xls, types.xlsx, types.images];
            } else {
                _types = [types.zip, types.doc, types.docx, types.pdf, types.ppt, types.pptx, types.xls, types.xlsx];
            }
            const response = await FilePicker.pick({
                allowMultiSelection: multiple,
                presentationStyle: 'pageSheet',
                type: _types
            })
            console.log('ResponsePicker : ', response)
            // setFileName(response[0].name + '(' + format_size(response[0].size) + ')')
            handleOnChange(key, multiple ? response : response[0]);
        } catch(e) {
            console.log(e)
        }
    }

    const handleOnSelected = (value: any) => {
        setSelected(value)
        handleOnChange('freq', value)
    }

    const handleOnSubmit = () => {
        Keyboard.dismiss()
        let valid = true

        if(!inputs.nom) {
            handleError('nom', t('specification_upload_screen.is_required'))
            valid = false
        } else if(inputs.nom.trim() == '') {
            handleError('nom', t('specification_upload_screen.no_blank'))
            valid = false
        } else {
            handleError('nom', null)
        }

        // if(!inputs.description) {
        //     handleError('description', t('specification_upload_screen.is_required'))
        //     valid = false
        // } else if(inputs.description.trim() == '') {
        //     handleError('description', t('specification_upload_screen.no_blank'))
        //     valid = false
        // } else {
        //     handleError('description', null)
        // }

        if(!inputs.nb_freq) {
            handleError('nb_freq', t('specification_upload_screen.is_required'))
            valid = false
        } else {
            handleError('nb_freq', null)
        }

        if(!inputs.freq) {
            handleError('freq', t('specification_upload_screen.is_required'))
            valid = false
        } else {
            handleError('freq', null)
        }

        if(!item && Object.keys(inputs.fichier).length == 0) {
            handleError('fichier', t('specification_upload_screen.is_required'))
            valid = false
        } else {
            handleError('fichier', null)
        }

        if(!valid) {
            console.log('Erreur : ', errors)
        } else {
            handleError('description', null)
            setShowModal(true)
            const name = item ? 'project_edit' : 'upl_cdc';
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${name}[nom]`, inputs.nom)
            formData.append(`${name}[description]`, inputs.description)
            formData.append(`${name}[nb_freq]`, inputs.nb_freq)
            formData.append(`${name}[freq]`, inputs.freq)
            if(Object.keys(inputs.fichier).length !== 0) {
                formData.append('fichier_cdc_uploader', inputs.fichier);
            }
            let length = inputs.docs.length;
            for (let i = 0 ; i < length ; i++) {
                formData.append("doc_cdc[]", inputs.docs[i]);
            }
            formData.append('token', user.slug)
            if(item) {
                formData.append(`${name}[cdc]`, item.slug)
            }
            console.log('FormData => ', formData);
            fetch(fetchUri, {
                method: 'POST',
                body: formData,
                headers: headers
            })
            .then(response => response.json())
            .then(async json => {
                setShowModal(false)
                if(json.success) {
                    toast('success', json.success_message, 'Notification', true);
                    if(!item) {
                        for(let j in inputs) {
                            if(j == 'fichier') {
                                handleOnChange(j, {})
                            } else if(j == 'docs') {
                                handleOnChange(j, [])
                            } else if(j == 'nb_freq') {
                                handleOnChange(j, '1')
                            } else if(j == 'freq') {
                                handleOnChange(j, 'semaines')
                            } else {
                                handleOnChange(j, '')
                            }
                        }
                    } else {
                        dispatch(refreshHistoriqueProjects());
                    }
                } else {
                    const errors = json.errors;
                    for(let k in errors) {
                        handleError(k, errors[k]);
                    }
                    toast('error', t('specification_upload_screen.error_identified'));
                    console.log('Errors: ', errors)
                }
            })
            .catch(e => {
                setShowModal(false)
                console.warn(e)
            })
        }
    }

    const getDocs = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('docs-cdc', null)
        formData.append('token', user.slug)
        formData.append('key', item.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                setDocs(json.docs);
            } else {
                console.warn(json.errors)
            }
            setEndFetch(true);
        })
        .catch(e => {
            setEndFetch(true);
            console.warn(e)
        })
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

    useEffect(() => {
        if(item) {
            getDocs();
            for(let j in inputs) {
                if(j == 'fichier') {
                    handleOnChange(j, {})
                } else if(j == 'docs') {
                    handleOnChange(j, [])
                } else {
                    handleOnChange(j, typeof item[j] == 'number' ? item[j].toString() : item[j])
                }
            }
        }
    }, [item])

    useEffect( () => {
        if(Object.keys(inputs.fichier).length !== 0) {
            // validationFile();
        }
    }, [inputs.fichier])

    return (
        <Base>
            <ModalValidationForm showM={showModal} />
            <Recognation visible={prepareRecognation} handleOnChange={handleOnChange} setPrepareRecognation={setPrepareRecognation} />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={(item ? t('specification_upload_screen.editing') : '') + t('specification_upload_screen.screen_title')} />
                }
            />
            <Text style={[tw`px-2 text-black my-2`, {}]}>{t('specification_upload_screen.fields_marked')}</Text>
            <View style={[tw`flex-1`]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-2 py-2`}>
                    <InputForm2
                        placeholder={`${t('specification_upload_screen.name')}`}
                        label={`${t('specification_upload_screen.project')}*`}
                        helper={`${t('specification_upload_screen.msg_project_name_change_later')}`}
                        value={inputs.nom}
                        error={errors.nom}
                        onChangeText={(text: string) => handleOnChange('nom', text)}
                    />
                    <TextareaForm2
                        placeholder={`${t('specification_upload_screen.description')}`}
                        label={`${t('specification_upload_screen.description')}`}
                        helper={`${t('specification_upload_screen.msg_description_project')}`}
                        value={inputs.description}
                        error={errors.description}
                        onChangeText={(text: string) => handleOnChange('description', text)}
                    />

                    <View style={tw`mb-6`}>
                        <Text style={{marginBottom: 2,fontSize: 14,color: Colors.dark}}>{t('specification_upload_screen.technical_deadline')}</Text>
                        <View style={[tw`flex-row`]}>
                            <InputForm2
                                keyboardType='numeric'
                                placeholder={`${t('specification_upload_screen.deadline')}`}
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
                                        <SelectPicker.Item value='semaines' label={t('specification_upload_screen.weeks')} />
                                        <SelectPicker.Item value='mois' label={t('specification_upload_screen.month')} />
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
                        label={`${t('specification_upload_screen.specification')}`}
                        placeholder={`${t('specification_upload_screen.no_file_chosen')}`}
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
                        value={Object.keys(inputs.fichier).length !== 0 ? `1 ${t('specification_upload_screen.files_selected')}` : undefined}
                        error={errors.fichier}
                        constructHelper={
                            <>
                                <Text style={[tw`text-black`]}>{t('specification_upload_screen.upload_specification_here')}</Text>
                                {item && (
                                    <Text style={tw`text-neutral-400 my-2`}>{item.nom_fichier_cdc_uploader} (<Text onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${item.fichier_cdc_uploader}`, item.nom_fichier_cdc_uploader)} style={tw`text-blue-500`}>{t('specification_upload_screen.download')}</Text>)</Text>
                                )}
                                {Object.keys(inputs.fichier).length !== 0 && (
                                    <View style={tw`flex-row`}>
                                        {/* @ts-ignore */}
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
                        label={`${t('specification_upload_screen.other_files')}`}
                        placeholder={`${t('specification_upload_screen.no_file_chosen')}`}
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
                        value={inputs.docs.length !== 0 ? `${inputs.docs.length} ${t('specification_upload_screen.files_selected')}` : undefined}
                        error={errors.docs}
                        constructHelper={
                            <>
                                <Text style={[tw`text-black`]}>{t('specification_upload_screen.helper_upload_any_file_dev_project')}</Text>
                                {item && (
                                    <View style={tw`my-2`}>
                                    {endFetch
                                    ?
                                        docs.map((doc:any, index:number) => <Text key={index.toString()} style={tw`text-neutral-400`}>{doc.name_doc} (<Text onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${doc.doc}`, doc.name_doc)} style={tw`text-blue-500`}>Télécharger</Text>)</Text>)
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
                </ScrollView>
            </View>

            <View style={[ tw`justify-center bg-white px-5 border-b`, {height: 70, backgroundColor: CodeColor.code1} ]}>
                <TouchableOpacity
                    onPress={handleOnSubmit}
                    activeOpacity={0.5}
                    style={[tw`border border-white rounded px-2 py-3`]}
                >
                    <Text style={[tw`text-center text-white`, {fontFamily: 'YanoneKaffeesatz-Regular'}]}>{t('specification_upload_screen.save')}</Text>
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
    },
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

export default UploadCdcScreen;