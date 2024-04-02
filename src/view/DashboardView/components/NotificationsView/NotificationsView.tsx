import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Base from '../../../../components/Base';
import Header from '../../../../components/Header';
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { account, fetchUri } from '../../../../functions/functions';
import { Icon } from '@rneui/themed';
import { getLocalDate, getLocalTime } from '../../../../functions/helperFunction';
import SearchBar from '../../../../components/SearchBar';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { addNotification } from '../../../../feature/notifications.slice';
import { CommonActions } from '@react-navigation/native';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import Header2 from '../../../../components/Header2';
import { CodeColor } from '../../../../assets/style';
import { ActivityIndicator } from 'react-native-paper';
import { refreshColor } from '../../../../data';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface NotificationsViewProps {
    navigation: any
}
const NotificationsView: React.FC<NotificationsViewProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const notifies = useSelector((state: any) => state.notifications.data);

    const user = useSelector((state: any) => state.user.data);

    const reload = useSelector((state: any) => state.reload.value);

    const [refList, setRefList] = useState(null);

    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notificationEmptyText, setNotificationEmptyText] = useState(t('notifications_screen.no_notifications_available'));
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [endFetch, setEndFetch] = useState(false);

    const [masterNotifications, setMasterNotifications] = useState<any>([]);
    const [notifications, setNotifications] = useState<any>([]);

    const getNotifications = () => {
        const formData = new FormData();
        formData.append('js', null);
        formData.append('token', user.slug);
        formData.append(`${account}_notifications`, null);
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setRefreshing(false);
            if(json.success) {
                // console.log(json);
                setNotifications([...json.notifications]);
                setMasterNotifications([...json.notifications]);
                setEndFetch(true);
            } else {
                const errors = json.errors;
                console.log(errors);
            }
        })
        .catch(error => {
            console.log(error)
            setRefreshing(false);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        getNotifications();
    }

    const filter = (text: string) => {
        // Check if searched text is not blank
        if (text) {
            setLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = masterNotifications.filter(function (item: any) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.intituler} ${item.dat}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setNotificationEmptyText(t('notifications_screen.no_result_found'));
            setNotifications(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setNotificationEmptyText(t('notifications_screen.no_notifications_available'));
            setNotifications(masterNotifications);
            setSearch('');
            setLoading(false);
        }
    }

    const onHandle = (item: any) => {
        dispatch(addNotification(item.id));
        navigation.navigate('DashDetailsNotification', {notification: item});
    }

    // @ts-ignore
    const renderItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => onHandle(item)}
                style={[ tw`flex-row mb-3` ]}>
                <Icon type='font-awesome' name={notifies.indexOf(item.id) === -1 ? 'envelope' : 'envelope-open'} />
                <View style={tw`ml-3`}>
                    <Text style={tw`${notifies.indexOf(item.id) === -1 ? 'font-black text-black' : 'font-bold text-gray-600'}`} numberOfLines={1} ellipsizeMode='tail'>{item.intituler}</Text>
                    <Text style={tw`${notifies.indexOf(item.id) === -1 ? 'font-semibold text-black' : 'text-gray-600'}`} numberOfLines={2} ellipsizeMode='tail'>{item.texte}</Text>
                    <Text style={tw`text-gray-400`}>{getLocalDate(item.dat)}</Text>
                </View>
            </TouchableOpacity>
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
        if(Object.keys(user).length == 0) {
            goHome();
        }
    }, [user])

    useEffect(() => {
        getNotifications();
    }, [reload])
    
    return (
        <Base>
            <Header2
                backgroundColor={CodeColor.code1}
                containerStyle={tw`${visible ? 'px-1' : 'px-0'}`}
                navigation={navigation}
                headerTitle={`${t('notifications_screen.screen_title')}`}
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
                            containerStyle={[tw`flex-1 px-3 my-2 rounded-lg border-0 bg-gray-200`]}
                            inputContainerStyle={tw`border-b-0`}
                            placeholder={`${t('notifications_screen.search_placeholder')}`}
                            value={search}
                            showLoading={loading}
                            onChangeText={filter}
                            onEndEditing={() => setLoading(false)}
                        />
                        :
                        <DashboardHeaderSimple navigation={navigation} title={`${t('notifications_screen.screen_title')}`}
                            rightComponent={
                                <Pressable onPress={() => setVisible(true)} disabled={!endFetch} style={tw``}>
                                    {endFetch
                                        ?   <Icon type='ant-design' name="search1" color='#FFFFFF' />
                                        :   <ActivityIndicator size={18} color='#ccc' />
                                    }
                                </Pressable>
                            }
                        />
                }
            />
            {endFetch
            ?
                <View style={[ tw`flex-1`, { backgroundColor: '#ffffff' }]}>
                <FlatList 
                    removeClippedSubviews={true}
                    initialNumToRender={notifications.length - 1}
                    keyboardDismissMode='none'
                    refreshControl={
                        <RefreshControl
                            colors={refreshColor}
                            refreshing={refreshing} 
                            onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={ 
                        <View>
                            <Text style={tw`text-gray-400`}>{notificationEmptyText}</Text>
                        </View>
                    }
                    data={notifications}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ref={(ref) => {
                        // @ts-ignore
                        setRefList(ref)
                    }}
                    contentContainerStyle={[ tw`p-4` ]}
                />
                </View>
            :
                <ActivityLoading />
            }
        </Base>
    )

}

export default NotificationsView;