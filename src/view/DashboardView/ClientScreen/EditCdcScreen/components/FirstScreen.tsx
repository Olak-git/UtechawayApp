import React from "react";
import { View, Text, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import InputForm from "../../../../../components/InputForm";
import TextareaForm from "../../../../../components/TextareaForm";
import tw from 'twrnc';

import { Platform } from "react-native";
import { ColorsPers } from "../../../../../components/Styles";
import InputForm2 from "../../../../../components/InputForm2";
import { windowWidth } from "../../../../../functions/functions";
import TextareaForm2 from "../../../../../components/TextareaForm2";

import '../../../../../data/i18n';
import { useTranslation } from "react-i18next";


interface FirstScreenProps {
    inputs: any,
    errors: any,
    handleOnChange: any,
    setPrepareRecognation: any
}
export const FirstScreen: React.FC<FirstScreenProps> = ({inputs={}, errors={}, handleOnChange=()=>{}, setPrepareRecognation=()=>{}}) => {

    const { t } = useTranslation();

    const onHandleRecognation = async () => {
        await setPrepareRecognation(true)
    }

    return (
        <View style={[tw``, { width: windowWidth }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-2 py-2`}>
                <InputForm2
                    placeholder={`${t('specification_edition_screen.name')}`}
                    label={`${t('specification_edition_screen.project')}`}
                    helper={`${t('specification_edition_screen.project_name_change')}`}
                    value={inputs.nom}
                    error={errors.nom}
                    onChangeText={(text: string) => handleOnChange('nom', text)}
                />
                <TextareaForm2
                    placeholder={`${t('specification_edition_screen.description')}`}
                    label={`${t('specification_edition_screen.description')}*`}
                    helper={`${t('specification_edition_screen.msg_description_necessary')}`}
                    value={inputs.description}
                    error={errors.description}
                    onChangeText={(text: string) => handleOnChange('description', text)}
                />
                <TextareaForm2
                    placeholder={`${t('specification_edition_screen.existing')}`}
                    label={`${t('specification_edition_screen.existing_app')}`}
                    helper={`${t('specification_edition_screen.helper_existing_text')}`}
                    value={inputs.existant}
                    error={errors.existant}
                    onChangeText={(text: string) => handleOnChange('existant', text)}
                />
                <TextareaForm2
                    placeholder={`${t('specification_edition_screen.features')}`}
                    label={`${t('specification_edition_screen.the_features')}*`}
                    helper={`${t('specification_edition_screen.msg_indicate_feature')}`}
                    value={inputs.fonctionnalite}
                    error={errors.fonctionnalite}
                    onChangeText={(text: string) => handleOnChange('fonctionnalite', text)}
                />
            </ScrollView>
        </View>
    )
}