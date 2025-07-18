/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/home.screen';
import ScreenContainer from '../components/utils/screenContainer';
import { Size } from '../utils/size';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/utils/header';

const Drawer = createDrawerNavigator();
export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawer}
      screenOptions={
        {
          drawerActiveTintColor: 'green',
          drawerInactiveTintColor: 'red',
          drawerActiveBackgroundColor: 'white',
          drawerInactiveBackgroundColor: 'white',
          drawerItemStyle: styles.drawerItemStyle,
          drawerStyle: styles.drawerStyle,
          drawerLabelStyle: styles.drawerLabelStyle,
          unmountOnBlur: true,
          header: (props: any) => <Header {...props} />,
          headerBackVisible: false,
        } as any
      }
    >
      <Drawer.Screen
        options={{
          title: 'Home',
          drawerIcon(props: any) {
            return <DrawerIcon {...props} icon="favorite-border" />;
          },
        }}
        name="Home"
        component={ScreenContainer(HomeScreen)}
      />
      <Drawer.Screen
        options={{
          title: 'Home1',
          drawerIcon(props: any) {
            return <DrawerIcon {...props} icon="person" />;
          },
        }}
        name="home1"
        component={ScreenContainer(HomeScreen)}
      />
      <Drawer.Screen
        options={{
          title: 'Home2',
          drawerIcon(props: any) {
            return <DrawerIcon {...props} icon="settings" />;
          },
        }}
        name="home2"
        component={ScreenContainer(HomeScreen)}
      />
    </Drawer.Navigator>
  );
}
function DrawerIcon(props: any) {
  return (
    <MatIcon
      size={Size(20)}
      name={props.focused ? props.activeIcon || props.icon : props.inactiveIcon || props.icon}
      color={props.focused ? props.activeColor || props.color : props.inactiveColor || props.color}
    />
  );
}
const CustomDrawer = (props: any) => {
  return (
    <SafeAreaView style={styles.containerStyle}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* top content here*/}
        <View style={styles.itemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      {/* top content here*/}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
  drawerStyle: {},
  drawerContent: {
    flexGrow: 1,
    paddingTop: Size(7),
    justifyContent: 'center',
  },
  itemsContainer: { flex: 1, paddingTop: 10 },
  drawerLabelStyle: {
    fontSize: Size(16),
    fontFamily: 'Outfit-Regular',
  },
  drawerItemStyle: {},
});
