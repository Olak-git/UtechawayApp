import React, { Children, useEffect, useState } from 'react';
import { Alert, Button, Dimensions, FlatList, Image, ImageBackground, Keyboard, Pressable, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, ListItem, Avatar, Text as TextRNE } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { account, baseUri, componentPaddingHeader, fetchUri, formatDate, getUser, validatePassword, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { CommonActions, useNavigation } from '@react-navigation/native';
import SearchBar from '../../../../components/SearchBar';
import {Icon} from '@rneui/base';
import { ActivityIndicator } from 'react-native-paper';
import Header2 from '../../../../components/Header2';
import { CodeColor } from '../../../../assets/style';
import { refreshColor } from '../../../../data';
import CdcView from './components/CdcView';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface HistoriqueCdcScreenProps {
    navigation?: any,
    route?: any
}
const HistoriqueCdcScreen: React.FC<HistoriqueCdcScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    const refresh = useSelector((state: any) => state.refresh.historique_projects);

    const user = useSelector((state: any) => state.user.data);

    const [refreshing, setRefreshing] = useState(false);

    const [cdcs, setCdcs] = useState([]);

    const [data, setData] = useState([]);

    const [visible, setVisible] = useState(false);

    const [filterText, setFilterText] = useState('')

    const [loading, setLoading] = useState(false)

    const [showSearchForm, setShowSearchForm] = useState(false)

    const [endFetch, setEndFetch] = useState(false)

    const [rmItems, setRmItems] = useState([]);

    const [incr, setIncr] = useState(0)

    const onFilterChange = (value: string) => {
        setFilterText(value)
        if(value) {
            setLoading(true)
            const newData = data.filter((item) => {
                const text = value.toUpperCase()
                // @ts-ignore
                const cItem = item.nom + ' ' + formatDate(item.dat)
                const itemData = cItem.trim().toUpperCase()
                return itemData.indexOf(text) > -1
            })
            setCdcs(newData)
            // setLoading(false)
        } else {
            setCdcs(data)
            setLoading(false)
        }
    }

    const removeItem = (index: number) => {
        const copy = [...cdcs];
        copy.splice(index, 1);
        setCdcs(copy)
        setData(copy)
    }

    const deleteProject = (key: string, index: number) => {
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
            if(json.success) {
                setCdcs(json.cdcs)
                setData(json.cdcs)
                removeItem(index)
            } else {
                console.log('errors: ', json.errors)
            }
        })
        .catch(e => console.warn(e))
    }

    // @ts-ignore
    const renderItem = ({ item, index }) => (
        <CdcView navigation={ navigation } item={item} index={index} user={user} removeItem={removeItem} />
    )

    const getCdcs = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append(`${account}_cdcs`, null)
        // @ts-ignore
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            // console.log('Cdcs => ', json.cdcs)
            if(json.success) {
                setCdcs(json.cdcs)
                setData(json.cdcs)
            } else {
                console.warn(json.errors)
            }
            setEndFetch(true)
            // !endFetch ? setEndFetch(true) : null;
            setRefreshing(false)
        })
        .catch(e => console.warn(e))
    }

    const onRefresh = () => {
        setRefreshing(true);
        getCdcs();
    };

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
            getCdcs();
        }
    }, [user, refresh])

    useEffect(() => {
        let calc = incr + 1
        setIncr(calc)
    }, [rmItems])

    return (
            <Base>
                <Header2
                    backgroundColor={CodeColor.code1}
                    containerStyle={tw`${visible ? 'px-1' : 'px-0'}`}
                    navigation={navigation} 
                    headerTitle='Historique'
                    contentLeft={
                        visible
                        ?
                            <Pressable onPress={() => setVisible(false)}>
                                <Icon
                                    type='ant-design'
                                    name='arrowleft'
                                    size={30}
                                    color='#FFFFFF' />
                            </Pressable>
                        :
                            undefined
                    } 
                    content={
                        visible
                        ?
                            <SearchBar 
                                iconSearchColor='grey'
                                iconSearchSize={20}
                                loadingColor='grey'
                                containerStyle={[ tw`flex-1 px-3 my-2 rounded-lg border-0 bg-gray-200` ]}
                                inputContainerStyle={tw`border-b-0`}
                                placeholder={`${t('projects_screen.search_placeholder')}`}
                                value={filterText}
                                showLoading={loading}
                                onChangeText={onFilterChange}
                                onEndEditing={() => setLoading(false)}
                            />
                        :
                            <DashboardHeaderSimple navigation={navigation} title={`${t('projects_screen.screen_title')}`}
                                rightComponent={<Pressable onPress={() => setVisible(true)} disabled={!endFetch} style={tw``}>
                                                    <Icon type='ant-design' name="search1" color='#FFFFFF' />
                                                </Pressable>
                                                }
                            />
                    }
                />
                {endFetch
                ?
                    <View style={[ tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                        <FlatList
                            ListEmptyComponent={
                                <Text>{t('projects_screen.no_projects_found')}</Text>
                            }
                            nestedScrollEnabled={true}
                            data={cdcs}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            // showsVerticalScrollIndicator={true}
                            contentContainerStyle={[ tw`px-2 py-4` ]}
                            refreshControl={
                                <RefreshControl
                                    colors={refreshColor}
                                    refreshing={refreshing} 
                                    onRefresh={onRefresh} />
                            }
                        />
                    </View>
                :
                    <ActivityLoading />
                }
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
    }
})

export default HistoriqueCdcScreen;