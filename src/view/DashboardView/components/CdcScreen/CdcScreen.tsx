import React, { Children, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, ImageBackground, Keyboard, ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, ListItem, Avatar, Text as TextRNE, Divider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, downloadFile, fetchUri, formatDate, format_size, getRandomInt, getUser, headers, requestPermissions, toast, validatePassword } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { ColorsPers } from '../../../../components/Styles';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { ActivityIndicator as ActivityIndicatorRNP, Button, DataTable } from 'react-native-paper';
import  { default as HeaderP } from '../../../../components/Header';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import { Icon } from '@rneui/base';
import { clone, getErrorsToString, isEmpty } from '../../../../functions/helperFunction';
import { refreshColor } from '../../../../data';
import { refreshHistoriqueProjects } from '../../../../feature/refresh.slice';
import { Modal } from 'react-native-form-component';
import InputForm2 from '../../../../components/InputForm2';
import FilePicker, { types } from 'react-native-document-picker';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface ParamItemProps {
    title: string,
    description: string
}
const ParamItem: React.FC<ParamItemProps> = ({title, description}) => {
    return (
        <View style={tw`flex-1 mb-3 px-3`}>    
            <Text style={[tw`text-base mb-1 text-black`, {fontFamily: 'YanoneKaffeesatz-Regular',}]}>{title}</Text>
            <Text style={tw`flex-1 text-sm text-slate-500`}>{description}</Text>
        </View>
    )
}

interface ParagraphProps {
    dTitle: string, 
    dText: string
}
const Paragraph: React.FC<ParagraphProps> = ({dTitle, dText}) => {
    return (
        <View style={[ tw`flex-row mb-5` ]}>
            <View style={[ {flex: 1} ]}><Text style={[ tw`text-base text-black` ]}>{ dTitle } : </Text></View>
            <View style={[ {flex: 2} ]}><Text style={[ tw`text-base text-gray-600` ]}>{ dText }</Text></View>
        </View>
    )
}

interface BottomButtonProps {
    navigation: any,
    route: string,
    params?: any,
    title: string,
    reverse?: boolean
}
const BottomButton: React.FC<BottomButtonProps> = ({navigation, route, params={}, title, reverse}) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.5}
            onPress={() => navigation.navigate(route, {...params})}
            style={[ tw`rounded-lg py-4 mb-4`, {minHeight: 40}, reverse ? styles.buttonReverse : styles.buttonUnreverse ]}
        >
            <Text style={[ tw`text-center`, {color: reverse ? '#FFF' : CodeColor.code1} ]}>{title}</Text>
        </TouchableOpacity>
    )
}

