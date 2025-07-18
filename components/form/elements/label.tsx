import { View } from 'react-native';
import React from 'react';
import Text from '../../utils/text';

export default function Label(props: { children?: string; textStyle?: any; containerStyle?: any }) {
  return (
    <View>
      <Text style={props.textStyle}>{props.children}</Text>
    </View>
  );
}
