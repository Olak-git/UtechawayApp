import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface Header2Props {
    backgroundColor?: string,
    containerStyle?: StyleProp<ViewStyle>,
    navigation: any,
    headerTitle?: string,
    contentLeft?: React.ReactElement,
    content?: React.ReactElement,
    goBack?: boolean
}
const Header2: React.FC<Header2Props> = ({backgroundColor, containerStyle, navigation, headerTitle, contentLeft, content, goBack}) => {
    return (
        <View style={[ tw`flex-row items-center px-4`, {height: 60, backgroundColor}, containerStyle ]}>
            {goBack && (
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon 
                        type='ant-design'
                        name='arrowleft'
                        size={30} />
                </Pressable>
            )}
            {contentLeft && (
                <View style={[tw``]}>{contentLeft}</View>   
            )}
            {content
            ?
                <View style={[tw`flex-1`]}>{content}</View>
            :
                <Text style={[ tw`px-4 text-lg text-black` ]}>{ headerTitle }</Text>
            }
        </View>
    )
}

export default Header2;