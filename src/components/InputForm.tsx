import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
import { Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputFormProps {
    label?: string, 
    labelStyle?: any,
    iconName?: string, 
    error?: any, 
    password?: boolean, 
    onFocus?: any,
    formColor?: string,
    className?: string,
    helper?: string,
    rightContent?: any
    onChangeText?: any,
    /**
     * enum("default", 'numeric', 'email-address', "ascii-capable", 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad')
     */
    keyboardType?: any,
    placeholder?: string,
    multiline?: boolean,
    numberOfLines?: number,
    defaultValue?: string,
    editable?: boolean
}

const InputForm: React.FC<InputFormProps> = ({ label, labelStyle = {}, iconName, error, password = false, onFocus=()=>{}, formColor = '#ffffff', className = '', helper, rightContent, ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(password)

    return (
        <View style={[ tw`mb-6 ${className}` ]}>
            {label && (
                <Text style={[ styles.label, labelStyle ]}>{label}</Text>
            )}
            <View style={[ tw`border`, styles.inputContainer, { borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor } ]}>
                {iconName && (
                    <Icon
                        style={[ tw`mr-2` ]}
                        name={iconName}
                        color={isFocused ? '#000' : '#cccccc'}
                        size={20} />
                )}
                <TextInput 
                    // keyboardType='phone-pad'
                    placeholderTextColor={'#cccccc'}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onFocus={() => {
                        onFocus()
                        setIsFocused(true)
                    }}
                    onBlur={() => setIsFocused(false)}
                    style={[ tw`flex-1 border-0 text-slate-500`, {}]}
                    secureTextEntry={showPassword}
                    {...props} />
                {password && (
                    <Icon
                        style={[ tw`ml-1` ]}
                        name={showPassword ? 'eye-off' : 'eye'}
                        color={isFocused ? '#000' : '#cccccc'}
                        size={20}
                        onPress={() => setShowPassword(!showPassword)} />
                )}
                { rightContent }
            </View>
            { helper && (
                <Text>{ helper }</Text>
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
        height: 50,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 6,
        // borderWidth: 0.5
    }
})

export default InputForm;