interface CdcScreenProps {
    navigation?: any,
    route?: any
}
const CdcScreen: React.FC<CdcScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    const refresh = useSelector((state: any) => state.refresh.cdc);

    // @ts-ignore
    const user = useSelector(state => state.user.data)

    const [visible, setVisible] = useState(false);

    const [selected, setSelected] = useState<any>([]);

    const [cdc, setCdc] = useState<any>({});

    const [data, setData] = useState({
        docs: [],
        facture: null,
        contrat: null
    });
    // const [docs, setDocs] = useState([]);

    const [endFetch, setEndFetch] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [loader, setLoader] = useState(false);

    const [inputs, setInputs] = useState({
        docs: []
    })

    const [errors, setErrors] = useState({
        docs: null
    })

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

    const handleFilePicker = async () => {
        try {
            const response = await FilePicker.pick({
                allowMultiSelection: true,
                presentationStyle: 'pageSheet',
                type: [types.zip, types.doc, types.docx, types.pdf, types.ppt, types.pptx, types.xls, types.xlsx, types.images]
            })
            console.log('ResponsePicker : ', response)
            // setFileName(response[0].name + '(' + format_size(response[0].size) + ')')
            handleOnChange('docs', response);
        } catch(e) {
            console.log(e)
        }
    }

    const removeDoc = (index: number, key: string) => {
        const copi = (new Array()).concat(selected);
        copi.push(key);
        setSelected(copi)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('del-cdc-doc', null)
        formData.append('del-doc[cdc]', cdc.slug)
        formData.append('del-doc[doc]', key)
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                const jh = data.docs;
                jh.splice(index, 1);
                setData(prevState => ({...prevState, docs: jh}))
            } else {
                console.warn(json.errors)
                toast('error', getErrorsToString(json.errors))
            }

            copi.splice(copi.indexOf(key), 1)
            setSelected(copi);
            setEndFetch(true);
        })
        .catch(e => {
            copi.splice(copi.indexOf(key), 1)
            setSelected(copi);
            setEndFetch(true);
            console.warn(e)
        })
    }

    const addFiles = () => {
        handleError('docs', null);
        setLoader(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append('new-doc-cdc', null)
        formData.append('cdc', route.params.cdc.slug)
        formData.append('token', user.slug)
        let length = inputs.docs.length;
        for (let i = 0 ; i < length ; i++) {
            formData.append("new_doc_cdc[]", inputs.docs[i]);
        }
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                toast('success', t('project_screen.msg_success_add_files'))
                handleOnChange('docs', []);
                setData(prevState => ({...prevState, docs: json.docs}));
                setVisible(false);
            } else {
                console.warn('Errors: ', json.errors)
                // toast('error', getErrorsToString(json.errors))
                // handleError('docs', getErrorsToString(json.errors));
            }
            setLoader(false);
        })
        .catch(e => {
            setLoader(false);
            console.warn(e)
        })
    }

    const getData = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('docs-cdc', null)
        formData.append('token', user.slug)
        formData.append('key', route.params.cdc.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                console.log('Data => ', json)
                if(refreshing) {
                    dispatch(refreshHistoriqueProjects());
                }
                setCdc(json.cdc);
                setData(prevState => ({...prevState, docs: json.docs, facture: json.facture, contrat: json.contrat}))
            } else {
                console.warn(json.errors)
            }
            setEndFetch(true);
            setRefreshing(false);
        })
        .catch(e => {
            setEndFetch(true);
            setRefreshing(false);
            console.warn(e)
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getData();
    }

    const renderItem = (item: any, index: number) => {
        return (
            <DataTable.Row key={index.toString()} style={[tw`px-2`]}>
                <DataTable.Title numberOfLines={2} textStyle={[tw`text-left`, { lineHeight: 15 }]} style={tw`flex-5`}>{item.name_doc}</DataTable.Title>
                <DataTable.Cell style={tw`flex-2 justify-end`}>
                    <View style={[tw`flex-row justify-end items-center`]}>
                        <Pressable
                            disabled={selected.indexOf(item.slug) !== -1}
                            onPress={() => removeDoc(index, item.slug)}
                            style={[tw`mr-5`, {}]}
                        >
                            {selected.indexOf(item.slug) !== -1
                                ?
                                <ActivityIndicator color='silver' />
                                :
                                <Icon type='ant-design' name='close' color={'#ff2222'} size={28} containerStyle={tw``} />
                            }
                        </Pressable>
                        <TouchableOpacity
                            style={[tw``]}
                            onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${item.doc}`, item.name_doc)}>
                            <Icon type='foundation' name='download' size={30} iconStyle={tw``} />
                        </TouchableOpacity>
                    </View>
                </DataTable.Cell>
            </DataTable.Row>
        )
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
        if(refreshing) {
            getData();
        }
    }, [refreshing])

    useEffect(() => {
        setCdc(route.params.cdc)
        console.log('route.params.cdc: ', route.params.cdc);
    }, [])

    useEffect(() => {
        if(Object.keys(user).length == 0) {
            goHome();
        } else {
            getData();
        }
    }, [user, refresh])

    return (
        <Base>
            <Modal show={visible} animationType='slide' backgroundColor='#000'>
                <View style={tw`flex-row`}>
                    <Pressable onPress={() => setVisible(false)} style={tw`px-2`}>
                        <Icon type='ant-design' name='close' size={40} color='#FFF' />
                    </Pressable>
                </View>
                <View style={tw`mt-3 px-3`}>
                    <InputForm2
                        label={`${t('project_screen.add_more_files')}`}
                        labelStyle={tw`text-white text-lg text-center mb-4`}
                        placeholder={`${t('project_screen.no_file_chosen')}`}
                        // helper="Télécharger ici tout fichier utils pour l'élaboration de votre projet."
                        // helperStyle={tw`text-white`}
                        rightContent={
                            <Pressable onPress={handleFilePicker}>
                                <Icon color={'gray'} size={30} name='cloud-upload' />
                            </Pressable>
                        }
                        editable={false}
                        value={inputs.docs.length !== 0 ? `${inputs.docs.length} ${t('project_screen.files_selected')}` : undefined}
                        error={errors.docs}
                        constructHelper={
                            <>
                                <Text style={[tw`text-white mb-2`]}>{t('project_screen.upload_any_file_of_project')}</Text>
                                {inputs.docs.map((item:any, index: number) => 
                                    <View key={index.toString()} style={tw`flex-row items-center`}>
                                        <Text numberOfLines={1} style={[tw`flex-1 text-slate-200`]}>{`${item.name} (${format_size(item.size)})`}</Text>
                                        <Pressable onPress={() => removeFile(index)} style={tw`p-2`}>
                                            <Icon name='close' />
                                        </Pressable>
                                    </View>
                                )}
                            </>
                        }
                    />

                    {inputs.docs.length !== 0 && (
                        <Button mode={loader ? 'contained' : 'outlined'} loading={loader} disabled={loader} onPress={addFiles} contentStyle={tw`p-2 ${loader ? 'bg-slate-300' : ''}`}>{t('project_screen.save')}</Button>
                    )}
                </View>
            </Modal>
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={route.params.headerTitle ? route.params.headerTitle : `${t('project_screen.screen_title')} - ${cdc.nom}`} />
                }
            />
            <View style={[tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={refreshColor}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={[tw`py-4 px-3 text-base`]}>
                        <ParamItem title={t('project_screen.project_name')} description={cdc.nom} />
                        <ParamItem title={t('project_screen.implemented_by')} description='Utechaway' />
                        <ParamItem title={t('project_screen.implementation_deadline')} description={cdc.nb_freq + ' ' + cdc.freq + '(s)'} />
                        <ParamItem title={t('project_screen.description')} description={cdc.description} />
                        {!isEmpty(cdc.existant) && (
                            <ParamItem title={t('project_screen.existing')} description={cdc.existant} />
                        )}
                        {!isEmpty(cdc.fonctionnalite) && (
                            <ParamItem title={t('project_screen.features')} description={cdc.fonctionnalite} />
                        )}
                        {!isEmpty(cdc.prototype) && (
                            <ParamItem title={t('project_screen.prototype')} description={cdc.prototype} />
                        )}

                        {(!isEmpty(cdc.fichier_cdc_uploader) || !isEmpty(cdc.fichier_lien_util)) && (
                            <DataTable style={[tw`mt-3 mb-4`]}>
                                <DataTable.Header style={[tw`bg-slate-200`]}>
                                    <DataTable.Title textStyle={[tw`font-extrabold`]}>{cdc.fichier_cdc_uploader ? t('project_screen.specifications') : t('project_screen.helpful_file')}</DataTable.Title>
                                    <DataTable.Title>{null}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Row style={[tw`px-2`]}>
                                    <DataTable.Cell textStyle={[tw`text-left text-black`, { lineHeight: 15 }]} style={tw`flex-5`}>{cdc.nom_fichier_cdc_uploader}</DataTable.Cell>
                                    <DataTable.Cell style={tw`flex-2 justify-end`}>
                                        <TouchableOpacity
                                            style={[tw``]}
                                            onPress={() => downloadFile(`${baseUri}/assets/files/cdc/${cdc.fichier_cdc_uploader ? cdc.fichier_cdc_uploader : cdc.fichier_lien_util}`, cdc.nom_fichier_cdc_uploader)}>
                                            <Text style={[tw`text-cyan-500`, { lineHeight: 15 }]}>{t('project_screen.download')}</Text>
                                        </TouchableOpacity>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        )}

                        <DataTable style={[tw`mb-4`]}>
                            <DataTable.Header style={[tw`bg-slate-200`]}>
                                <DataTable.Title textStyle={[tw`font-extrabold`]}>{t('project_screen.other_files')}</DataTable.Title>
                                <DataTable.Title numeric onPress={() => setVisible(true)}>
                                    <Icon type='entypo' name='plus' />
                                </DataTable.Title>
                            </DataTable.Header>
                            {!endFetch
                                ?
                                <DataTable.Row style={[tw`px-0`]}>
                                    <DataTable.Cell style={tw`justify-center`}>
                                        <ActivityIndicatorRNP color='silver' />
                                    </DataTable.Cell>
                                </DataTable.Row>
                                :
                                data.docs.length == 0
                                    ?
                                    <DataTable.Row style={[tw`px-0`]}>
                                        <DataTable.Cell style={tw`justify-center`}>
                                            {t('project_screen.no_files_found')}
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                    :
                                    data.docs.map((item: any, index: number) => 
                                        renderItem(item, index)
                                    )
                            }
                        </DataTable>

                        {data.facture && (
                            <BottomButton reverse navigation={navigation} route={'DashboadClientFacture'} params={{ facture: data.facture }} title={t('project_screen.invoice')} />
                        )}

                        {data.contrat && (
                            <BottomButton reverse navigation={navigation} route={'DashboadClientContrat'} params={{ item: data.contrat, cdcSlug: cdc.slug }} title={t('project_screen.agreement')} />
                        )}

                    </View>
                </ScrollView>
            </View>
        </Base>
    )
}

const styles = StyleSheet.create({
    buttonReverse: {
        backgroundColor: CodeColor.code1
    },
    buttonUnreverse: {
        borderWidth: 1,
        borderColor: CodeColor.code1, 
        backgroundColor: '#fff'
    },
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

export default CdcScreen;