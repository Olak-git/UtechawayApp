import React from 'react';
import { Icon, Text } from '@rneui/themed';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Linking, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { openUrl, rs } from '../functions/helperFunction';
import IconSocial from './IconSocial';
import tw from 'twrnc';

interface AuthBottomFormProps {
    containerStyle?: StyleProp<ViewStyle>
}

const AuthBottomForm: React.FC<AuthBottomFormProps> = ({containerStyle, ...props}) => {

    return (
        <>
        {/* <Text style={[ tw`text-white text-center mb-2` ]}>
            En continuant votre navigation, vous acceptez nos <Text onPress={() => Linking.openURL('https://utechaway.com')} style={[ {color: Colors.dark} ]}>Conditions d'utilisation</Text> et notre <Text onPress={() => Linking.openURL('https://utechaway.com')} style={[ {color: Colors.dark} ]}>Politique de confidentialité</Text>.
        </Text> */}

        <View style={[ tw`flex-row flex-wrap justify-between`, containerStyle ]}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => openUrl(rs.facebook)} style={tw`rounded-full`}>
                <IconSocial iconName='facebook' iconColor='#3b5998'/>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => openUrl(rs.linkedin)} style={tw`rounded-full`}>
                <IconSocial iconName='linkedin' iconColor='#0e76a8' />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => openUrl(rs.twitter)} style={tw`rounded-full`}>
                <IconSocial iconName='twitter' iconColor='#1DA1F2' />
            </TouchableOpacity>
        </View>
        </>
    )
}

export default AuthBottomForm;