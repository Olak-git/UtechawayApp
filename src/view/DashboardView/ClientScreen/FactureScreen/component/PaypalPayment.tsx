import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-form-component';
import Feather from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import { account, fetchUri, toast } from '../../../../../functions/functions';
import '../../../../../data/i18n';

interface PaypalPaymentProps {
    user: any,
    mnt: number,
    showGateway: boolean,
    setShowGateway: any,
    prog: boolean,
    setProg: any,
    progClr: string,
    setProgClr: any,
    setData: any
}
const PaypalPayment: React.FC<PaypalPaymentProps> = ({user={}, mnt, showGateway, setShowGateway=()=>{}, prog, setProg=()=>{}, progClr, setProgClr=()=>{}, setData}) => {

    const onMessage = (e: any) => {
        let response = e.nativeEvent.data;
        setShowGateway(false);
        if(response.status.toLowerCase() === 'completed') {
            toast('success', 'Transaction effectuée avec succès.', 'Notification', true);
            const formData = new FormData()
            formData.append('js', null)
            formData.append(`${account}_payment_facture`, null)
            formData.append('payment[transaction-status]', response.status)
            formData.append('payment[transaction-id]', response.id)
            // @ts-ignore
            formData.append('payment[facture]', factureSelected)
            // @ts-ignore
            formData.append('token', user.slug)
            fetch(fetchUri, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                if(json.success) {
                    setData((prevState: any) => ({ ...prevState, facture: json.facture, tranches: json.tranches, solde: json.solde }))
                } else {
                    console.warn(json.errors)
                }
            })
            .catch(e => console.warn(e))
        } else {
            toast('error', 'Transaction échouée.');
        }
    }
    
    return (
        <Modal
            // visible
            show={showGateway}
            onDismiss={() => setShowGateway(false)}
            onRequestClose={() => setShowGateway(false)}
            animationType={"fade"}
            transparent 
        >
            <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                    <TouchableOpacity
                        style={{ padding: 13 }}
                        onPress={() => setShowGateway(false)}>
                        <Feather 
                            name={'x'} 
                            color={ '#000000' } 
                            size={24} 
                        />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#00457C' }}>PayPal GateWay</Text>
                    <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                        <ActivityIndicator size={24} color={ progClr } />
                    </View>
                </View>
                <WebView
                    // @ts-ignore
                    source={{uri: `https://mobile.utechaway.com/my-paypal-web/index.html?token=${user.slug}&mnt=${mnt}`}}
                    style={{flex: 1}}
                    onMessage={onMessage}
                    onLoadStart={() => {
                        setProg(true);
                        setProgClr('#000');
                    }}
                    onLoadProgress={() => {
                        setProg(true);
                        setProgClr('#00457C');
                    }}
                    onLoadEnd={() => {
                        setProg(false);
                    }}
                    onLoad={() => {
                        setProg(false);
                    }}
                />
            </View>
        </Modal>
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
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
    btnCon: {
        height: 45,
        width: '70%',
        elevation: 1,
        backgroundColor: '#00457C',
        borderRadius: 3,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTxt: {
        color: '#fff',
        fontSize: 18,
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    }
})

export default PaypalPayment;