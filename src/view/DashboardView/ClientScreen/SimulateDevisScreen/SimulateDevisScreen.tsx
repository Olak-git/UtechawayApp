import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, ImageBackground, Keyboard, Modal, PixelRatio, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, CheckBox, Header, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { DashboardHeaderVar } from '../../../../components/DashboardHeaderVar';
import InputForm from '../../../../components/InputForm';
import TextareaForm from '../../../../components/TextareaForm';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { baseUri, componentPaddingHeader, fetchUri, format_size, getCurrency, getRandomInt, getUser, headers, toast, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import IconSocial from '../../../../components/IconSocial';
import FilePicker, { types } from 'react-native-document-picker';
import SelectPicker from 'react-native-form-select-picker';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';
import { Icon as IconRNEUI } from "@rneui/themed";
import { Icon } from '@rneui/base';
import { ColorsPers } from '../../../../components/Styles';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import  { default as HeaderP } from '../../../../components/Header';
import { refreshColor } from '../../../../data';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { Button } from 'react-native-paper';
import { getErrorsToString } from '../../../../functions/helperFunction';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface RenderItemProps {
    item: any,
    evaluateTotal: any,
    count: number,
    setCount: any,
    selected: any,
    setSelected: any
}
const RenderItem: React.FC<RenderItemProps> = ({ item, evaluateTotal, count, setCount, selected, setSelected }) => {
    const [checked, setChecked] = useState(false);

    const handleOnCheck = async () => {
        console.log('object');
        let copie = !checked
        await setChecked(copie)
        if(copie) {
            selected.push(item.fonctionnalite)
            setSelected(selected)

            evaluateTotal(item.mnt)
            setCount((state: number) => (state + 1));
        } else {
            const jh = [...selected];
            jh.splice(item.fonctionnalite, 1);
            setSelected(jh)

            evaluateTotal(-item.mnt)
            if(count > 0) {
                setCount((state: number) => (state - 1));
            }
        }
    }

    return (
        <View style={tw``}>
            <CheckBox
                containerStyle={[ tw`mb-2 p-0 mx-0`]}
                wrapperStyle={[tw`px-3 py-4 rounded-lg bg-red-100`, {}]}
                checked={checked}
                uncheckedColor='#000000'
                right={false}
                checkedColor={CodeColor.code1}
                onPress={handleOnCheck}
                title={<Text style={[ tw`font-semibold text-black flex-1 ml-3` ]}>{item.fonctionnalite}</Text>}
            />
        </View>
    )
}

interface SimulateDevisScreenProps {
    navigation?: any,
    route?: any
}
const SimulateDevisScreen: React.FC<SimulateDevisScreenProps> = (props) => {
    const { t } = useTranslation();

    const user = useSelector((state: any) => state.user.data);

    const {navigation, route} = props

    const {item: service} = route.params;

    const [endFetch, setEndFetch] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const [elements, setElements] = useState<any>([]);

    const [total, setTotal] = useState(0);

    const [visible, setVisible] = useState(false);

    const [show, setShow] = useState(false);

    const [count, setCount] = useState(0);

    const [selected, setSelected] = useState([])

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(false);

    const openPanel = () => {
        setIsPanelActive(true);
    };
    
    const closePanel = () => {
        setIsPanelActive(false);
    };

    const evaluateTotal = (value: number) => {
        setTotal(state => state + value)
    }

    const handleOnSubmit = () => {
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'TOTAL:',
            textBody: getCurrency(total) + ' €',
            button: 'OK',
            onPressButton: () => {
                Dialog.hide()
                // openPanel()
            }
        })
    }

    // @ts-ignore
    const renderItem = ({ item }) => (<RenderItem evaluateTotal={evaluateTotal} setCount={setCount} count={count} item={ item } selected={selected} setSelected={setSelected} />)

    const getElements = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('elements-devis', null)
        formData.append('service', service.slug)
        // @ts-ignore
        formData.append('token', user.slug)

        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                setElements([...json.elements]);
                setEndFetch(true)
            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            console.warn(e)
        })
    }

    const onHandle = () => {
        console.log(selected);
        setShow(true)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('mail-sm-devis', null)
        formData.append('service', service.intituler)
        // formData.append('fonctionnalites', selected)
        let length = selected.length;
        for (let i = 0 ; i < length ; i++) {
            formData.append("fonctionnalites[]", selected[i]);
        }
        formData.append('total', getCurrency(total) + '€')
        // @ts-ignore
        formData.append('token', user.slug)
        console.log(formData);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: headers
        })
        .then(response => response.json())
        .then(json => {
            setShow(false)
            if(json.success) {
                handleOnSubmit()
                toast('success', t('quote_simulator_screen.msg_success_sent_quote'))
            } else {
                const errors = json.errors;
                console.warn('Errors: ', errors)
                if(json.mailer) {
                    handleOnSubmit()
                    toast('info', `${errors}`, `${t('quote_simulator_screen.error_identified')}`)
                } else {
                    toast('error', getErrorsToString(errors))
                }
            }
        })
        .catch(e => {
            setShow(false)
            console.warn(e)
        })
    }

    const onRefresh = () => {
        setRefresh(true);
        getElements();
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
            getElements();
        }
    }, [user])

    useEffect(() => {
        if(count !== 0 && !visible) 
            setVisible(true);
        else if(count === 0 && visible)
            setVisible(false);
    }, [visible, count])

    return (
        <>
            <Root theme='dark'>
                <Base>
                    <ModalValidationForm showM={show} />
                    <HeaderP
                        elevated={true}
                        backgroundColor={CodeColor.code1}
                        containerStyle={{ paddingTop: componentPaddingHeader }}
                        leftComponent={
                            <DashboardHeaderSimple navigation={navigation} title={`${t('quote_simulator_screen.screen_title')}`} />
                        }
                    />
                    {endFetch ?
                        <>
                            <View style={[tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                                <FlatList
                                    refreshControl={
                                        <RefreshControl
                                            colors={refreshColor}
                                            refreshing={refresh}
                                            onRefresh={onRefresh}
                                        />
                                    }
                                    ListEmptyComponent={<Text style={tw`text-center text-black`}>{t('quote_simulator_screen.no_items_found')}</Text>}
                                    scrollEnabled={true}
                                    contentContainerStyle={[tw`pt-5 px-2`, {}]}
                                    data={elements}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={true}
                                />
                            </View>

                            {elements.length !== 0 && (
                                <View style={[tw`bg-white border-t border-stone-200 justify-center items-center`, { height: 80 }]}>
                                    <TouchableOpacity
                                        onPress={onHandle}
                                        activeOpacity={0.5}
                                        disabled={!visible}
                                        style={[tw`rounded-lg w-90 px-2 py-4`, { backgroundColor: visible ? CodeColor.code1 : '#eee' }]}>
                                        <Text style={[tw`text-center ${visible ? 'text-white' : 'text-gray-500'} text-xl`, { fontFamily: 'YanoneKaffeesatz-Regular' }]}>{t('quote_simulator_screen.get_quote')}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                        : <ActivityLoading />
                    }
                </Base>
            </Root>
            <SwipeablePanel
                {...panelProps}
                smallPanelHeight={100}
                // onlySmall
                onlyLarge
                isActive={isPanelActive}
                // style={[tw``, { height: 100 }]}
                // openLarge
                showCloseButton
            >
                <View style={tw`items-center`}>
                    <Image
                        resizeMode='center'
                        style={{ width: PixelRatio.getPixelSizeForLayoutSize(80), height: PixelRatio.getPixelSizeForLayoutSize(80) }}
                        source={require('../../../../assets/images/undraw_Books.png')} />
                </View>

                <Button onPress={() => navigation.navigate('EditCdc', {})} mode='outlined' color={CodeColor.code1} style={tw`border mx-5 mb-5`}>{t('quote_simulator_screen.edit_my_specs')}</Button>
                <Button onPress={() => navigation.navigate('UploadCdc', {})} mode='outlined' color={CodeColor.code1} style={tw`border mx-5`}>{t('quote_simulator_screen.load_my_specs')}</Button>
            </SwipeablePanel>
        </>
        
    )
}

export default SimulateDevisScreen;