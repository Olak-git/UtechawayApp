import { View, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchUri, formatDate } from '../../../../../functions/functions';
import tw from 'twrnc';
import { Icon } from '@rneui/base';
import '../../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface CdcViewProps {
    navigation: any,
    item: any,
    index: number,
    deleteProject?: any,
    user?: any,
    removeItem?: (i:number) => void
}
const CdcView: React.FC<CdcViewProps> = ({navigation, item, index, deleteProject, user, removeItem}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        status: 'en attente',
        textColor: '',
        borderColor: 'border-black'
    });

    const [visible, setVisible] = useState(false);

    const valueOnChange = (input: string, text?: any) => {
        setState(prevState => ({...prevState, [input]: text}))
    }

    const deleteCdc = (key: string, index: number) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('js', null);
        formData.append(`delete_cdc`, null)
        formData.append(`cdc_slug`, key)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            setLoading(false)
            if(json.success) {
                // setCdcs(json.cdcs)
                // setData(json.cdcs)
                // @ts-ignore
                removeItem(index)
                setVisible(!visible)
            } else {
                console.log('errors: ', json.errors)
            }
        })
        .catch(e => {
            setLoading(false)
            console.warn(e)
        })
    }

    const updState = () => {
        if(item.valide == 0) {
            valueOnChange('status', t('projects_screen.pending'));
            valueOnChange('textColor', 'text-neutral-500');
            valueOnChange('borderColor', 'border-neutral-500');
        } else if(item.valide == 1) {
            valueOnChange('status', t('projects_screen.validated'));
            valueOnChange('textColor', 'text-green-700');
            valueOnChange('borderColor', 'border-green-700');
        } else if(item.valide == -1) {
            valueOnChange('status', t('projects_screen.denied'));
            valueOnChange('textColor', 'text-red-700');
            valueOnChange('borderColor', 'border-red-700');
        } else if(item.valide == -10) {
            valueOnChange('status', t('projects_screen.canceled'));
            valueOnChange('textColor', 'text-pink-600');
            valueOnChange('borderColor', 'border-pink-600');
        } else if(item.valide == 11) {
            valueOnChange('status', t('projects_screen.in_progress'));
            valueOnChange('textColor', 'text-gray-500');
            valueOnChange('borderColor', 'border-gray-500');
        } else if(item.valide == 10) {
            valueOnChange('status', t('projects_screen.finished'));
            valueOnChange('textColor', 'text-green-800');
            valueOnChange('borderColor', 'border-green-800');
        }
    }

    useEffect(() => {
        updState()
    }, [item])

    return (
        <TouchableOpacity
            disabled={loading}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('DashboadCdc', {cdc: item})}
            style={[ tw`rounded-xl bg-gray-200 bg-gray-100 mb-5 p-3 ${state.borderColor}`, {elevation: 5, shadowColor: 'gray', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {width: 0, height: 5}, borderStartWidth: 8} ]}>
            <View style={[ tw`` ]}>
                <View style={tw`flex-row justify-between mb-4 border-b border-gray-400`}>
                    <View style={tw`flex-1`}>
                        <Text style={[ tw`font-extrabold text-black` ]}>{item.nom}</Text>
                        <Text style={[ tw`font-thin text-black ${state.textColor}` ]}>{state.status}</Text>
                    </View>
                    {(item.valide != 1 || item.valide == 0) && (
                        <Pressable onPress={() => setVisible(!visible)} style={tw`self-end pl-3 pr-1`}>
                            <Icon type='material-community' name={visible ? 'close' : 'dots-horizontal'} />
                        </Pressable>
                    )}
                </View>

                {(visible && (item.valide != 1 || item.valide == 0)) && (
                    <View style={[tw`relative p-2 rounded-lg border`, {}]}>
                        <View style={[tw``, { position: 'absolute', top: -15, right: 3, borderLeftWidth: 10, borderLeftColor: 'transparent', borderRightWidth: 10, borderRightColor: 'transparent', borderBottomWidth: 15, borderBottomColor: '#000' }]}></View>
                        <View style={tw`flex-row`}>
                            {(item.valide == 0 || item.valide == -1) && (
                                <Pressable
                                    onPress={() => navigation.navigate(item.fichier_cdc_uploader ? 'DashboadClientUploadCdc' : 'DashboadClientEditCdc', {item: item})}
                                    disabled={loading}
                                    style={[tw`flex-row border border-gray-300 rounded px-3 py-2 mr-4`]}
                                >
                                    <Icon type='ant-design' name='edit' color={'rgb(59, 130, 246)'} size={20} containerStyle={tw`mr-1`} />
                                    <Text style={tw`text-black`}>{t('projects_screen.edit')}</Text>
                                </Pressable>
                            )}
                            {(item.valide != 1 && item.valide != 10) && (
                                <Pressable
                                    onPress={() => {
                                        deleteCdc(item.slug, index)
                                        // deleteProject(item.slug, index)
                                    }}
                                    disabled={loading}
                                    style={[tw`flex-row items-center border border-gray-300 rounded px-3 py-2`]}
                                >
                                    {loading
                                        ?
                                            <ActivityIndicator size={15} color='#ff2222' style={tw`mr-1`} />
                                        :
                                            <Icon type='ant-design' name='close' color={'#ff2222'} size={18} containerStyle={tw`mr-1`} />
                                    }
                                    <Text style={tw`text-black`}>{t('projects_screen.delete')}</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}
                <Text style={[ tw`mt-2 text-black text-xs` ]}>{ formatDate(item.dat) }</Text>
            </View>
        </TouchableOpacity>
    )
  return (
    <View>
      <Text>CdcView</Text>
    </View>
  )
}

export default CdcView