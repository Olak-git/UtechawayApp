import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import GoogleKey from '../../data/oauth/google.json';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { IconButton } from 'react-native-paper';
import { account, baseUri, fetchUri, toast } from '../../functions/functions';
import { clone } from '../../functions/helperFunction';
import { useDispatch } from 'react-redux';
import { setStopped } from '../../feature/init.slice';
import { setUser as setReduxUser } from '../../feature/user.slice';
import { useNavigation } from '@react-navigation/native';

interface RNGoogleSigninButtonProps {
    setUser: (a: any) => void,
    signin: string,
    setShowValidationModal: (a: boolean) => any,
}
const RNGoogleSigninButton: React.FC<RNGoogleSigninButtonProps> = ({ setUser, signin, setShowValidationModal }) => {
    const dispatch = useDispatch();

    const navigation = useNavigation();

    const [isSign, setIsSign] = useState(false)
    
    const gsi = () => {
        GoogleSignin.configure({
            // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId:  GoogleKey.web.client_id,
            offlineAccess: true,
            // @ts-ignore
            forceCodeForRefreshToken: true,
        });
        isSignedIn();
    }

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn()
            console.log('due___', userInfo)
            const { user } = userInfo

            handleCallback(user)

            const _user = {
                "email": "olakami.ulerich.bonou@gmail.com", 
                "familyName": "BONOU", 
                "givenName": "Olakami ulerich", 
                "id": "101998382505985564108", // google_uid
                "name": "Olakami ulerich BONOU", 
                "photo": "https://lh3.googleusercontent.com/a/AGNmyxZtVxgrRqOCXyXEfoUhQckxDd2CC8yTlKxsq5fK=s96-c"
            }
        } catch(error: any) {
            console.log('Message___', error.message)
            if(error.code == statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Canceled the Login Flow')
            } else if(error.code == statusCodes.IN_PROGRESS) {
                console.log('Signin In')
            } else if(error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available.')
            } else {
                console.log('Some other Error Happened')
            }
            if(isSign) {
                signOut();
            }
        }
    }

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if(isSignedIn) {
            getCurrentUserInfo();
        } else {
            console.log('Please Login')
            setIsSign(false)
        }
    }

    const getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            console.log('user_info___', userInfo)
            setUser(userInfo)
            setIsSign(true)
        } catch(error: any) {
            setIsSign(false)
            if(error.code == statusCodes.SIGN_IN_REQUIRED) {
                console.log('User has not signed in yest')
            } else {
                console.log('Something went wrong.')
            }
        }
    }

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut()
            setUser({})
            setIsSign(false)
        } catch(error) {
            console.log(error)
        }
    }

    const handleCallback = (userInfo: any) => {
        setShowValidationModal(true)
        const formData = new FormData();
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('google_uid', userInfo.id)
        formData.append('signin', signin)
        formData.append('email', userInfo.email)
        formData.append('type_user', account)
        fetch(fetchUri, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(!response.ok) {
                setShowValidationModal(false)
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json()
        })
        .then(jsn => {
            console.log('responseData___ ===> ', jsn)
            const { text: responseText, user } = jsn.status
            setShowValidationModal(false)
            if(responseText == 'success') {
                // setUser(userInfo)
                if(signin == 'oui') {
                    const _user = {...user};
                    let image = _user.image;
                    const data = clone(_user);
                    if(data.image) {
                        data.image = `${baseUri}/assets/avatars/${image}`;
                    }
                    if(data.valide == 1) {
                        dispatch(setStopped(false))
                        dispatch(setReduxUser({...data}));
                    }
                } else {
                    const _user = {nom: userInfo.familyName, prenom: userInfo.givenName, email: userInfo.email, picture: userInfo.photo, oauth: 'google_uid', uid: userInfo.id}
                    setUser(_user)
                    // @ts-ignore
                    navigation.navigate('SignUpOauth', {user_info: _user})
                }
            }  else if('not-exists' == responseText) {
                toast('error', 'Oups!!! Unidentified account. Please create an account on our platform.');
            } else if('echec' == responseText) {
                toast('error', 'Oups!!! Unidentified account. Please create an account on our platform.', 'Unidentified error.');
            } else if('account-exists' == responseText) {
                toast('error', 'An account already exists with these credentials. Please wait a moment and start the authentication process again with another account.');
            } else {
                toast('error', 'Unidentified error.')
            }
            signOut();
        })
        .catch(e => {
            signOut();
            setShowValidationModal(false)
            console.log('Errors: ', e)
        })
    }

    useEffect(() => {
        gsi()
    }, [])

    return (
        <IconButton 
            icon='google' 
            color='red' 
            size={30} 
            onPress={signIn} 
            animated={true} 
        />
    )
}

export default RNGoogleSigninButton