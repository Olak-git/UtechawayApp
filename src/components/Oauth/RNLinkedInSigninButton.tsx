import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import { IconButton } from 'react-native-paper'
import LinkedInKey from '../../data/oauth/linkedin.json';
import LinkedInModal from 'react-native-linkedin'
import { account, baseUri, fetchUri } from '../../functions/functions';
import { clone } from '../../functions/helperFunction';
import { toast } from '../../functions/functions';
import { useDispatch } from 'react-redux';
import { setStopped } from '../../feature/init.slice';
import { setUser as setReduxUser } from '../../feature/user.slice';
import { useNavigation } from '@react-navigation/native';

interface RNLinkedInSigninButtonProps {
    setUser: (a: any) => void,
    signin: string,
    setShowValidationModal: (a: boolean) => any,
}
const RNLinkedInSigninButton: React.FC<RNLinkedInSigninButtonProps> = ({ setUser, signin, setShowValidationModal }) => {
    const dispatch = useDispatch();

    const navigation = useNavigation();

    const linkedRef = useRef(null)

    // const nav = useNavigation()

    const openLikedInModal = () => {
        console.log('OPEN MODAL')
        // @ts-ignore
        linkedRef?.current?.open()
    }
    
    const signIn = () => {
    }
    const signOut = () => {
        
    }

    const getProfile = () => {
        const formData = new FormData()
        formData.append('js', null)
        formData.append('csrf', null)
        // formData.append(`${account}_signin[email]`, inputs.email)
        // formData.append(`${account}_signin[password]`, inputs.password)
        fetch(fetchUri, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        .then(async (json) => {
            // setShowModal(false)
            if(json.success) {
                const _user = json.user;
                let image = _user.image;
                const data = clone(_user);
                if(data.image) {
                    data.image = `${baseUri}/assets/avatars/${image}`;
                }
                if(data.valide == 1) {
                    // dispatch(setStopped(false))
                    // dispatch(setUser({...data}));
                } else {
                    // setAccountUser({...data})
                }
            } else {
                const errors = json.errors
                for(let k in errors) {
                    // handleError(errors[k], k);
                }
                console.log('Errors: ', errors)
            }
        })
        .catch(e => {
            // setShowModal(false)
            console.warn(e)
        })
    }

    const handleCallback = (userInfo: any) => {
        const formData = new FormData();
        formData.append('js', null)
        formData.append('csrf', null)
        formData.append('linkedin_uid', userInfo.sub)
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
            setShowValidationModal(false)
            console.log('responseData___ ===> ', jsn)
            const { text: responseText, user } = jsn.status
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
                    const _user = {nom: userInfo.family_name, prenom: userInfo.given_name, email: userInfo.email, picture: userInfo.picture, oauth: 'linkedin_uid', uid: userInfo.sub}
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
        })
        .catch(e => {
            console.log('Errors: ', e)
            setShowValidationModal(false)
        })
    }

    return (
        <>
            <LinkedInModal 
                ref={linkedRef}
                shouldGetAccessToken={true}
                clientSecret={LinkedInKey.client_secret}
                clientID={LinkedInKey.client_id}
                permissions={['r_liteprofile', 'openid', 'profile', 'email', 'r_emailaddress']}
                redirectUri={signin=='oui'?"https://my.utechaway.com/linkedin-signin-success.php":"https://my.utechaway.com/linkedin-signup-success.php"}
                linkText='Yakuzaaa'
                animationType='fade'
                renderButton={() => <IconButton 
                    icon='linkedin' 
                    color='#3b5998' 
                    size={35} 
                    onPress={openLikedInModal} 
                    animated={true}
                />}
                onClose={() => {
                    console.log('Window Close')
                }}
                onSuccess={
                    token => {
                        console.log('Token___: ', token)
                        let uri = 'https://api.linkedin.com/v2/me?oauth2_access_token='+token.access_token
                        let name_surname = 'https://api.linkedin.com/v2/me'
                        let uri_retreive_member_details = 'https://api.linkedin.com/v2/userinfo'

                        setShowValidationModal(true)

                        fetch(uri_retreive_member_details, {
                            method: 'GET',
                            headers: {
                                Authorization: 'Bearer ' + token.access_token
                            }
                        })
                        .then(response => {
                            if(!response.ok) {
                                setShowValidationModal(false)
                                throw new Error(`HTTP error, status = ${response.status}, message = ${JSON.stringify(response)}`);
                            }
                            return response.json()
                        })
                        .then(jsn => {
                            console.log('responseData___ ===> ', jsn)
                                const gh = {
                                    "email": "olakami.ulerich.bonou@gmail.com", 
                                    "email_verified": true, 
                                    "family_name": "Bonou", 
                                    "given_name": "Ulérich", 
                                    "locale": {"country": "FR", "language": "fr"}, 
                                    "name": "Ulérich Bonou", 
                                    "picture": "https://media.licdn.com/dms/image/D4E03AQFO3sik6E5slA/profile-displayphoto-shrink_100_100/0/1679657173707?e=1689206400&v=beta&t=J5BFwqC3D8_sDAV1-RCpF2SdklIwIBW_YG92dXnLnsY", 
                                    "sub": "SIj93CI6Vk" // linkedin_uid
                                }
                            handleCallback(jsn)
                        })
                        .catch(e => {
                            console.log('Errors: ', e)
                            setShowValidationModal(false)
                        })
                    }
                }
                onError={(error) => {
                    console.log('Error: ', error)
                }}
                onSignIn={() => {
                    console.log('Success Sign in')
                }}
            />

        </>
    )
}

export default RNLinkedInSigninButton