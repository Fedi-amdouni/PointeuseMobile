import React from 'react';
import Loading from './loading';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../../contexts/app.context';
import AppUpdate from './appUpdate';
import HttpInterceptor from './httpHandler';
import appColors from '../../colors';

export default function ScreenContainer(Screen: any, params?: { style?: any; edges?: any }) {
  return function Content(props: any) {
    const { appInfos } = useAppContext();
    return (
      <HttpInterceptor>
        <AppUpdate>
          <View style={{ ...styles.container, ...params?.style }}>
            <Loading />
            <Screen {...props} {...appInfos} />
          </View>
        </AppUpdate>
      </HttpInterceptor>
    );
  };
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.screenBackground },
});
