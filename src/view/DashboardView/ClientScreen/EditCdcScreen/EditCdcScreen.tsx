import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { baseUri, componentPaddingHeader, fetchUri, format_size, getRandomInt, getUser, headers, toast, windowWidth } from '../../../../functions/functions';
import FilePicker, { types } from 'react-native-document-picker';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { FirstScreen } from './components/FirstScreen';
import { SecondScreen } from './components/SecondScreen';
import { Icon } from "@rneui/themed";
import Recognation from '../../../../components/Recognation';
import { CommonActions } from '@react-navigation/native';
import  { default as HeaderP } from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import Pagination from './components/Pagination';
import { resetCdc, setCdc } from '../../../../feature/data.slice';
import { refreshHistoriqueProjects } from '../../../../feature/refresh.slice';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const timer = require('react-native-timer');

interface RenderButtonProps {
    onPress: any,
    buttonText: string,
    leftComponent?: React.ReactElement,
    rightComponent?: React.ReactElement
}
const RenderButton: React.FC<RenderButtonProps> = ({onPress=()=>{}, buttonText, leftComponent, rightComponent}) => {
    
    return (
        <Pressable
            onPress={onPress}
            style={[tw`flex-row items-center justify-center border border-white rounded px-3 py-3`, {minWidth: 120}]}
        >
            {leftComponent}
            <Text style={[tw`text-white text-center`, {fontFamily: 'YanoneKaffeesatz-Regular'}]}>{buttonText}</Text>
            {rightComponent}
        </Pressable>
    )
}

