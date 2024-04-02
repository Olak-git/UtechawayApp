import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Dimensions, FlatList, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Icon, ListItem, SpeedDial, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../../../components/DashboardHeader';
import { account, baseUri, componentPaddingHeader, fetchUri, formatDate, getRandomInt, getUser, windowHeight, windowWidth } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import IconSocial from '../../../../components/IconSocial';
import { TabItemOne } from './components/TabItemOne';
import { TabContrat } from './components/TabContrat';
import { TabFacture } from './components/TabFacture';
import { ColorsPers } from '../../../../components/Styles';
import { CommonActions } from '@react-navigation/native';
import { CodeColor } from '../../../../assets/style';
import  { default as HeaderP } from '../../../../components/Header';
import { clearMessages } from '../../../../feature/messages.slice';
import { clone } from '../../../../functions/helperFunction';
import { setUser, setUserIndex } from '../../../../feature/user.slice';
import { setStopped } from '../../../../feature/init.slice';
import { setCount } from '../../../../feature/notifications.slice';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const timer = require('react-native-timer')

interface HomeScreenProps {
    navigation?: any,
    route?: any
}
const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    // const dispatch = useDispatch();
    // const focused = useSelector((state: any) => state.focused.value)

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const stopped = useSelector((state: any) => state.init.stopped);

    const refresh = useSelector((state: any) => state.refresh.home_data)

    const [refreshing, setRefreshing] = useState(false);

    const [index, setIndex] = useState(0)

    const [noFetch, setNoFetch] = useState(false)

    const notifies = useSelector((state: any) => state.notifications.data);

    const counter = useSelector((state: any) => state.notifications.count)

    const [data, setData] = useState({
        factures: [],
        contrats: [],
        messages_unread: 0
    });

    const [endFetch, setEndFetch] = useState(false)

    const [open, setOpen] = useState(false);

    const getData = () => {
        if(!stopped) {
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`data-home`, null)
            // @ts-ignore
            formData.append('token', user.slug)
            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                if(json.success) {
                    setData((prevState) => ({ ...prevState, factures: json.factures, contrats: json.contrats, messages_unread: json.messages_unread }))
                    if(json.user) {
                        setNoFetch(true);
                        const _user = json.user;
                        let image = _user.image;
                        const data = clone(_user);
                        if(data.image) {
                            data.image = `${baseUri}/assets/avatars/${image}`;
                        }
                        dispatch(setUser({...data}));
                        let c = 0;
                        const notifications = json.notifications;
                        notifications.map((v: any) => {
                            if(notifies.indexOf(v.id) == -1) {
                                c++;
                            }
                        })
                        dispatch(setCount(c))
                    }
                } else {
                    console.warn(json.errors)
                }
                setEndFetch(true)
                setRefreshing(false)
            })
            .catch(e => {
                setEndFetch(true)
                console.warn(e)
            })
        }
    }

    const onRefresh = () => {
        if(stopped) {
            dispatch(setStopped(false))
        }
        setRefreshing(true);
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
        if(Object.keys(user).length !== 0) {
            if(!noFetch) {
                getData();
            }
        } else {
            goHome()
        }
    }, [user])

    useEffect(() => {
        timer.setInterval('home-get-data', getData, 5000);
        // const timer = setInterval(getData, 5000);
        return () => {
            if(timer.intervalExists('home-get-data')) {
                timer.clearInterval('home-get-data')
            }
            // clearInterval(timer);
        }
    }, [stopped, notifies, counter])

    return (
        <Base>
            {/* {endFetch ?
            <> */}
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                barStyle='default'
                containerStyle={[tw`py-2 px-4`]}
                centerComponent={
                    <DashboardHeader
                        user={user}
                        itemsNavBar={[t('home_top_menu.order'), t('home_top_menu.agreement'), t('home_top_menu.invoice')]}
                        userImage={user.image}
                        navigation={navigation} index={index} setIndex={setIndex} 
                    />
                }
            />
            
            <View style={[ tw``, { backgroundColor: '#ffffff', minHeight: windowHeight }]}>

                <TabView 
                    value={index}
                    onChange={setIndex}
                    animationType='timing'
                    tabItemContainerStyle={[ tw``, {} ]}
                    containerStyle={[ tw`flex flex-1`, {width: windowWidth} ]}>

                     <TabView.Item style={[tw`flex-1`, { width: windowWidth }]}>
                        
                        <TabItemOne navigation={ navigation } />

                    </TabView.Item>

                    <TabView.Item style={[ tw`flex-1` ]}>

                        <TabContrat data={data.contrats} visible={endFetch} navigation={navigation} onRefresh={ onRefresh } user={user} />

                    </TabView.Item>

                    <TabView.Item style={[ tw`flex-1` ]}>
                        
                        <TabFacture data={data.factures} visible={endFetch} navigation={navigation} onRefresh={ onRefresh } user={user} />

                    </TabView.Item>

                </TabView>

            </View>

            <SpeedDial
                isOpen={open}
                icon={{ type: 'ant-design', name: 'plus', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                color={CodeColor.code1}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
                title={(!open && data.messages_unread && data.messages_unread != 0) ? data.messages_unread.toString() : undefined}
            >
                <SpeedDial.Action
                    icon={{ type: 'material-community', name: 'history', color: '#fff' }}
                    color={CodeColor.code1}
                    title={`${t('home_bottom_menu.my_projects')}`}
                    onPress={() => {
                        setOpen(false);
                        navigation.navigate('DashboadProjects');
                    }}
                />
                <SpeedDial.Action 
                    icon={{ type: 'material-community', name: 'message', color: '#fff' }} 
                    color={CodeColor.code1} 
                    title={`${t('home_bottom_menu.my_messages')} ${data.messages_unread && data.messages_unread != 0 ? '(' + data.messages_unread + ')' : ''}`} 
                    onPress={() => {
                        setOpen(false);
                        // navigation.navigate('DashboadChatScreen');
                        navigation.navigate('DashboadMessages2');
                    }} 
                />
                <SpeedDial.Action
                    icon={{ type: 'material-community', name: 'video', color: '#fff' }} 
                    color={user.block == 1 ? 'silver' : CodeColor.code1}
                    title='Meeting' 
                    onPress={() => {
                        setOpen(false);
                        navigation.navigate('DashboadVideoSdkLive');
                    }}
                    disabled={user.block == 1}
                />
            </SpeedDial>
            {/* </>
            : <ActivityLoading />
            } */}
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

export default HomeScreen;