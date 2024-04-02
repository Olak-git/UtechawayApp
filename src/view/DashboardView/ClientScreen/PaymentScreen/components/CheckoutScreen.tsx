import { View, Text, Button, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StripeProvider, usePaymentSheet, useStripe } from '@stripe/stripe-react-native';
import InputForm2 from '../../../../../components/InputForm2';
import { CodeColor } from '../../../../../assets/style';
import { Button as ButtonRNP, TextInput } from 'react-native-paper';
import Base from '../../../../../components/Base';
import  { default as HeaderP } from '../../../../../components/Header';
import { componentPaddingHeader, fetchUri, getCurrency, host, toast } from '../../../../../functions/functions';
import { DashboardHeaderSimple } from '../../../../../components/DashboardHeaderSimple';
import { Divider, Icon } from '@rneui/base';
import tw from 'twrnc';
import { Divider as DividerRNP } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { refreshFacture, refreshHistoriqueFactures, refreshHomeData } from '../../../../../feature/refresh.slice';
import { ModalValidationForm } from '../../../../../components/ModalValidationForm';
import '../../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const CheckoutScreen: React.FC<{navigation: any, route: any}> = ({navigation, route}) => {
    const { t } = useTranslation();

    const API_URL = 'https://mobile.utechaway.com/stripe-server/index.php';

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const { facture, param } = route.params;

    const [ready, setReady] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
    const [key, setKey] = useState(param.pk_live);

    const [reste, setReste] = useState(facture.reste);

    const [visible, setVisible] = useState(false);

    const [inputs, setInputs] = useState({
        name: '',
        amount: '0'
    })

    const [errors, setErrors] = useState({
        name: null,
        amount: null
    })

    const handleOnChange = (input: string, text: any) => {
        setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, errorMessage: any) => {
        setErrors(prevState => ({...prevState, [input]: errorMessage}))
    }

    const savePayment = (): void => {
        setVisible(true)
        const formData = new FormData()
        formData.append('js', null)
        formData.append('payment[mode]', 'stripe')
        formData.append('payment[facture]', facture.slug)
        formData.append('payment[transaction-status]', 'succeeded')
        formData.append('payment[montant]', inputs.amount)
        formData.append('token', user.slug)
        console.log('FormData: ', formData)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => response.json())
        .then(async json => {
            if(json.success) {
                handleOnChange('amount', '0')
                await dispatch(refreshFacture());
                await dispatch(refreshHistoriqueFactures());
                setVisible(false)
            } else {
                console.log('Errors: ', json.errors);
                // toast('error', json.errors);
                setVisible(false)
            }
        })
        .catch(e => {
            console.warn('CheckoutScreen Error1: ', e)
            setVisible(false)
        })
    }

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`${host}/stripe-server/index.php`, {
            method: 'POST',
            body: JSON.stringify({
                amount: inputs.amount
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const { paymentIntent, ephemeralKey, customer, publishableKey } = data;

        if(!response.ok) return Alert.alert(data.message);

        setKey(publishableKey);

        return {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey
        };
    };
      
    const initializePaymentSheet = async () => {
        // @ts-ignore
        const { paymentIntent, ephemeralKey, customer, publishableKey } = await fetchPaymentSheetParams();

        const {error} = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: 'Example Inc.',
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            returnURL: 'stripe-example://stripe-redirect',
            // applePay: {
            //     merchantCountryCode: 'US'
            // },
            // googlePay: {
            //     merchantCountryCode: 'US',
            //     testEnv: true,
            //     currencyCode: 'usd'
            // }
        });
        if(error) {
            toast('error', error.message, `Error code ${error.code}`, true)
            // Alert.alert(`Error code ${error.code}`, error.message);
        } else {
            setReady(true);
        }
    };

    const openPaymentSheet = async () => {
        setDisabled(false);
        const data = await presentPaymentSheet();
        console.log('Data: ', data);
        const {error} = data;
        if (error) {
            toast('error', error.message, `Error code ${error.code}`, true)
            // Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            savePayment();
            Alert.alert('Succès', `${t('payment_screen.transaction_done')}`);
            setReste(reste-parseFloat(inputs.amount));
        }
    };

    const onHandle = (): void => {
        let valide = true;
        if(!inputs.amount) {
            valide = false;
            toast('error', t('payment_screen.msg_err_indicate_amount_paid'))
        } else if(parseFloat(inputs.amount) > reste) {
            valide = false;
            toast('error', t('payment_screen.msg_err_amount_paid_comp'))
        } else if(parseFloat(inputs.amount) < 1) {
            valide = false;
            toast('error', t('payment_screen.msg_err_amount_paid_greater'))
        } else {
            handleError('amount', null);
        }

        if(valide) {
            setDisabled(true);
            initializePaymentSheet();
        }
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
        }
    }, [user])

    useEffect(() => {
        dispatch(refreshHistoriqueFactures());
        if(ready) {
            openPaymentSheet();
        }
    }, [ready])
      
    return (
        <Base>
            <ModalValidationForm showM={visible} />
            <HeaderP
                elevated={true}
                backgroundColor={CodeColor.code1}
                containerStyle={{ paddingTop: componentPaddingHeader }}
                leftComponent={
                    <DashboardHeaderSimple navigation={navigation} title={`${t('payment_screen.title_screen')}`} />
                }
            />
            <View style={tw`flex-1 px-3 pt-4`}>
                {/* @ts-ignore */}
                <StripeProvider 
                    publishableKey={key} 
                    merchantIdentifier='merchant.com.utechaway'
                    threeDSecureParams={{
                        backgroundColor: "#FFF",
                        timeout: 5,
                        navigationBar: {
                            statusBarColor: CodeColor.code1
                        }
                    }}
                    
                >
                    <Icon type='material-community' name='cards' size={100} color='#000' />
                    <Text style={tw`text-center text-black font-bold text-lg`}>{t('payment_screen.total_to_pay')}: {getCurrency(reste)}€</Text>

                    <Divider width={1} style={tw`my-5 mx-16`} />
                    <TextInput 
                        keyboardType='numeric'
                        label={`${t('payment_screen.amount_required')}`}
                        value={inputs.amount}
                        error={errors.amount ? true : false}
                        // mode='outlined'
                        // outlineColor='#F4F4F4'
                        // underlineColor='#ccc'
                        onChangeText={(text: string) => handleOnChange('amount', text)}
                    />

                    <Divider width={1} style={tw`my-6 mx-16`} />

                    <ButtonRNP
                        mode='contained' 
                        color='black'
                        disabled={disabled} 
                        loading={disabled} 
                        collapsable
                        onPress={onHandle}
                        contentStyle={{height: 60}}
                    >{t('payment_screen.pay')}</ButtonRNP>

                </StripeProvider>

            </View>
        </Base>
    );
}

export default CheckoutScreen;