import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
import { Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TextareaFormProps {
    label?: string, 
    labelStyle?: any,
    error?: any, 
    onFocus?: any,
    onChangeText?: any,
    keyboardType?: any,
    placeholder?: string,
    formColor?: string,
    numberOfLines?: number,
    className?: string,
    helper?: string
}

const TextareaForm: React.FC<TextareaFormProps> = ({ label, labelStyle = {}, error, onFocus=()=>{}, formColor = '#ffffff', className = '', helper, ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

    return (
        <View style={[ tw`mb-6 ${className}` ]}>
            {label && (
                <Text style={[ styles.label, labelStyle ]}>{label}</Text>
            )}
            <View style={[ tw`border`, styles.inputContainer, { borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor } ]}>
                <TextInput 
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={'#cccccc'}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onFocus={() => {
                        onFocus()
                        setIsFocused(true)
                    }}
                    onBlur={() => setIsFocused(false)}
                    style={[ tw`flex-1 border-0 text-slate-500`, {textAlignVertical: 'top', justifyContent: 'flex-start'}]}
                    {...props} />
            </View>
            { helper && (
                // <Text style={[ tw`text-base text-slate-500 font-100` ]}>{ helper }</Text>
                <Text style={[ tw`` ]}>{ helper }</Text>
            )}
            { error && (
                <Text style={[ tw`text-orange-700 text-sm` ]}>{ error }</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 14,
        color: Colors.dark
    },
    inputContainer: {
        // height: 50,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 6,
        // borderWidth: 0.5
    }
})

export default TextareaForm;