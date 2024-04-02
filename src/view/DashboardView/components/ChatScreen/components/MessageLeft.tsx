import React, { useState } from 'react';
import { Pressable, View, Image } from 'react-native';
import { getRandomInt } from '../../../../../functions/functions';
import BottomDate from './BottomDate';
import Message from './Message';
import tw from 'twrnc';

interface MessageLeftProps {
    msg: any,
    onHandle: any,
    onHandleImage: any
}
const MessageLeft: React.FC<MessageLeftProps> = ({ msg, onHandle, onHandleImage }) => {

    const [showDate, setShowDate] = useState(false)
    var copie = false

    const onHandleComponent = () => {
        onHandle()
        copie = !showDate;
        setShowDate(copie)
    }

    return (
        <Pressable onPress={onHandleComponent}>
            <View key={ msg.slug + '' + getRandomInt(0, 99999999) } style={[ tw`mb-3 flex-col relative` ]}>
                <Image
                    style={[ tw`absolute`, {width: 20, height: 20, left: -10, top: -0, transform: [{ rotate: '-100deg' }]} ]}
                    source={require('../../../../../assets/images/left.png')} />
                <View style={[ tw`px-4 pt-2 pb-1 rounded-md bg-black`, {maxWidth: '80%', marginRight: 'auto', backgroundColor: 'rgb(20,52,100)'} ]}>
                    <Message onHandleImage={ onHandleImage } textDirection='text-left' message={ msg } />
                    <BottomDate className='text-left mt-1' date={ msg.dat } showDate={true} />
                </View>
                {/* <BottomDate className='text-left' date={ msg.dat } showDate={showDate} /> */}
            </View>
        </Pressable>
    )
}

export default MessageLeft;