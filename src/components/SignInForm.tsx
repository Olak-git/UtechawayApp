import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Form, FormItem, Modal, Picker } from 'react-native-form-component';
import InputForm from './InputForm';
import { CheckBox } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import SelectPicker, { SelectPickerItem } from 'react-native-form-select-picker';
import { ColorsPers } from './Styles';
import IconSocial from './IconSocial';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUri } from '../functions/functions';
import { useDispatch } from 'react-redux';
import { setData } from '../feature/user.slice';

interface SignInFormProps {
    user?: string,
    navigation?: any,
    route?: any,
    setShowModal?: any,
    onSubmit?: any
}

const SignInForm: React.FC<SignInFormProps> = (props) => {

    const [optionSelected, setOptionSelected] = useState()

    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        isChecked: false
    })

    const dispatch = useDispatch();

    const [errors, setErrors] = useState({
        email: null,
        password: null
    })

    const {navigation, route, user, setShowModal, onSubmit = () => {}} = props

    const handleOnChange = (text: any, input: string) => {
        setInputs(prevState => ({...prevState, [input]: text}))
    }

    // const handleError = (text: any, input: string) => {
    //     setErrors(prevState => ({...prevState, [input]: text}))
    // }

    // const goDashboard = () => {
    //     if(route.params.user == 'client') {
    //         navigation.navigate('DashboadClientHome')
    //     } else if(route.params.user == 'collaborateur') {
    //         // navigation.navigate('DashboadCollaborateurHome')
    //     }
    // }

    // const onSubmit = async () => {
    //     setShowModal(true)
    //     // let valid = true
    //     // if(!inputs.email) {
    //     //     valid = false
    //     //     handleError('Est requis', 'email')
    //     // }
    //     // if(inputs.password) {
    //     //     valid = false
    //     //     handleError('Est requis', 'password')
    //     // }
    //     // if(valid) {
    //     //     const formData = new FormData()
    //     //     formData.append('js', null)
    //     //     formData.append('csrf', null)
    //     //     formData.append(route.params.user + '_signin[nom]', inputs.email)
    //     //     formData.append(route.params.user + '_signin[nom]', inputs.password)
    //     //     fetch(fetchUri, {
    //     //         method: 'POST',
    //     //         headers: {},
    //     //         body: formData
    //     //     })
    //     //     .then(response => response.json())
    //     //     .then(async json => {
    //     //         if(json.success) {
    //     //             if(inputs.isChecked) {
    //     //                 console.log('check')
    //     //                 dispatch(setData(json.user))
    //     //                 goDashboard()
    //     //             } else {
    //     //                 dispatch(setData(null))
    //     //                 await AsyncStorage.setItem('user', JSON.stringify({data: json.user}))
    //     //                 goDashboard()
    //     //             }
    //     //         } else {
    //     //             const errors = json.errors
    //     //             if(errors.email) {
    //     //                 handleError('email', errors.email)
    //     //             }
    //     //             if(errors.password) {
    //     //                 handleError('password', errors.password)
    //     //             }
    //     //         }
    //     //     })
    //     // }

    //     // if(user || route.params.user == 'client') {
    //     //     await AsyncStorage.setItem('user', 'Yes')
    //     //     navigation.navigate('DashboadClientHome')
    //     // } else if(route.params.user == 'collaborateur') {
    //     //     console.warn('Un collaborateur connecté')
    //     // }
    // }

    const optionss = [
        {label: 'Apple', value: 'apple', key: 451},
        {label: 'Banana', value: 'banana', key: 642},
        {label: 'Orange', value: 'orange', key: 361}
    ];

    useEffect(() => {
        setShowModal(true)
    })

    return (
        <>
            <InputForm
                placeholder='Email'
                keyboardType='email-address'
                onChangeText={(text: string) => handleOnChange(text, 'email')}
                error={errors.email} />
            <InputForm
                placeholder='Mot de passe'
                password={true}
                onChangeText={(text: string) => handleOnChange(text, 'password')}
                error={errors.password} />

            <CheckBox
                containerStyle={[ tw`mb-5 mt-0 py-0`, { backgroundColor: 'transparent', paddingHorizontal: 0, marginLeft: -1 }]}
                wrapperStyle={{ paddingHorizontal: 0 }}
                checked={inputs.isChecked}
                uncheckedColor='#ffffff'
                right={false}
                checkedColor='green'
                onPress={(v) => setInputs((prevState) => ({...prevState, isChecked: !prevState.isChecked}))}
                title={<Text style={[ tw`font-bold text-white` ]}>Garder ma session ouverte</Text>} />

            <Pressable 
                onPress={() => onSubmit()}
                style={[ tw`mb-4`, {backgroundColor: ColorsPers.palette_1, borderRadius: 7, height: 50, justifyContent: 'center'} ]}>
                <Text style={[ tw`text-white text-center text-lg` ]}>Connexion</Text>
            </Pressable>

            <Text style={[ tw`text-white text-center mb-2` ]}>
                En continuant votre navigation, vous acceptez nos <Text style={[ {color: Colors.dark} ]}>Conditions d'utilisation</Text> et notre <Text style={[ {color: Colors.dark} ]}>Politique de confidentialité</Text>.
            </Text>

            <View style={[ tw`flex-row flex-wrap justify-between`, {} ]}>
                <IconSocial
                    iconName='facebook'
                    iconColor='#3b5998'
                    onPress={() => console.log('Pannli')} />
                <IconSocial
                    iconName='linkedin'
                    iconColor='#0072b1' />
                <IconSocial
                    iconName='google'
                    iconColor='red' />
            </View>
        </>
    )
}

export default SignInForm;