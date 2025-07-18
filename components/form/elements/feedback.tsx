/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet } from 'react-native';
import React from 'react';
import Text from '../../utils/text';
import ErrorIcon from '../../../../resources/assets/error.svg';
import { Size } from '../../../utils/size';
export default function FeedBackText(props: {
  children?: string;
  textStyle?: any;
  containerStyle?: any;
  category?: 'error' | 'success' | 'info';
}) {
  return (
    props.children && (
      <View style={{ ...styles.container, ...props.containerStyle }}>
        <View style={{ marginTop: Size(6), marginStart: Size(-8) }}>
          {props.category == 'error' && <ErrorIcon width={Size(20)} height={Size(20)} />}
        </View>
        <Text style={{ flex: 1, ...props.textStyle }}>{props.children}</Text>
      </View>
    )
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
});
