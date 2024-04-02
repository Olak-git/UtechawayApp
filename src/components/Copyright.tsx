import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { CodeColor } from '../assets/style'
import tw from 'twrnc';

const Copyright: React.FC<{containerStyle?: StyleProp<ViewStyle>, textStyle?: StyleProp<TextStyle>}> = ({containerStyle, textStyle}) => {
    return (
        <View style={[ tw`px-5 py-4`, {}, containerStyle ]}>
            <Text style={[ tw`text-center text-black`, textStyle]}>2023 Amanou Company Ltd. All Rights Reserved | Designed by Utechaway</Text>
        </View>
    )
}

export default Copyright