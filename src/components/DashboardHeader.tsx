import { Icon } from '@rneui/base';
import { Tab } from '@rneui/themed';
import React, { useEffect } from 'react';
import { Image, PixelRatio, Pressable, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import { CodeColor } from '../assets/style';
import { baseUri, getRandomInt } from '../functions/functions';

interface DashboardHeaderProps {
    navigation?: any,
    route?: any,
    index?: number,
    setIndex?: any,
    userImage?: any | null,
    itemsNavBar?: any,
    user: any;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({navigation, route, index, setIndex = () => {}, userImage = null, itemsNavBar = [], user}) => {

    const imageSrc = userImage ? { uri: baseUri + '/assets/avatars/' + userImage } : require('../assets/images/user.png')
    const path = user.image ? {uri: user.image} : require('../assets/images/user-1.png');
    const notifs = useSelector((state: any) => state.notifications.count)

    return (
        <View style={[ tw`` ]}>
            <View style={[ tw`flex-row flex-wrap justify-between items-center mb-2` ]}>
                <Image 
                    style={[tw`rounded-full`, {width: 50, height: 50, resizeMode: 'contain'}]}
                    source={require('../assets/images/logo-2.png')} />
                <View style={[ tw`flex-row items-center` ]}>
                    <Pressable onPress={() => navigation.navigate('DashboadPanel')}
                        style={[ tw`justify-center items-center border-2 border-white rounded-full overflow-hidden`, {} ]}>
                        <Image
                            defaultSource={require('../assets/images/user-1.png')}
                            resizeMode='contain'
                            style={[ tw`rounded-full`, { width: 45, height: 45, maxHeight: '100%' }]}
                            source={path} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('DashboadSettings')} style={tw`mx-5`}>
                        <Icon type='ionicon' name='settings-sharp' size={28} color='#FFFFFF' />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('DashNotifications')} style={tw`relative`}>
                        <Icon type='ionicon' name='ios-notifications-sharp' size={30} color='#FFFFFF' />
                        <Badge children={notifs} visible={notifs !== 0} style={tw`absolute left-4`} />
                    </Pressable>
                </View>
            </View>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                containerStyle={[ tw`p-0 m-0`, {backgroundColor:CodeColor.code1 }]}
                indicatorStyle={[ tw`bg-amber-400`, {height: 3} ]}
                variant='primary' >
                {
                    itemsNavBar.map((item:string, index: any) => (
                        <Tab.Item
                            key={ index.toString() } 
                            title={item}
                            containerStyle={{ backgroundColor:CodeColor.code1 }}
                            titleStyle={[ tw`p-0`, {fontFamily: 'YanoneKaffeesatz-Regular'} ]} />
                    ))
                }
            </Tab>
        </View>
    )
}