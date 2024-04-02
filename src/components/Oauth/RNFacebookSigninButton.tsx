import { View, Text } from 'react-native'
import React from 'react'
import { IconButton } from 'react-native-paper'

interface RNFacebookSigninButtonProps {
    setUser: (a: any) => void,
    signin: string,
    setShowValidationModal: (a: boolean) => any
}
const RNFacebookSigninButton: React.FC<RNFacebookSigninButtonProps> = ({ setUser, signin, setShowValidationModal }) => {
    const signIn = () => {
    }

    return (
        <IconButton 
            icon='facebook' 
            color='#3b5998' 
            size={35} 
            onPress={signIn} 
            animated={true}
        />
    )
}

export default RNFacebookSigninButton