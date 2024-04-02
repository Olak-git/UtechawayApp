import React from 'react';
import { Pressable, Image, Text } from 'react-native';
import { baseUri, requestPermissions } from '../../../../../functions/functions';
import tw from 'twrnc';

interface MessageProps {
    message: any,
    onHandleImage: any,
    textDirection: string
}
const Message: React.FC<MessageProps> = ({ message, onHandleImage, textDirection = 'text-left' }) => {

    const size = {
        width: 100,
        height: 100,
    }

    const getImageSource = () => {
        if(message.create)  {
            return { uri: message.fichier, ...size }
        } else {
            return { uri: baseUri + '/assets/files/message/' + message.fichier, ...size }
        }
    }

    return (
        <>
            { 
                message.fichier ? 
                    message.type_fichier.toLowerCase() == 'image' ? 
                        <Pressable
                            onPress={() => onHandleImage(getImageSource().uri)}
                        >
                            <Image
                                // resizeMethod='scale'
                                resizeMode='stretch'
                                style={[ { ...size} ]}
                                source={ getImageSource() }/>
                        </Pressable>
                        : message.type_fichier.toLowerCase() == 'doc' ? 
                            <Text onPress={() => requestPermissions(baseUri + '/assets/files/message/' + message.fichier, message.name_fichier) } style={[ tw`text-white` ]}>{ message.name_fichier }</Text> : null
                    : null
            }
            { 
                message.texte ? 
                    <Text style={[ tw`text-white ${ textDirection }` ]}>{ message.texte }</Text> : null
            }
        </>
    )
}

export default Message;