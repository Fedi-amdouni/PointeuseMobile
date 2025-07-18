/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import HomeScreen from '../../../screens/home.screen';
import { Size } from '../../../utils/size';
import ScreenContainer from '../../utils/screenContainer';
import appColors from '../../../colors';
import VectorIcon from '../../utils/icon';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
const Tab = createBottomTabNavigator();
export default function BottomNavigation1() {
  const tabArr = [
    {
      route: 'home',
      label: 'home',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      activeIcon: 'home-circle',
      inactiveIcon: 'home',
      component: HomeScreen,
    },
    {
      route: 'like',
      label: 'like',
      activeIconFamily: 'Ionicons',
      inactiveIconFamily: 'Ionicons',
      activeIcon: 'heart-circle',
      inactiveIcon: 'heart',
      component: HomeScreen,
    },

    {
      route: 'profil',
      activeIconFamily: 'Ionicons',
      inactiveIconFamily: 'Ionicons',
      label: 'profil',
      activeIcon: 'person-circle',
      inactiveIcon: 'person',
      component: HomeScreen,
    },
    {
      route: 'settings',
      activeIconFamily: 'MaterialIcons',
      inactiveIconFamily: 'MaterialIcons',
      label: 'settings',
      activeIcon: 'settings-applications',
      inactiveIcon: 'settings',
      component: HomeScreen,
    },
    {
      route: 'orders',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      label: 'settings',
      activeIcon: 'microsoft-xbox-controller-menu',
      inactiveIcon: 'menu',
      component: HomeScreen,
    },
    {
      route: 'star',
      activeIconFamily: 'MaterialCommunityIcons',
      inactiveIconFamily: 'MaterialCommunityIcons',
      label: 'star',
      activeIcon: 'star-circle',
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
        tabBarItemStyle: { height: Size(60) },
        headerShown: false,
        tabBarStyle: styles.tabbarStyle,
        header: props => <Header {...props} />,
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
  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  const focused = accessibilityState.selected;
  useEffect(() => {
    if (focused) {
      scale.value = withTiming(1.5, { duration: 700 });
      rotate.value = withTiming('360deg', { duration: 700 });
    } else {
      scale.value = withTiming(1, { duration: 700 });
      rotate.value = withTiming('0deg', { duration: 700 });
    }
  }, [focused]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: rotate.value }],
    };
  });
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.tabButton}>
      <Animated.View style={[styles.tabButton, animatedStyle]}>
        <VectorIcon
          family={focused ? item.activeIconFamily : item.inactiveIconFamily}
          color={focused ? appColors.primary100 : appColors.textGrey70}
          size={Size(26)}
          name={focused ? item.activeIcon : item.inactiveIcon}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  tabbarStyle: {
    position: 'absolute',
    bottom: Size(16),
    left: Size(16),
    right: Size(16),
    height: Size(60),
    borderRadius: 16,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Size(60),
  },
});
