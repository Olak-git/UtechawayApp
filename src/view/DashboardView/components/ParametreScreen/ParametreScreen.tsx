import React, { Children, useEffect, useState } from 'react';
import { Button, Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Base from '../../../../components/Base';
import tw from 'twrnc';
import { Card, Header, Switch, Tab, TabView, Text as TextRNE } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeaderSimple } from '../../../../components/DashboardHeaderSimple';
import { baseUri, componentPaddingHeader, fetchUri, getUser } from '../../../../functions/functions';
import { ActivityLoading } from '../../../../components/ActivityLoading';
import { CommonActions } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import  { default as HeaderP } from '../../../../components/Header';
import { CodeColor } from '../../../../assets/style';
import { openUrl } from '../../../../functions/helperFunction';
import '../../../../data/i18n';

const About = () => {
    return (
        <>
            <Text style={[ tw`text-base text-black font-200` ]}>A props de Amanou Tech</Text>
        </>
    )
}

const Conditions = () => {
    return (
        <>
            <Text style={[ tw`text-base text-black font-200` ]}>Conditions d'utilisation</Text>
        </>
    )
}

const Politique = () => {
    return (
        <>
            <Text style={[ tw`text-base text-black font-200` ]}>Politique de confidentialité</Text>
        </>
    )
}

const Version = () => {
    return (
        <>
            <Text style={[ tw`text-base text-black font-200` ]}>Version</Text>
        </>
    )
}

interface ParametreScreenProps {
    navigation?: any,
    route?: any
}

const ParametreScreen: React.FC<ParametreScreenProps> = (props) => {
    const {navigation, route} = props

    const {title, key} = route.params;

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const [endFetch, setEndFetch] = useState(false);

    const [source, setSource] = useState<any>(null);

    const getDoc = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('get-pdf-uri', null)
        formData.append('label', key);
        formData.append('token', user.slug)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if(json.success) {
                setSource(json.uri)
            } else {
                console.warn(json.errors)
            }
            setEndFetch(true);
        })
        .catch(e => {
            setEndFetch(true);
            console.warn(e)
        })
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
        } else {
            getDoc();
        }
    }, [user])

    return (
        <Base>
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={title} />
                }
            />
            {endFetch
            ?
                <View style={[tw`bg-white flex-1`]}>
                    <Pdf
                        trustAllCerts={false}
                        source={{uri: source}}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            openUrl(uri)
                        }}
                        spacing={0}
                        fitPolicy={0}
                        maxScale={2}
                        style={styles.pdf}
                    />
                    {/* <ScrollView>
                        <View style={[tw`py-4 px-3 text-base`]}>
                            {route.params.index == 3 ?
                                <About /> :
                                route.params.index == 4 ?
                                    <Conditions /> :
                                    route.params.index == 5 ?
                                        <Politique /> :
                                        route.params.index == 7 ?
                                            <Version /> : <></>}
                        </View>
                    </ScrollView> */}
                </View>
            :
                <ActivityLoading />
            }
        </Base>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default ParametreScreen;