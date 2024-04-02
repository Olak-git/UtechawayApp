import React, { useState } from 'react';
import { Pressable, View, Image } from 'react-native';
import { getRandomInt } from '../../../../../functions/functions';
import BottomDate from './BottomDate';
import Message from './Message';
import tw from 'twrnc';

interface MessageRightProps {
    msg: any,
    onHandle: any,
    onHandleImage: any
}
const MessageRight: React.FC<MessageRightProps> = ({ msg, onHandle, onHandleImage }) => {

    const [showDate, setShowDate] = useState(false)
    let copie = false

    const onHandleComponent = () => {
        onHandle()
        copie = !showDate;
        setShowDate(copie)
    }

    return (
        <Pressable onPress={onHandleComponent}>
            <View key={ msg.slug + '' + getRandomInt(0, 99999999) } style={[ tw`mb-3 flex-col relative` ]}>
                <Image
                    style={[ tw`absolute`, {width: 20, height: 20, right: -10, top: -0, transform: [{ rotate: '15deg' }]} ]}
                    source={require('../../../../../assets/images/right.png')} />
                <View style={[ tw`px-4 pt-2 pb-1 rounded-lg`, {maxWidth: '80%', marginLeft: 'auto', backgroundColor: '#2596be'} ]}>
                    <Message onHandleImage={ onHandleImage } textDirection='text-right' message={ msg } />
                    <BottomDate className='text-right mt-1' date={ msg.dat } showDate={true} />
                </View>
                {/* <BottomDate className='text-right' date={ msg.dat } showDate={showDate} /> */}
            </View>
        </Pressable>
    )
}

export default MessageRight;