import React, { useEffect, useState } from "react"
import { Icon, ListItem } from "@rneui/base"
import { account, fetchUri, formatDate, getCurrency, getRandomInt } from "../../../../../functions/functions"
import { Pressable, ScrollView, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import tw from 'twrnc';
import { FlatList } from "react-native";
import { ActivityIndicator, Button, DataTable } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { refreshHomeData } from "../../../../../feature/refresh.slice";
import { ActivityLoading } from "../../../../../components/ActivityLoading";
import '../../../../../data/i18n';
import { useTranslation } from "react-i18next";

interface TabFactureProps {
    navigation: any,
    data: any,
    visible: boolean,
    onRefresh: any,
    user: any,
}
export const TabFacture: React.FC<TabFactureProps> = ({ navigation, data, visible, onRefresh, user }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const refresh = useSelector((state: any) => state.refresh.historique_factures);

    const [factures, setFactures] = useState(data);

    const [endFetch, setEndFetch] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const getFactures = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_factures`, null)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                // setFactures(json.factures);
            } else {
                console.warn(json.errors)
            }
            setEndFetch(true);
            setRefreshing(false)
        })
        .catch(e => console.warn(e))
    }

    const onHandleValid = (setLoading: any, setItem: any, item: any) => {
        setLoading(true);
        const formData = new FormData()
        formData.append('js', null)
        formData.append('validation-facture', null)
        formData.append('token', user.slug)
        formData.append('account', account)
        formData.append('facture', item.slug);
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                setLoading(false);
                setItem(json.facture);
                // dispatch(refreshHomeData());
            } else {
                console.warn(json.errors)
            }
        })
        .catch(e => {
            setLoading(false);
            console.warn(e)
        })
    }

    // @ts-ignore
    const renderFacture = ({item, index}) => {
        let status = t('dashboard_screen.pending');
        let textColor = '';
        let borderColor = 'border-black';
        if(parseFloat(item.reste) == 0) {
            status = t('dashboard_screen.pay');
            textColor = 'text-green-800';
            borderColor = 'border-green-800';
        } else if(parseFloat(item.reste) == parseFloat(item.mnt_eur)) {
            status = t('dashboard_screen.pending');
            textColor = 'text-neutral-500';
            borderColor = 'border-neutral-500';
        } else if(parseFloat(item.reste) < parseFloat(item.mnt_eur)) {
            status = `-${getCurrency(parseFloat(item.reste))}€`;
            textColor = 'text-orange-700';
            borderColor = 'border-orange-700';
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate('DashboadClientFacture2', {facture: item})}
                style={[ tw`rounded-xl bg-gray-100 mb-5 p-3 ${borderColor}`, {elevation: 5, shadowColor: 'gray', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {width: 0, height: 5}, borderStartWidth: 8} ]}>
                <View style={[ tw`` ]}>
                    <View style={tw`flex-row justify-between mb-3 pb-2 border-b border-gray-400`}>
                        <View style={tw`flex-1`}>
                            <Text style={[ tw`font-extrabold text-black` ]}>{t('dashboard_screen.invoice')} N° {item.code}</Text>
                            <Text style={[ tw`font-thin text-black ${textColor}` ]}>{item.cdc_nom}</Text>
                        </View>
                        <Text style={tw`self-end pl-3 font-bold ${textColor}`}>{status}</Text>
                    </View>
                    <Text style={[ tw`text-black text-lg border-b border-gray-300 pb-1` ]}>{t('dashboard_screen.total_price')}: {getCurrency(item.mnt_eur)} €</Text>
                    <Text style={[ tw`mt-2 text-black text-xs` ]}>{ formatDate(item.dat) }</Text>
                </View>
            </TouchableOpacity>
        )
    }

    // const onRefresh = () => {
    //     setRefreshing(true);
    //     getFactures();
    // }

    useEffect(() => {
        // console.log('Factures: ', factures)
        setFactures(data)
    }, [data])

    // useEffect(() => {
    //     getFactures();
    // }, [refresh])

    return (
        visible ?
            <FlatList
                ListEmptyComponent={
                    <View>
                        <Text style={[ tw`text-black text-center` ]}>{t('dashboard_screen.no_invoice_found')}</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        colors={['red', 'blue', 'green']}
                        refreshing={refreshing} 
                        onRefresh={onRefresh} />
                }
                contentContainerStyle={[ tw`pt-5 pb-50 px-2` ]}
                data={ factures }
                keyExtractor={(item, index) => index.toString()} 
                renderItem={renderFacture}
                horizontal={false}
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ true }
            />
        :
            <ActivityLoading containerStyle={tw`justify-start pt-10`} />
    )
}