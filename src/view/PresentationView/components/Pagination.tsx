import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LogBox } from 'react-native';
import { ColorsPers } from '../../../components/Styles';
import tw from'twrnc';
import { CodeColor } from '../../../assets/style';
import '../../../data/i18n';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    index: any,
    data: any,
    handleOnChange: any
}
const Pagination: React.FC<PaginationProps> = ({ index, data, handleOnChange = () => {} }) => {

    const { t } = useTranslation();

    useEffect(() => {
        // LogBox.ignoreLogs(['Require cycle']);
    }, [])

    return (
        <View style={ styles.container_dot }>
            {/* @ts-ignore */}
            { data.map((slide, idx) => (
                <View
                    key={ idx }
                    style={[ styles.tiret, {backgroundColor: index == idx ? CodeColor.code1 : '#eee'} ]} />
            )) }
            { index === data.length - 1 && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={ handleOnChange }
                    style={[ tw`rounded p-3 bg-cyan-700`, { position: 'absolute', right: 10, bottom: -15, backgroundColor: CodeColor.code1 }]}>
                    <Text style={ tw`text-white` }>{t('home_page.continue')}</Text>
                </TouchableOpacity>
            ) }
        </View>
    )
}

const styles = StyleSheet.create({
    container_dot: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 50
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginHorizontal: 3
    },
    tiret: {
        width: 30,
        height: 2,
        borderRadius: 100,
        marginHorizontal: 3
    }
})

export default Pagination;