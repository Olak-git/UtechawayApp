import { ScreenHeight } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Animated, ActivityIndicator, Dimensions, LogBox, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { CodeColor } from '../assets/style';
import { clearMessages } from '../feature/messages.slice';
import { deleteUser } from '../feature/user.slice';

// LogBox.ignoreLogs(['Warning: Require cycle']);

export type barType = 'default' | 'light-content' | 'dark-content';
interface BaseProps {
    visible?: boolean,
    headNav?: any,
    visibleBottomView?: boolean,
    bottomView?: any,
    componentScroll?: boolean,
    barStyle?: barType,
    hiddenStatusBar?: boolean,
}
const Base: React.FC<BaseProps> = (props) => {

    const { children, hiddenStatusBar, barStyle = 'default' } = props

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const barCurrentHeight = StatusBar.currentHeight;

    const isDarkMode = useColorScheme() === 'dark';
  
    const backgroundStyle = {
      backgroundColor: Colors.white
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    };

    useEffect(() => {
        if(Object.keys(user).length !== 0 && user.del == 1) {
            dispatch(clearMessages());
            dispatch(deleteUser());
        }
    }, [user])
  
    return (
        // paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
        <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
            <StatusBar
                // hidden={ false }
                backgroundColor={CodeColor.code1}
                translucent={false}
                // networkActivityIndicatorVisible={true}
                barStyle={barStyle}
            />
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default Base;