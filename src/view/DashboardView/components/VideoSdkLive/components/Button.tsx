import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

// Common Component which will also be used in Controls Component
const Button: React.FC<{onPress: any, buttonText: string, backgroundColor: string, btnStyle: any}> = ({ onPress, buttonText, backgroundColor, btnStyle }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...btnStyle,
                backgroundColor: backgroundColor,
                padding: 10,
                borderRadius: 8,
            }}
        >
            <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
        </TouchableOpacity>
    );
};

export default Button