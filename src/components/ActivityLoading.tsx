import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { ActivityIndicator as ActivityIndicatorRNP } from 'react-native-paper';
import { Modal } from 'react-native-form-component';
import { CodeColor } from '../assets/style';
import tw from 'twrnc';

interface ActivityLoadingProps {
    containerStyle?: StyleProp<ViewStyle>,
    backgroundColor?: string
}
export const ActivityLoading: React.FC<ActivityLoadingProps> = ({containerStyle, backgroundColor}) => {
    
    return (
        <View style={[tw`flex-1 justify-center items-center`, {backgroundColor}, containerStyle]}>
            <ActivityIndicatorRNP
                // size={'large'}
                color={CodeColor.code1}
                animating />
        </View>
    )
}