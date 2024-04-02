import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditCdcScreen from '../view/DashboardView/ClientScreen/EditCdcScreen/EditCdcScreen';
import FactureScreen from '../view/DashboardView/ClientScreen/FactureScreen/FactureScreen';
import HomeScreen from '../view/DashboardView/ClientScreen/HomeScreen/HomeScreen';

import ChatScreen from '../view/DashboardView/components/ChatScreen/ChatScreen';
import ParametreScreen from '../view/DashboardView/components/ParametreScreen/ParametreScreen';
import ParametresScreen from '../view/DashboardView/components/ParametresScreen/ParametresScreen';
import PanelScreen from '../view/DashboardView/components/PanelScreen/PanelScreen';
import PanelProfilScreen from '../view/DashboardView/components/PanelProfilScreen/PanelProfilScreen';
import PanelPasswordScreen from '../view/DashboardView/components/PanelPasswordScreen/PanelPasswordScreen';

import HomeView from '../view/HomeView/HomeView';
import SignInView from '../view/SignInView/SignInView';
import SignUpView from '../view/SignUpView/SignUpView';
import SignUpOauthView from '../view/SignUpOauthView/SignUpOauthView';
import PresentationView from '../view/PresentationView/PresentationView';

import { useSelector } from 'react-redux';
import ContratScreen from '../view/DashboardView/ClientScreen/ContratScreen/ContratScreen';
import UploadCdcScreen from '../view/DashboardView/ClientScreen/UploadCdcScreen/UploadCdcScreen';
// import ChatCallAudioScreen from '../view/DashboardView/components/ChatCallAudioScreen/ChatCallAudioScreen';
// import ChatCallVideoScreen from '../view/DashboardView/components/ChatCallVideoScreen/ChatCallVideoScreen';

import AideScreen from '../view/DashboardView/components/AideScreen/AideScreen';
import ServicesScreen from '../view/DashboardView/ClientScreen/ServicesScreen/ServicesScreen';
import SimulateDevisScreen from '../view/DashboardView/ClientScreen/SimulateDevisScreen/SimulateDevisScreen';
import CdcScreen from '../view/DashboardView/components/CdcScreen/CdcScreen';
import HistoriqueCdcScreen from '../view/DashboardView/components/HistoriqueCdcScreen/HistoriqueCdcScreen';
import PaymentScreen from '../view/DashboardView/ClientScreen/PaymentScreen/PaymentScreen';
import WelcomeView from '../view/WelcomeView/WelcomeView';
import MessageScreen from '../view/DashboardView/components/MessageScreen/MessageScreen';
import CallScreen from '../view/DashboardView/components/CallScreen/CallScreen';
import OtpView from '../view/OtpView/OtpView';
import ResetPasswordView from '../view/ResetPasswordView/ResetPasswordView';
import NotificationsView from '../view/DashboardView/components/NotificationsView/NotificationsView';
import DetailsNotificationView from '../view/DashboardView/components/DetailsNotificationView/DetailsNotificationView';
import VideoSdkLive from '../view/DashboardView/components/VideoSdkLive/VideoSdkLive';
import VideoLive from '../view/DashboardView/components/VideoLive/VideoLive';


const Stack = createNativeStackNavigator();

interface GenerateViewProps {

}
const GenerateView: React.FC<GenerateViewProps> = () => {

  const init = useSelector((state: any) => state.init);
    
  const {presentation, welcome} = init;

  const user = useSelector((state: any) => state.user.data);

    return (
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={!welcome ? 'Welcome' : (!presentation ? 'Presentation' : (Object.keys(user).length == 0 ? 'Home' : 'DashboadClientHome'))}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right'
            }}>

            {!welcome && (
              <Stack.Group>
                <Stack.Screen name='Welcome' component={WelcomeView} />
              </Stack.Group>
            )}

            { !presentation && (
              <Stack.Group>
                <Stack.Screen name='Presentation' component={PresentationView} />
              </Stack.Group>
            )}

            {Object.keys(user).length == 0
            ?
              <Stack.Group>
                <Stack.Screen name='Home' component={HomeView} />
                <Stack.Screen name='SignUp' component={SignUpView} />
                <Stack.Screen name='SignUpOauth' component={SignUpOauthView} />
                <Stack.Screen name='SignIn' component={SignInView} />
                <Stack.Screen name='ResetPassword' component={ResetPasswordView} />
                <Stack.Screen name='Otp' component={OtpView} />
              </Stack.Group>
            :
              <Stack.Group>
                <Stack.Screen name='DashboadClientHome' component={HomeScreen} />
                <Stack.Screen name='DashboadSettings' component={ParametresScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadSetting' component={ParametreScreen} />
                <Stack.Screen name='DashNotifications' component={NotificationsView} 
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashDetailsNotification' component={DetailsNotificationView} />
                <Stack.Screen name='DashboadAide' component={AideScreen} />
                <Stack.Screen name='DashboadPanel' component={PanelScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadPanelProfil' component={PanelProfilScreen} />
                <Stack.Screen name='DashboadPanelPassword' component={PanelPasswordScreen} />
                <Stack.Screen name='DashboadHistoriqueCdc' component={HistoriqueCdcScreen} />
                <Stack.Screen name='DashboadProjects' component={HistoriqueCdcScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadCdc' component={CdcScreen} />
                <Stack.Screen name='DashboadClientFacture' component={FactureScreen} />
                <Stack.Screen name='DashboadClientFacture2' component={FactureScreen} 
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadPayment' component={PaymentScreen}
                  options={{
                    animation: 'slide_from_bottom'
                  }}
                />
                
                <Stack.Screen name='DashboadChatScreen' component={ChatScreen} />
                <Stack.Screen name='DashboadVideoSdkLive' component={VideoLive} />
                {/* <Stack.Screen name='DashboadChatCallAudio' component={ChatCallAudioScreen} />
                <Stack.Screen name='DashboadChatCallVideo' component={ChatCallVideoScreen} /> */}

                <Stack.Screen name='DashboadClientContrat' component={ContratScreen} />
                <Stack.Screen name='DashboadClientContrat2' component={ContratScreen} 
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadClientEditCdc' component={EditCdcScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='EditCdc' component={EditCdcScreen} />

                <Stack.Screen name='DashboadClientUploadCdc' component={UploadCdcScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='UploadCdc' component={UploadCdcScreen} />

                <Stack.Screen name='DashboadClientServices' component={ServicesScreen}
                  options={{
                    animation: 'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadClientServiceDevis' component={SimulateDevisScreen}/>


                <Stack.Screen name='DashboadMessages' component={MessageScreen} />
                <Stack.Screen name='DashboadMessages2' component={MessageScreen} 
                  options={{
                    animation:'fade_from_bottom'
                  }}
                />
                <Stack.Screen name='DashboadCall' component={CallScreen}
                  options={{
                    animation:'slide_from_bottom'
                  }}
                />
              </Stack.Group>
            }

          </Stack.Navigator>
        </NavigationContainer>
    )
}

export default GenerateView;