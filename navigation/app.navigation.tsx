import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/signin.screen';
import SignUpScreen from '../screens/signup.screen';
import HomeScreen from '../screens/home.screen';
import PunchScreen from '../screens/PunchScreen';
import ReportScreen from '../screens/ReportScreen';
import NotificationScreen from '../screens/NotificationScreen';
import LocationScreen from '../screens/LocationScreen';
import BottomNavigation from './bottom.navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SynchroScreen from '@/screens/synchro.screen';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  Punch: { userEmail: string };
  Report: { userEmail: string };
  Location: undefined;
  BottomNavigation: { userEmail: string };
  Synchro : undefined;
  Notifications : undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
<NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" >
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Punch" component={PunchScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Synchro" component={SynchroScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
