import { CardField, StripeProvider, usePaymentSheet, useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';
import InputForm2 from '../../../../components/InputForm2';
import { host } from '../../../../functions/functions';
import CheckoutScreen from './components/CheckoutScreen';
import '../../../../data/i18n';
import { useTranslation } from 'react-i18next';


interface PaymentScreenProps {
    navigation?: any,
    route?: any
}
const PaymentScreen: React.FC<PaymentScreenProps> = ({navigation, route}) => {
    const { t } = useTranslation();
    
    const handle = () => {
        fetch(`${host}/stripe-server/index.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                test: 'abcd123',
                customer: 'cus_123',
                payment_method: 'pm_card_visa',
                address: {
                    line1: '123 Main St'
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            // stripe = Stripe(data.key);
            console.log('Success: ', data)
        })
        .catch(err => {
            console.error('Error: ', err)
        })
    }
    
    return (
        // <Button mode='contained' onPress={handle}>Click Moi!</Button>
        <CheckoutScreen navigation={navigation} route={route} />
    )
}

const styles = StyleSheet.create({

});

export default PaymentScreen;