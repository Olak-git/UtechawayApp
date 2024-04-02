import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LogBox, StyleProp, ViewStyle } from 'react-native';
import tw from'twrnc';
import { CodeColor } from '../../../../../assets/style';

import '../../../../../data/i18n';

interface PaginationProps {
    index: any,
    data: any,
    styleContainer?: StyleProp<ViewStyle>
}
const Pagination: React.FC<PaginationProps> = ({ index, data, styleContainer }) => {

    return (
        <View style={[tw`flex-row justify-center items-center`, styleContainer]}>
            {/* @ts-ignore */}
            {data.map((slide, idx) => (
                <View
                    key={idx.toString()}
                    style={[tw`flex-row justify-center`, styles.dot, {backgroundColor: index == idx ? CodeColor.code1 : '#eee'} ]} />
            )) }
        </View>
    )
}

const styles = StyleSheet.create({
    container_dot: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 100,
        marginHorizontal: 5
    },
    tiret: {
        width: 30,
        height: 2,
        borderRadius: 100,
        marginHorizontal: 3
    }
})

export default Pagination;