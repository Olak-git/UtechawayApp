import React, { Children, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, ImageBackground, Keyboard, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, ListItem, Avatar, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, fetchUri, formatDate, getCurrency, getUser, toast, validatePassword, windowHeight } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { ColorsPers } from '../../../../components/Styles';
import { ModalValidationForm } from '../../../../components/ModalValidationForm';
import { ActivityIndicator, Button, DataTable } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Modal } from 'react-native-form-component';
import Feather from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { CommonActions } from '@react-navigation/native';
import  { default as HeaderP } from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { refreshColor } from '../../../../data';
import { setCdc } from '../../../../feature/data.slice';
import { refreshCdc, refreshHistoriqueFactures } from '../../../../feature/refresh.slice';
import { presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import PaypalPayment from './component/PaypalPayment';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';
import { openUrl } from '../../../../functions/helperFunction';
import { setAcceptPayment } from '../../../../feature/accept.payment.slice';


interface FactureScreenProps {
    navigation?: any,
    route?: any
}
const FactureScreen: React.FC<FactureScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const refreshFacture = useSelector((state: any) => state.refresh.facture);

    const accept_payment = useSelector((state:any) => state.accept_payment.value)

    // const [mnt, setMnt] = useState<number>(0)
    // const [showGateway, setShowGateway] = useState(false);
    // const [prog, setProg] = useState(false);
    // const [progClr, setProgClr] = useState('#000');
    // const [factureSelected, setFactureSelected] = useState<number>(0)

    const [disabled, setDisabled] = useState(false);

    const [paypalClientId, setPaypalClientId] = useState<string>('')

    const [data, setData] = useState({
        facture: route.params.facture,
        tranches: [],
        solde: null,
        param: null
    })

    const [endFetch, setEndFetch] = useState(false);

    const [refresh, setRefresh] = useState(false);

    const onHandleValid = () => {
        setDisabled(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append('validation-facture', null)
        formData.append('token', user.slug)
        formData.append('account', account)
        formData.append('facture', data.facture.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                setData((prevState) => ({ ...prevState, facture: json.facture, tranches: json.tranches, solde: json.solde, param: json.param }))
                dispatch(refreshCdc());
            } else {
                console.warn('errors: ', json.errors)
            }
            setDisabled(false);
        })
        .catch(e => {
            console.warn('FactureScreen Error1: ', e)
            setDisabled(false)
        })
    }

    const getData = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`data-facture`, null)
        formData.append('key', data.facture.slug)
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                console.log('Facture: ', json.facture)
                setPaypalClientId(json.clientId)
                setData((prevState) => ({ ...prevState, facture: json.facture, tranches: json.tranches, solde: json.solde, param: json.param }))
                if(json.accept_payment) {
                    dispatch(setAcceptPayment(json.accept_payment));
                }
            } else {
                console.warn('Errors: ', json.errors)
            }
            setEndFetch(true);
            setRefresh(false);
        })
        .catch(e => console.warn('FactureScreen Error2: ',e))
    }

    const onRefresh = () => {
        setRefresh(true);
        getData();
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
            getData();
        }
    }, [user, refreshFacture])

    return (
        <Base>
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('invoice_screen.title_screen')}`} />
                }
            />
            <View style={[tw`bg-white flex-1`]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={refreshColor}
                            refreshing={refresh}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={[tw`py-4 px-3`]}>
                        <View style={[tw`bg-slate-100 p-2 rounded-lg`, { elevation: 4 }]}>
                            <Text style={[tw`font-extrabold text-sm mb-2 text-black`]}>{`${t('invoice_screen.invoice')}`} N° {data.facture.code}</Text>
                            <Text style={[tw`font-semibold text-sm mb-1 text-black`]}>{t('invoice_screen.date')} : {formatDate(data.facture.dat)}</Text>
                            <Text style={[tw`font-semibold text-sm mb-1 text-black`]}>{t('invoice_screen.project')} : {data.facture.cdc_nom}</Text>
                            {/* <Text style={[tw`font-semibold text-sm mb-1 text-black`]}>{t('invoice_screen.project')} : {endFetch ? data.facture.cdc.nom : data.facture.cdc_nom}</Text> */}
                            <Text style={[tw`font-semibold text-sm mb-1 text-black`]}>{t('invoice_screen.total_price')} : {getCurrency(data.facture.mnt_eur)} €</Text>
                            {parseFloat(data.facture.valide) == 1 && (
                                <Text style={[tw`font-semibold text-sm text-right italic mb-1 text-black`]}>{t('invoice_screen.status')} : <Text style={[tw`${data.solde ? 'font-bold text-green-600' : 'text-red-600'}`]}>{data.solde ? t('invoice_screen.pay') : t('invoice_screen.still_to_pay')}</Text></Text>
                            )}
                        </View>

                        {parseFloat(data.facture.valide) != 1
                            ?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={onHandleValid}
                                disabled={disabled}
                                style={[tw`flex-row justify-center items-center rounded-lg py-4 border mt-4`, { minHeight: 40, backgroundColor: CodeColor.code1 }]}
                            >
                                {disabled && (
                                    <ActivityIndicator size={15} color='#FFF' style={tw`mr-2`} />
                                )}
                                <Text style={tw`text-center text-white`}>{t('invoice_screen.validate')}</Text>
                            </TouchableOpacity>
                            :
                            <View style={tw`mt-6`}>
                                {endFetch
                                ?
                                    !data.solde && (
                                        <View style={tw`flex-row justify-end mb-1`}>
                                            {/* {accept_payment && ( */}
                                            <Button 
                                                onPress={() => {
                                                    if(accept_payment) {
                                                        navigation.navigate('DashboadPayment', {facture: data.facture, param: data.param})
                                                    } else {
                                                        openUrl('https://my.utechaway.com')
                                                    }
                                                }} 
                                                mode='contained' 
                                                color='#000' 
                                                icon='plus' 
                                                labelStyle={tw`text-xs`}>{t('invoice_screen.pay_a_slice')}</Button>
                                            {/* )} */}
                                        </View>
                                    )
                                :
                                    <ActivityIndicator color='silver' style={tw`self-end mb-1`} />
                                }
                                <DataTable style={tw``}>
                                    <DataTable.Header style={[tw`bg-slate-200`]}>
                                        <DataTable.Title style={tw`flex-1`} textStyle={[tw`font-extrabold`]}>{t('invoice_screen.slice')}</DataTable.Title>
                                        <DataTable.Title style={tw`flex-3`} numeric textStyle={[tw`font-extrabold`]}>{t('invoice_screen.amount')}(€)</DataTable.Title>
                                        <DataTable.Title style={tw`flex-3`} numeric textStyle={[tw`font-extrabold`]}>{t('invoice_screen.payment_date')}</DataTable.Title>
                                    </DataTable.Header>
                                    {!endFetch
                                        ?
                                        <DataTable.Row style={[tw`px-0`]}>
                                            <DataTable.Cell style={tw`justify-center`}>
                                                <ActivityIndicator color='silver' />
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                        :
                                        data.tranches.length == 0
                                            ?
                                            <DataTable.Row style={[tw`px-0`]}>
                                                <DataTable.Cell style={tw`justify-center`}>
                                                {t('invoice_screen.no_files_found')}
                                                </DataTable.Cell>
                                            </DataTable.Row>
                                            :
                                            data.tranches.map((item: any, index: number) => (
                                                <DataTable.Row key={index.toString()}>
                                                    <DataTable.Cell style={tw`flex-1`}>{(index + 1).toString()}</DataTable.Cell>
                                                    <DataTable.Cell style={tw`flex-3`} numeric>{getCurrency(item.mnt)}</DataTable.Cell>
                                                    <DataTable.Cell style={tw`flex-3`} numeric>{item.dat_paiement ? formatDate(item.dat_paiement) : '#'}</DataTable.Cell>
                                                </DataTable.Row>
                                            ))
                                    }
                                    <DataTable.Header style={[tw`bg-white border-t border-b`]}>
                                        <DataTable.Cell textStyle={[tw`font-extrabold text-black text-base`]}>{t('invoice_screen.rest')}</DataTable.Cell>
                                        <DataTable.Cell numeric textStyle={[tw`font-extrabold text-black text-base`]}>
                                            {endFetch
                                                ?
                                                    `${getCurrency(data.facture.reste)}€`
                                                : <ActivityIndicator color='silver' />
                                            }
                                        </DataTable.Cell>
                                    </DataTable.Header>
                                </DataTable>
                            </View>
                        }

                    </View>
                </ScrollView>
            </View>
        </Base> 
    )
}

export default FactureScreen;