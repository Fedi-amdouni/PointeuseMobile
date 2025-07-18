/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Header } from 'react-native/Libraries/NewAppScreen';
import HomeScreen from '../../../screens/home.screen';
import { Size } from '../../../utils/size';
import ScreenContainer from '../../utils/screenContainer';
import appColors from '../../../colors';
import VectorIcon from '../../utils/icon';
import WelcomeScreen from '../../../screens/welcome.screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
export default function BottomNavigation2() {
  const insets = useSafeAreaInsets();
  const tabArr = [
    {
      route: 'home',
      label: 'home',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      activeIcon: 'home',
      inactiveIcon: 'home',
      component: HomeScreen,
    },
    {
      route: 'like',
      label: 'like',
      activeIconFamily: 'Ionicons',
      inactiveIconFamily: 'Ionicons',
      activeIcon: 'heart',
      inactiveIcon: 'heart',
      component: WelcomeScreen,
    },

    {
      route: 'profil',
      activeIconFamily: 'Ionicons',
      inactiveIconFamily: 'Ionicons',
      label: 'profil',
      activeIcon: 'person',
      inactiveIcon: 'person',
      component: HomeScreen,
    },
    {
      route: 'orders',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      label: 'settings',
      activeIcon: 'menu',
      inactiveIcon: 'menu',
      component: HomeScreen,
    },
    {
      route: 'star',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      label: 'star',
      activeIcon: 'star',
      inactiveIcon: 'star',
      component: HomeScreen,
    },
  ];
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {},
        headerShown: false,
        tabBarStyle: {
          ...styles.tabbarStyle,
          height: Size(Platform.OS == 'android' || insets.bottom == 0 ? 70 : 52) + insets.bottom,
        },
        header: (props: React.JSX.IntrinsicAttributes) => <Header {...props} />,
        unmountOnBlur: true,
      }}
    >
      {tabArr.map(item => (
        <Tab.Screen
          options={{ tabBarButton: (props: any) => <TabButton {...props} item={item} /> }}
          key={item.route}
          name={item.route}
          component={ScreenContainer(item.component)}
        />
      ))}
    </Tab.Navigator>
  );
}

function TabButton(props: any) {
  const { onPress, item, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewref: any = useRef(null);
  const viewref1: any = useRef(null);
  const textref: any = useRef(null);
  const animate1 = { 0: { translateY: Size(9) }, 0.92: { translateY: Size(-40) }, 1: { translateY: Size(-30) } };
  const animate2 = { 0: { translateY: Size(-30) }, 1: { translateY: Size(9) } };
  const animate3 = { 0: { scale: 0 }, 0.3: { scale: 0.9 }, 0.5: { scale: 0.3 }, 0.8: { scale: 0.7 }, 1: { scale: 1 } };
  const animate4 = { 0: { scale: 1 }, 1: { scale: 0 } };
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (focused) {
      viewref?.current?.animate(animate1);
      viewref1?.current?.animate(animate3);
      textref?.current?.transitionTo({ scale: 1 });
    } else {
      viewref?.current?.animate(animate2);
      viewref1?.current?.animate(animate4);
      textref?.current?.transitionTo({ scale: 0 });
    }
  }, [focused]);
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.tabButton}>
      <Animatable.View
        style={{
          ...styles.tabButton,
          height: Size(Platform.OS == 'android' || insets.bottom == 0 ? 70 : 52) + insets.bottom,
        }}
        ref={viewref}
      >
        <View style={styles.tabbtn}>
          <Animatable.View
            ref={viewref1}
            style={{
              ...(StyleSheet.absoluteFill as any),
              backgroundColor: appColors.primary100,
              borderRadius: Size(25),
              margin: Size(2),
            }}
          />
          <VectorIcon
            family={focused ? item.activeIconFamily : item.inactiveIconFamily}
            color={focused ? 'white' : appColors.primary100}
            size={Size(26)}
            name={focused ? item.activeIcon : item.inactiveIcon}
          />
        </View>
        <Animatable.Text style={styles.label} ref={textref}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  tabbarStyle: {},
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Size(60),
  },
  tabbtn: {
    width: Size(50),
    height: Size(50),
    borderRadius: Size(25),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: Size(13), color: appColors.primary100, textAlign: 'center', fontFamily: 'Outfit-Medium' },
});
