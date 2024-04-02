import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { StripeProvider, CardField, usePaymentSheet, useStripe } from '@stripe/stripe-react-native'
import InputForm2 from '../../../../../components/InputForm2'
import { Button } from 'react-native-paper'
import tw from 'twrnc';
import '../../../../../data/i18n';

const Screen2 = () => {

    const [name, setName] = useState('');

    const stripe = useStripe();

    const [ready, setReady] = useState(true);

    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();

    const subscribe = async () => {
        try {
            // const response = await fetch('', {
            //     method: 'POST',
            //     body: '',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }                
            // })
            // const data = await response.json();
            // if(!response.ok) return Alert.alert(data.message);
            // const clientSecret = data.clientSecret;

            const clientSecret = 'lbjbkflhhsvqjhvlyvh';

            const initSheet = await stripe.initPaymentSheet({
                paymentIntentClientSecret: clientSecret
            })
            if(initSheet.error) {
                console.log(initSheet.error.message);
                return Alert.alert(initSheet.error.message);
            }
            const presentSheet = await stripe.presentPaymentSheet();
            // const presentSheet = await stripe.presentPaymentSheet({
            //     clientSecret: clientSecret
            // });
            if(presentSheet.error) {
                console.log(presentSheet.error.message);
                return Alert.alert(presentSheet.error.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Something went wrong, try again later!')
        }
    }

    const fetchPaymentSheetParams = async () => {
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const {paymentIntent, ephemeralKey, customer} = await response.json();
        
        return {
            paymentIntent, ephemeralKey, customer
        }
    }
    
    const buy = async () => {
        const {error} = await presentPaymentSheet();
        console.log(error);
        if(error) {
            Alert.alert(`Eror Code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'The payment was confirmed successfully');
            setReady(false);
        }
    }

    // merchantIdentifier='merchant.com.stripe.react.native' threeDSecureParams={{}}
    return (
        <View style={tw`flex-1 bg-white justify-center px-5`}>
            {/* @ts-ignore */}
            <StripeProvider publishableKey='pk'>
                <CardField
                    postalCodeEnabled={true}
                    placeholder={{
                        number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 30,
                    }}
                    onCardChange={(cardDetails) => {
                        console.log('cardDetails', cardDetails);
                    }}
                    onFocus={(focusedField) => {
                        console.log('focusField', focusedField);
                    }}
                />
                <InputForm2 
                    placeholder='Name'
                    value={name}
                    onChangeText={(text: string) => setName(text)} 
                />
                <TextInput
                    placeholder='Name'
                    value={name}
                    onChangeText={(text: string) => setName(text)}
                />
                <Button mode='outlined' onPress={subscribe} disabled={loading || !ready}>Subscribe - 25 INR</Button>
            </StripeProvider>
        </View>
    )
}

export default Screen2