interface EditCdcScreenProps {
    navigation?: any,
    route?: any
}
const EditCdcScreen: React.FC<EditCdcScreenProps> = ({navigation, route}) => {

    const { t } = useTranslation();

    const {item} = route.params;

    const dispatch = useDispatch();

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const cdc = useSelector((state: any) => state.data.cdc);

    const scrollRef = useRef(null);

    const freqs = ['Semaines', 'Mois'];

    const [showModal, setShowModal] = useState(false)

    const [prepareRecognation, setPrepareRecognation] = useState<boolean>(false);

    const [goBack, setGoBack] = useState(false);

    const [endFetch, setEndFetch] = useState(false);

    const [docs, setDocs] = useState([]);

    const [inputs, setInputs] = useState({
        nom: '',
        description: '',
        existant: '',
        fonctionnalite: '',
        fichier: {},
        docs: [],
        prototype: '',
        nb_freq: '1',
        freq: 'semaines'
    })

    const [errors, setErrors] = useState({
        nom: null,
        description: null,
        existant: null,
        fonctionnalite: null,
        fichier: null,
        docs: null,
        prototype: null,
        nb_freq: null,
        freq: null
    })

    const [selected, setSelected] = useState('semaines')

    const [screen, setScreen] = useState<number>(0);

    const scrollToItem = (index: number = 0) => {
        setScreen(index);
        // @ts-ignore
        scrollRef?.current?.scrollTo({x: index * windowWidth, y: 0, animated: true})
    }

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

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
            setShowModal(false)
            console.log(json)
            if(json.success) {
                console.log('JsonData: ', json.file_name)
            } else {
                if(json.errors.file_error) {
                    handleError('fichier', json.errors.file_error)
                    handleOnChange('fichier', {})
                }
            }
        })
        .catch(e => {
            setShowModal(false)
            console.warn(e)
        })
    }

    const handleFilePicker = async (key: string, multiple: boolean = false) => {
        try {
            const response = await FilePicker.pick({
                allowMultiSelection: multiple,
                presentationStyle: 'pageSheet',
                type: [types.zip, types.doc, types.docx, types.pdf, types.ppt, types.pptx, types.xls, types.xlsx, types.images]
            })
            console.log('ResponsePicker : ', response)
            // setFileName(response[0].name + '(' + format_size(response[0].size) + ')')
            handleOnChange(key, multiple ? response : response[0]);
        } catch(e) {
            console.log(e)
        }
    }

    const firstHandleOnSubmit = () => {
        Keyboard.dismiss()
        let valid = true

        if(!inputs.nom) {
            handleError('nom', t('specification_edition_screen.is_required'))
            valid = false
        } else if(inputs.nom.trim() == '') {
            handleError('nom', t('specification_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('nom', null)
        }

        if(!inputs.description) {
            handleError('description', t('specification_edition_screen.is_required'))
            valid = false
        } else if(inputs.description.trim() == '') {
            handleError('description', t('specification_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('description', null)
        }

        // if(!inputs.fonctionnalite) {
        //     handleError('fonctionnalite', t('specification_edition_screen.is_required'))
        //     valid = false
        // } else if(inputs.description.trim() == '') {
        //     handleError('fonctionnalite', t('specification_edition_screen.no_blank'))
        //     valid = false
        // } else {
        //     handleError('fonctionnalite', null)
        // }

        if(!valid) {
            console.log('Erreur : ', errors)
            toast('error', t('specification_edition_screen.msg_error_dected'))
        } else {
            scrollToItem(screen+1);
        }
    }

    const handleOnSelected = (value: any) => {
        setSelected(value);
        handleOnChange('freq', value);
    }

    const handleOnSubmit = () => {
        Keyboard.dismiss()
        let valid = true

        console.log('Inputs => ', inputs)

        if(!inputs.nom) {
            handleError('nom', t('specification_edition_screen.is_required'))
            valid = false
        } else if(inputs.nom.trim() == '') {
            handleError('nom', t('specification_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('nom', null)
        }

        if(!inputs.description) {
            handleError('description', t('specification_edition_screen.is_required'))
            valid = false
        } else if(inputs.description.trim() == '') {
            handleError('description', t('specification_edition_screen.no_blank'))
            valid = false
        } else {
            handleError('description', null)
        }

        // if(!inputs.fonctionnalite) {
        //     handleError('fonctionnalite', t('specification_edition_screen.is_required'))
        //     valid = false
        // } else if(inputs.fonctionnalite.trim() == '') {
        //     handleError('fonctionnalite', t('specification_edition_screen.no_blank'))
        //     valid = false
        // } else {
        //     handleError('fonctionnalite', null)
        // }
        
        if(!inputs.nb_freq) {
            handleError('nb_freq', t('specification_edition_screen.is_required'))
            valid = false
        } else {
            handleError('nb_freq', null)
        }

        if(!inputs.freq) {
            handleError('freq', t('specification_edition_screen.is_required'))
            valid = false
        } else {
            handleError('freq', null)
        }

        if(!valid) {
            console.log('Erreur : ', errors)
        } else {
            handleError('existant', null);
            handleError('fonctionnalite', null);
            handleError('fichier', null);
            handleError('docs', null);
            handleError('prototype', null);
            if(screen == 0 && !item) {
                toast('success', t('specification_edition_screen.draft_saved'));
                dispatch(setCdc({...inputs}))
                setGoBack(true);
            } else {
                setShowModal(true)
                const formData = new FormData();
                const name = item ? 'project_edit' : 'edit_cdc';
                formData.append('js', null)
                formData.append('csrf', null)
                formData.append(`${name}[nom]`, inputs.nom)
                formData.append(`${name}[description]`, inputs.description)
                formData.append(`${name}[existant]`, inputs.existant)
                formData.append(`${name}[fonctionnalite]`, inputs.fonctionnalite)
                formData.append(`${name}[nb_freq]`, inputs.nb_freq)
                formData.append(`${name}[freq]`, inputs.freq)
                formData.append(`${name}[prototype]`, inputs.prototype)
                if(Object.keys(inputs.fichier).length !== 0) {
                    formData.append('fichier_lien_util', inputs.fichier)
                }
                let length = inputs.docs.length;
                for (let i = 0 ; i < length ; i++) {
                    formData.append("doc_cdc[]", inputs.docs[i]);
                }
                formData.append('token', user.slug);
                if(item) {
                    formData.append(`${name}[cdc]`, item.slug)
                }
                console.log('FormData: ', formData)
                fetch(fetchUri, {
                    method: 'POST',
                    body: formData,
                    headers: headers
                })
                .then(response => response.json())
                .then(async json => {
                    setShowModal(false)
                    console.log(json)
                    if(json.success) {
                        toast('success', json.success_message, 'Notification', true);
                        dispatch(resetCdc());
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
                        scrollToItem(0);
                    } else {
                        const errors = json.errors
                        for(let k in errors) {
                            handleError(k, errors[k]);
                        }
                        if(json.mailer) {
                            toast('info', `${t('specification_edition_screen.msg_workbook_saved_successfully')}\n\n${errors}`, `${t('specification_edition_screen.error_identified')}`)
                        } else {
                            toast('error', t('specification_edition_screen.error_identified'))
                        }
                        if(errors.nom || errors.description || errors.existant || errors.fonctionnalite) {
                            scrollToItem(screen-1);
                        }
                        console.log('Errors: ', errors);
                    }
                })
                .catch(e => {
                    setShowModal(false)
                    console.warn(e)
                })
            }
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
        } else {
            // getElements();
        }
    }, [user])

    useEffect( () => {
        if(Object.keys(inputs.fichier).length !== 0) {
            // validationFile()
        }
    }, [inputs.fichier])

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

    useEffect(() => {
        if(Object.keys(cdc).length !== 0) {
            setInputs(prevState => ({...prevState, ...cdc}))
        }
    }, [cdc])

    useEffect(() => {
        let backTimer: any = null;
        if(goBack) {
            timer.setTimeout('edit-cdc', () => navigation.goBack(), 2000);
            // backTimer = setTimeout(() => navigation.goBack(), 2000);
        }
        return () => {
            if(timer.timeoutExists('edit-cdc')) {
                timer.clearTimeout('edit-cdc')
            }
            // clearTimeout(backTimer);
        }
    }, [goBack])

    return ( 
        <Base>
            <ModalValidationForm showM={ showModal } />
            <Recognation visible={ prepareRecognation } handleOnChange={ handleOnChange } setPrepareRecognation={ setPrepareRecognation } />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={(item ? t('specification_edition_screen.editing') : '') + t('specification_edition_screen.write_your_specification')} />
                }
            />
            <Pagination data={[0, 1]} index={screen} styleContainer={tw`mt-6 mb-2`} />
            <Text style={tw`px-2 text-black my-2`}>{t('specification_edition_screen.fields_marked')}</Text>

            <View style={[tw`flex-1`, { elevation: 0 }]}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    style={[tw``]}
                    onLayout={(event) => {
                        // console.log('Event: ', event)
                    }}
                >
                    <FirstScreen inputs={inputs} errors={errors} handleOnChange={handleOnChange} setPrepareRecognation={undefined} />
                    <SecondScreen inputs={inputs} errors={errors} handleOnChange={handleOnChange} item={item} docs={docs} endFetch={endFetch} handleFilePicker={handleFilePicker} handleOnSelected={handleOnSelected} selected={selected} />
                </ScrollView>
            </View>

            <View style={[ tw`flex-row justify-around items-center bg-white px-1`, {minHeight: 70, backgroundColor: CodeColor.code1} ]}>
                {screen > 0 && (
                    <RenderButton onPress={() => scrollToItem(screen - 1)} buttonText={t('specification_edition_screen.previous')} leftComponent={<Icon type='ionicon' name='chevron-back' color='#fff' />} />
                )}
                <RenderButton onPress={handleOnSubmit} buttonText={t('specification_edition_screen.save')} />
                {screen < 1 && (
                    <RenderButton onPress={firstHandleOnSubmit} buttonText={t('specification_edition_screen.continue')} rightComponent={<Icon type='ionicon' name='chevron-forward' color='#fff' />} />
                )}
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

export default EditCdcScreen;