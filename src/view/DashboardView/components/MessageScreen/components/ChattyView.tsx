import React, { useState } from 'react'
import { View, Text, Button, Image } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { msgs } from '../../../../../data';
import { ChatScreen } from 'react-native-easy-chat-ui'
import '../../../../../data/i18n';

interface ChattyViewProps {
}
const ChattyView: React.FC<ChattyViewProps> = () => {
  const [messages, setMessages] = useState<any>(msgs);

  const sendMessage = (type: any, content: string, isInverted: boolean) => {
    console.log(type, content, isInverted, 'msg')
  }

  return (
    <ChatScreen 
      messageList={messages} 
      lastReadAt={new Date()} 
      inverted={false} 
      sendMessage={sendMessage} 
      androidHeaderHeight={70}



      placeholder='Message...'
      useVoice={false}
      // @ts-ignore
      leftMessageTextStyle={{color: '#000'}}
      rightMessageTextStyle={{color: '#000'}}
      // requestAndroidPermission
    />
  )
}

export default ChattyView;