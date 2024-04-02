import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import RNGoogleSigninButton from './Oauth/RNGoogleSigninButton';
import tw from 'twrnc';
import RNFacebookSigninButton from './Oauth/RNFacebookSigninButton';
import RNLinkedInSigninButton from './Oauth/RNLinkedInSigninButton';
import { useNavigation } from '@react-navigation/native';

interface OAuthButtonProps {
    setUser: (a: any)=>void,
    signin: string,
    setShowValidationModal: (a: boolean) => any,
}
const OAuthButton: React.FC<OAuthButtonProps> = ({setUser, signin, setShowValidationModal}) => {
    return (
        <>
        <View style={tw`flex-row justify-center items-center border-0 border-red-500`}>
            {/* <RNFacebookSigninButton setUser={setUser} signin={signin} setShowValidationModal={setShowValidationModal} /> */}
            <RNGoogleSigninButton setUser={setUser} signin={signin} setShowValidationModal={setShowValidationModal} />
            <RNLinkedInSigninButton setUser={setUser} signin={signin}setShowValidationModal={setShowValidationModal} />
        </View>
        </>
    )
}

export default OAuthButton