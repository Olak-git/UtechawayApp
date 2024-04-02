import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PixelRatio, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { setWelcome } from '../../feature/init.slice';
import { CodeColor } from '../../assets/style';
import '../../data/i18n';
import { useTranslation } from 'react-i18next';

const timer = require('react-native-timer');

interface WelcomeViewProps {
   navigation: any,
   route: any 
}
const WelcomeView: React.FC<WelcomeViewProps> = (props) => {

    const { t, i18n } = useTranslation();

    const {navigation, route} = props;

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);

    const {welcome: hasGreet} = init;

    const LogoAnime = useRef(new Animated.Value(0)).current;
    const LogoText = useRef(new Animated.Value(0)).current;
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const [state, setState] = useState({
        logoAnime: new Animated.Value(0),
        logoText: new Animated.Value(0),
        loadingSpinner: false
    })

    const dispatchNavigation = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Presentation'}
                ]
            })
        )
    }

    const onHandle = async () => {
        await dispatch(setWelcome(true))
    }

    useEffect(() => {
        Animated.parallel([
            // @ts-ignore
            Animated.spring(LogoAnime, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: false
            }).start(),

            // @ts-ignore
            Animated.timing(LogoText, {
                toValue: 1,
                easing: Easing.back(1),
                duration: 1000,
                useNativeDriver: true
            }),
        ]).start(() => {
            setLoadingSpinner(true)
        })
    }, [])

    useEffect(() => {
        if(hasGreet) {
            dispatchNavigation();
        } else {
            timer.setTimeout('splash', onHandle, 3000);
        }
        return ()=>{
            if(timer.timeoutExists('splash')) {
                timer.clearTimeout('splash')
            }
        }
    }, [hasGreet])

    return (
        <SafeAreaView style={tw`bg-black flex-1 justify-center items-center`}>
            <StatusBar backgroundColor={ CodeColor.code1 } hidden />
            <Animated.View style={{opacity: LogoAnime, top: LogoAnime.interpolate({
                inputRange: [0,1],
                outputRange: [80,0]
            })}}>
                <Image 
                    style={[tw``, {width: PixelRatio.getPixelSizeForLayoutSize(100), height: PixelRatio.getPixelSizeForLayoutSize(20)}]}
                    source={require('../../assets/images/logo-4.png')}
                />
            </Animated.View>
            <Animated.View style={[tw`absolute bottom-5`, {opacity: LogoText}]}>
                <Text style={[tw`text-white`, {fontFamily: 'YanoneKaffeesatz-Light'}]}>{t('home_page.welcome_to_utechaway')}</Text>
            </Animated.View>
        </SafeAreaView>
    )
}

export default WelcomeView;