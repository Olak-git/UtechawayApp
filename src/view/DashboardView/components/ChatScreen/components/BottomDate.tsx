import React from 'react';
import { View, Text } from 'react-native';
import { formatFullDate, getHourOfDate } from '../../../../../functions/functions';
import tw from 'twrnc';

interface BottomDateProps {
    date: string,
    className: string,
    showDate: boolean
}
const BottomDate: React.FC<BottomDateProps> = ({ date, className, showDate = false }) => {
    return (
        <View style={{ opacity: showDate ? 1 : 0 }}>
            <Text style={[ tw`text-xs text-white ${className}`, {fontSize: 10} ]}>{ getHourOfDate(date) }</Text>
        </View>
    )
}

export default BottomDate;