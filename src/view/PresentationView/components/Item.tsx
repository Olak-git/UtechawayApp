import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View, LogBox } from 'react-native';
import tw from 'twrnc';
import { windowHeight, windowWidth } from '../../../functions/functions';
import '../../../data/i18n';
import { useTranslation } from 'react-i18next';


interface ItemProps {
    item: any
}
const Item: React.FC<ItemProps> = ({ item }) => {

    const { t } = useTranslation();

    useEffect(() => {
        // LogBox.ignoreLogs(['Require cycle']);
    }, [])
    return (
        <View style={ styles.container_item }>
            <View style={ styles.item }>
                <Image
                    style={ styles.item_image }
                    source={ item.item.image }
                    resizeMode='contain' />
                <Text style={[ tw`text-lg font-semibold text-center text-black`, styles.item_title ]}>{t(item.item.key_translate)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container_item: {
        width: windowWidth,
        height: windowHeight - 100,
        alignItems: 'center'
    },
    item: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    item_image: {
        height: '40%',
        width: '100%'
    },
    item_title: {
        lineHeight: 20
    }
})

export default Item;