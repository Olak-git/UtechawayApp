import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import React from 'react';
import { Dimensions, StatusBar, StyleProp, useWindowDimensions, ViewStyle } from 'react-native';
import { ViewProps } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { windowWidth } from '../functions/functions';

export type barType = 'default' | 'light-content' | 'dark-content';
interface HeaderProps {
    elevated: boolean,
    backgroundColor?: string,
    withStatusbar?: boolean,
    barStyle?: barType,
    containerStyle?: StyleProp<ViewStyle>,
    leftComponent?: React.ReactElement,
    leftContainerStyle?: StyleProp<ViewProps>,
    centerComponent?: React.ReactElement,
    centerContainerStyle?: StyleProp<ViewProps>,
    rightComponent?: React.ReactElement,
    rightContainerStyle?: StyleProp<ViewProps>,
}
const Header: React.FC<HeaderProps> = ({elevated, backgroundColor, withStatusbar, barStyle = 'default', containerStyle, leftComponent, leftContainerStyle, centerComponent, centerContainerStyle, rightComponent, rightContainerStyle}) => {
    // const { width, height, scale, fontScale } = useWindowDimensions();
    return (
        <>
            {withStatusbar && (
                <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
            )}
            <View style={[ tw`flex-row items-center`, {backgroundColor}, containerStyle ]}>
                {leftComponent && (
                    <View style={[tw`flex-1`, leftContainerStyle]}>{leftComponent}</View>
                )}
                {centerComponent && (
                    <View style={[tw`flex-1`, centerContainerStyle]}>{centerComponent}</View>
                )}
                {rightComponent && (
                    <View style={[tw`flex-1`, rightContainerStyle]}>{rightComponent}</View>
                )}
            </View>
        </>
    )
}

export default Header;