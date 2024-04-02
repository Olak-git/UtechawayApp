import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { openUrl } from '../functions/helperFunction';
import tw from 'twrnc';
import '../data/i18n';
import { useTranslation } from 'react-i18next';

interface TermesProps {
    style?: StyleProp<TextStyle>
}
const Termes: React.FC<TermesProps> = ({style}) => {
    const { t } = useTranslation();
    return (
        <Text style={[ tw`mb-2 text-white text-center`, style ]}>
            {t('sign_up_screen.check_privacy_policy1')} <Text onPress={() => openUrl('https://utechaway.com')} style={[tw`text-black underline`]}>{t('sign_up_screen.check_privacy_policy2')}</Text> {t('sign_up_screen.check_privacy_policy3')} <Text onPress={() => openUrl('https://utechaway.com')} style={[tw`text-black underline`]}>{t('sign_up_screen.check_privacy_policy4')}</Text>.
        </Text>
    )
}

export default Termes;