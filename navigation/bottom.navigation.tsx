/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home.screen';
import { Platform } from 'react-native';
import { Size } from '../utils/size';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenContainer from '../components/utils/screenContainer';
import Header from '../components/utils/header';
import ReportScreen from '@/screens/ReportScreen';
import PunchScreen from '@/screens/PunchScreen';
import SynchroScreen from '@/screens/synchro.screen';
import NotificationScreen from '@/screens/NotificationScreen';

const Tab = createBottomTabNavigator();
export default function BottomNavigation({ route }: any) {
  const insets = useSafeAreaInsets();
  const { userEmail } = route.params; 
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {},
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          height: Size(Platform.OS == 'android' || insets.bottom == 0 ? 60 : 52) + insets.bottom,
        },
        tabBarLabelPosition: 'below-icon',
        header: (props: any) => <Header {...props} />,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={ScreenContainer(HomeScreen)}
        options={{
          tabBarLabel: 'home',
          tabBarIcon(props: any) {
            return <TabIcon {...props} icon="home" />;
          },
        }}
      />
      <Tab.Screen
        name="Report"
        component={ScreenContainer(ReportScreen)}
        initialParams={{ userEmail }} 
        options={{
          tabBarLabel: 'Report',
          tabBarIcon(props: any) {
            return <TabIcon {...props} icon="summarize" />;
          },
        }}
      />
      <Tab.Screen
        name="Punch"
        component={ScreenContainer(PunchScreen)}
        initialParams={{ userEmail }} 

        options={{
          tabBarLabel: 'Punch',
          tabBarIcon(props: any) {
            return <TabIcon {...props} icon="fingerprint" />;
          },
        }}
      />
      <Tab.Screen
        name="Synchro"
        component={ScreenContainer(SynchroScreen)}
        options={{
          tabBarLabel: 'Synchro',
          tabBarIcon(props: any) {
            return <TabIcon icon="cloud-sync" {...props} />;
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={ScreenContainer(NotificationScreen)}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon(props: any) {
            return <TabIcon icon="notifications" {...props} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
function TabIcon(props: any) {
  return (
    <MatIcon
      size={Size(26)}
      name={props.focused ? props.activeIcon || props.icon : props.inactiveIcon || props.icon}
      color={props.focused ? props.activeColor || props.color : props.inactiveColor || props.color}
    />
  );
}
BottomNavigation.route = 'bottom';
