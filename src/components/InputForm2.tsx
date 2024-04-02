import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Keyboard, StyleProp, ViewStyle, TextStyle, KeyboardType, KeyboardTypeOptions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import tw from 'twrnc';
// import { Text } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputForm2Props {
    label?: string, 
    labelStyle?: StyleProp<TextStyle>,
    iconName?: string,
    leftComponent?: React.ReactElement,
    error?: null|string, 
    password?: boolean, 
    onFocus?: any,
    onBlur?: any,
    formColor?: string,
    containerStyle?: StyleProp<ViewStyle>,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputParentStyle?:  StyleProp<ViewStyle>,
    inputStyle?: StyleProp<ViewStyle>,
    codeCountry?: string,
    codeCountryStyle?: StyleProp<TextStyle>,
    helper?: string,
    constructHelper?: React.ReactElement<{}>,
    helperStyle?: StyleProp<TextStyle>,
    errorStyle?: StyleProp<TextStyle>,
    rightContent?: undefined | React.ReactElement,
    onChangeText?: any,
    keyboardType?: KeyboardTypeOptions,
    placeholder?: string,
    placeholderTextColor?: string,
    multiline?: boolean,
    numberOfLines?: number,
    defaultValue?: string | undefined,
    value?: string | undefined,
    maxLength?: number,
    editable?: boolean,
}

const InputForm2: React.FC<InputForm2Props> = ({ label, labelStyle, iconName, leftComponent, error, password = false, onFocus=()=>{}, onBlur=() => {}, formColor = '#cccccc', containerStyle, inputContainerStyle, inputParentStyle, inputStyle, codeCountry, codeCountryStyle, helper, constructHelper, helperStyle, errorStyle, rightContent, placeholderTextColor = '#cccccc', ...props }) => {
    
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(password)

    return (
        <View style={[ tw`mb-6`, containerStyle ]}>
            {label && (
                <Text style={[ styles.label, labelStyle ]}>{label}</Text>
            )}
            <View style={[ tw`bg-white border px-3 rounded-md`, styles.inputContainer, { borderColor: error ? '#ff2222' : isFocused ? '#f4f4f4' : formColor }, inputContainerStyle ]}>
                {iconName 
                    ?
                    <Icon
                        style={[ tw`mr-2` ]}
                        name={iconName}
                        color={isFocused ? '#000' : '#cccccc'}
                        size={20} />
                    :
                    leftComponent
                }
                <View style={[ tw`flex-row items-center flex-1`, {height: '100%'}, inputParentStyle ]}>
                    {codeCountry && (
                        <Text style={[ tw`text-base text-black px-2`, codeCountryStyle ]}>{ codeCountry }</Text>
                    )}
                    <TextInput 
                        // keyboardType='url'
                        placeholderTextColor={placeholderTextColor}
                        autoCorrect={false}
                        // autoCapitalize='none'
                        onFocus={() => {
                            onFocus()
                            setIsFocused(true)
                        }}
                        onBlur={() => setIsFocused(false)}
                        style={[ tw`flex-1 border-0 text-slate-500`, {height: '100%'}, inputStyle]}
                        secureTextEntry={showPassword}
                        underlineColorAndroid="transparent"
                        {...props}
                        // onContentSizeChange={(contentSize) => console.log(contentSize.nativeEvent.contentSize.height)}
                        // maxFontSizeMultiplier
                        // onLayout={(event) => console.log(event.nativeEvent.layout.height)}
                    />
                </View>
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
            { helper
                ?
                <Text style={[tw`text-black`, helperStyle]}>{ helper }</Text>
                :
                constructHelper
            }
            {error && (
                <Text style={[ tw`text-orange-700 text-sm`, errorStyle ]}>{ error }</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 2,
        fontSize: 14,
        color: Colors.dark
    },
    inputContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 15,
        // borderBottomWidth: 1, 
    }
})

export default InputForm2;