import React from 'react';
import { View, Pressable, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { CodeColor } from '../../../../../assets/style';
import { baseUri, downloadFile } from '../../../../../functions/functions';
import '../../../../../data/i18n';
import { useTranslation } from 'react-i18next';

const BTNS = [
    {
        routeName: 'DashboadClientServices',
        title: 'Simulateur de devis',
        translate_key: 'order_screen.quote_simulator'
    },
    {
        routeName: 'DashboadClientEditCdc',
        title: 'Editer un cahier de charge',
        translate_key: 'order_screen.edit_specification'
    },
    {
        routeName: 'DashboadClientUploadCdc',
        title: 'Uploader un cahier de charge',
        translate_key: 'order_screen.update_specification'
    }
];

interface TabItemOneProps {
    navigation: any,
    ref?: any
}

export const TabItemOne: React.FC<TabItemOneProps> = ({ navigation, ...props }) => {
    const { t } = useTranslation();

    // @ts-ignore
    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={.5}
            onPress={() => navigation.navigate(item.routeName, {})}
            style={[ tw`justify-center rounded-xl px-4 py-6 mb-6 `, {minHeight: 40, backgroundColor: CodeColor.code1} ]}
        >
            <Text style={[ tw`text-center text-white font-bold` ]}>{t(item.translate_key)}</Text>
        </TouchableOpacity>
    )

    return (
        <FlatList
            contentContainerStyle={[ tw`pt-5 pb-50 px-5` ]}
            data={ BTNS }
            keyExtractor={(item, index) => index.toString()} 
            renderItem={renderItem}
            horizontal={ false }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={true}
        />
    )
}