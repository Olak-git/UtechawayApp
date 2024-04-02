import React, { useEffect, useRef, useState } from 'react';
import { LogBox, ActivityIndicator, Animated, Button, Dimensions, Image, ImageBackground, Keyboard, Linking, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import Base from '../../components/Base';
import tw from 'twrnc';
import { Card, CheckBox, Header } from '@rneui/themed';
import  { default as HeaderP } from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { account, baseUri, componentPaddingHeader, fetchUri, getUser, show_sign_checbox, toast, windowHeight } from '../../functions/functions';
import { ModalValidationForm } from '../../components/ModalValidationForm';
import { CommonActions } from '@react-navigation/native';
import { clone, openUrl } from '../../functions/helperFunction';
import { CodeColor } from '../../assets/style';
import AuthBottomForm from '../../components/AuthBottomForm';
import { setUser, setUserIndex } from '../../feature/user.slice';
import Copyright from '../../components/Copyright';
import InputForm2 from '../../components/InputForm2';
import { setStopped } from '../../feature/init.slice';
import Termes from '../../components/Termes';
import '../../data/i18n';
import { useTranslation } from 'react-i18next';
import { Divider } from '@rneui/base';
import OAuthButton from '../../components/OAuthButton';

interface CardPersoProps {
    requireSource?: any,
    title?: string
}
const CardPerso: React.FC<CardPersoProps> = (props) => {
    const {requireSource, title } = props
    return (
        <Card containerStyle={[ tw`p-0 flex-1 shadow-none border-0` ]}>
            <View style={[ tw`flex-auto justify-center items-center mb-3`, { height: 110, borderRadius: 15, backgroundColor: CodeColor.code1 }]}>
                <Image
                    style={[ {borderWidth: 0, width: 100, height: 90, resizeMode: 'contain'} ]}
                    source={requireSource} />
            </View>
            <Card.Title style={[ tw`font-light text-xs` ]}>{ title }</Card.Title>
        </Card>
    )
}

interface HomeViewProps {
    navigation: any,
    route: any
}
const HomeView: React.FC<HomeViewProps> = (props) => {

    const { t } = useTranslation();

    const {navigation, route} = props

    const dispatch = useDispatch();

    const scrollRef = useRef(null);

    // @ts-ignore
    const user = useSelector(state => state.user.data);

    const [accountUser, setAccountUser] = useState({});

    const [showModal, setShowModal] = useState(false)

    const [googleUser, setGoogleUser] = useState({});

    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = React.useState({
        email: null,
        password: null
    })

    const onListScrollTo = () => {
        // @ts-ignore
        scrollRef?.current?.scrollTo({ x:0, y: 800, animated: true })
    }

    const handleOnChange = (text: any, input: string) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    const handleError = (text: any, input: string) => {
        setErrors(prevState => ({...prevState, [input]: text}))
    }

    const confirmationAccount = () => {
        navigation.navigate('Otp', {user: accountUser})
    }

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'DashboadClientHome'}
                ]
            })
        )
    }

    const onSubmit = () => {
        Keyboard.dismiss()
        let valid = true
        if(!inputs.email) {
            valid = false
            handleError(`${t('login_screen.is_required')}`, 'email')
        } else {
            handleError(null, 'email')
        }
        
        if(!inputs.password) {
            valid = false
            handleError(`${t('login_screen.is_required')}`, 'password')
        } else {
            handleError(null, 'password')
        }

        if(!valid) {
            console.error('Invalid Form')
        } else {
            setShowModal(true)
            const formData = new FormData()
            formData.append('js', null)
            formData.append('csrf', null)
            formData.append(`${account}_signin[email]`, inputs.email)
            formData.append(`${account}_signin[password]`, inputs.password)
            fetch(fetchUri, {
                method: 'POST',
                headers: {},
                body: formData
            })
            .then(response => response.json())
            .then(async (json) => {
                setShowModal(false)
                if(json.success) {
                    const _user = json.user;
                    let image = _user.image;
                    const data = clone(_user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    if(data.valide == 1) {
                        dispatch(setStopped(false))
                        dispatch(setUser({...data}));
                    } else {
                        setAccountUser({...data})
                    }
                } else {
                    const errors = json.errors
                    console.log('errors: ', errors)
                    for(let k in errors) {
                        handleError(errors[k], k);
                    }
                }
            })
            .catch(e => {
                setShowModal(false)
                console.warn(e)
            })
        }
    }

    useEffect(() => {
        console.log('GoogleUser: ', googleUser)
    }, [googleUser])

    useEffect( () => {
        if(Object.keys(user).length !== 0) {
            goDashboard();
        }
    }, [user])

    useEffect(() => {
        if(Object.keys(accountUser).length !== 0) {
            confirmationAccount();
        }
    }, [accountUser])

    return (
        <Base>
            <ModalValidationForm showM={showModal} />
            <HeaderP
                elevated={true}
                withStatusbar
                backgroundColor='#000'
                containerStyle={{ paddingTop: componentPaddingHeader }}
                centerComponent={
                    <Image
                        resizeMode='contain'
                        style={{ width: 100, height: 70, resizeMode: 'contain' }}
                        source={require('../../assets/images/logo-4.png')} />
                }
                centerContainerStyle={tw`items-center`}
            />
            
            <ScrollView
                // onScroll={e => console.log(e)}
                scrollIndicatorInsets={{top: 100, left: 0, bottom: 0, right: 0}}
                ref={scrollRef}
            >
                <View style={{ backgroundColor: '#FFF', flex: 1, minHeight: windowHeight - 110 }}>
                    <View style={[ tw`pb-6` ]}>
                        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                            <Text style={[tw`text-black text-center mb-2`, {fontFamily: 'Audiowide-Regular', fontSize: 25, lineHeight: 33}]}>{t('login_screen.digital_solution')}</Text>
                            <Text style={[ tw`text-black text-center`, {fontFamily: 'YanoneKaffeesatz-Light', fontSize: 20}]}>{t('login_screen.digital_transition')}</Text>
                        </View>
                        <View style={{ marginTop: 25}}>
                            <ImageBackground
                                    resizeMode='contain'
                                    style={{ paddingHorizontal: 40, paddingVertical: 30 }}
                                    source={require('../../assets/images/prs_dans_le_monde.png')}>
                                <View style={[tw`px-6 py-4`, { height: 'auto', backgroundColor: CodeColor.code1, borderRadius: 20, overflow: 'hidden' }]}>
                                    
                                    <>
                                        <InputForm2
                                            placeholder={`${t('login_screen.email')}`}
                                            keyboardType='email-address'
                                            onChangeText={(text: string) => handleOnChange(text, 'email')}
                                            error={errors.email}
                                            errorStyle={tw`text-white`} />
                                            
                                        <InputForm2
                                            placeholder={`${t('login_screen.password')}`}
                                            password={true}
                                            onChangeText={(text: string) => handleOnChange(text, 'password')}
                                            error={errors.password}
                                            errorStyle={tw`text-white`} />

                                        <View style={tw`items-end mb-4`}>
                                            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} activeOpacity={0.5} style={tw``}>
                                                <Text style={tw`text-white`}>{t('login_screen.forgot_password')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={onSubmit}
                                            style={[ tw`mb-4 justify-center`, {backgroundColor: '#000', borderRadius: 7, height: 50} ]}>
                                            <Text style={[ tw`text-white text-center text-lg` ]}>{t('login_screen.login')}</Text>
                                        </TouchableOpacity>
                                    </>

                                    <Termes />

                                </View>
                            </ImageBackground>

                            <View style={tw`flex-row items-center mx-10`}>
                                <Divider style={tw`flex-1`} />
                                <Text style={tw`mx-3 uppercase text-black`}>Or</Text>
                                <Divider style={tw`flex-1`} />
                            </View>
                            <OAuthButton setUser={setGoogleUser} signin='oui' setShowValidationModal={setShowModal} />

                        </View>

                        <View style={[tw`mt-1`, {  }]}>
                            <Text style={[ tw`text-black text-center`]}>{t('login_screen.no_account')} <Text  onPress={() => navigation.navigate('SignUp')} style={[ tw`text-orange-300` ]}>{t('login_screen.sign_up')} !</Text></Text>
                        </View>

                        <View style={tw`mt-8 px-10`}>
                            <Text style={tw`text-black text-center mb-3`}>{t('login_screen.follow_us')}:</Text>
                            <AuthBottomForm />
                        </View>

                        {/* <TouchableOpacity onPress={signOut}>
                            <Text>SignOut</Text>
                        </TouchableOpacity> */}

                        {/* <View style={[tw`mt-10`, { alignItems: 'center' }]}>
                            <Pressable onPress={onListScrollTo} style={[tw`text-center`]}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/images/chevron-down-1.png')} />
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/images/chevron-down-2.png')} />
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/images/chevron-down-1.png')} />
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/images/chevron-down-2.png')} />
                            </Pressable>
                        </View> */}
                    </View>

                    {/* <View style={[ tw`bg-white px-6 py-10`, { } ]}>
                        <View style={[ tw`mb-5` ]}>
                            <Text style={[ styles.title ]}>Espace client</Text>
                            <Text style={[ styles.paragraph ]}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla a esse odit obcaecati reiciendis necessitatibus velit, distinctio laborum quos saepe delectus tempora neque mollitia iusto corporis eaque architecto sit molestias?
                            </Text>
                            <View style={[ tw`flex-row justify-center mt-2` ]}>
                                <Pressable onPress={() => navigation.navigate('SignUp')}>
                                    <Text style={[ tw`text-orange-500 text-center`, {fontFamily: 'YanoneKaffeesatz-SemiBold', color: CodeColor.code2 }]}>S'inscrire</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[ tw`px-4` ]}>
                            <Text style={[ tw`text-center text-2xl`, {fontFamily: 'ShadowsIntoLight-Regular', color: CodeColor.code4 }]}>Nous sommes :</Text>

                            <View style={[ tw`flex flex-row` ]}>
                                <CardPerso title='Fiable' requireSource={require('../../assets/images/fiable.png')} />
                                <CardPerso title='Présent dans plusieurs pays' requireSource={require('../../assets/images/prs_dans_le_monde.png')} />
                            </View>
                            <View style={[ tw`flex flex-row mb-6` ]}>
                                <CardPerso title='Fiable' requireSource={require('../../assets/images/fiable.png')} />
                                <CardPerso title='Présent dans plusieurs pays' requireSource={require('../../assets/images/prs_dans_le_monde.png')} />
                            </View>

                            <View style={[ tw`px-4` ]}>
                                <Text style={[ tw`text-center text-lg text-zinc-900 mb-2`, {fontFamily: 'YanoneKaffeesatz-SemiBold'} ]}>Pour plus d'informations, visitez notre site web :</Text>
                                <View style={[ tw`flex-row justify-center` ]}>
                                    <Pressable onPress={() => openUrl('https://utechaway.com')}>
                                        <Text style={[ tw`text-blue-400 text-center border-b`, {color: CodeColor.code1, borderBottomColor: CodeColor.code1} ]}>utechaway.com</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View> */}

                    <View style={[ tw`py-4 px-5` ]}>
                        {/* <View style={[ tw`mb-5` ]}>
                            <Text style={[tw`text-center text-white font-bold mb-3`]}>Utechaway</Text>
                            <Text style={[tw`text-center text-slate-100`]}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta fugiat libero est dolor in sed saepe adipisci magnam et nam tenetur sunt suscipit explicabo iste ut placeat necessitatibus, magni nulla!</Text>
                        </View>
                        <View style={[ tw`mb-5` ]}>
                            <Text style={[tw`text-center text-white font-bold mb-3`]}>Contacts</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                <Text style={[tw`text-center text-slate-100`]}>XX-XX-XX-XX</Text>
                                <Text style={[tw`text-center text-slate-100`]}>XX-XX-XX-XX</Text>
                            </View>
                        </View> */}
                        <Copyright containerStyle={tw`px-0 py-0 mb-2`} textStyle={tw``} />
                    </View>
                </View>
            </ScrollView>
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

export default HomeView;