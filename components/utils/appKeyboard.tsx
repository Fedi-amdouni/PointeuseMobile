import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { Size } from '../../utils/size';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appColors from '../../colors';
export default function AppKeyboard(props: AuthKeyboardType) {
  const value = useRef('');
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['left', '0', 'delete'],
  ];
  function onPress(val: string) {
    if (val == 'left') {
      if (props.onLeftClick) props.onLeftClick();
      return;
    } else {
      if (val == 'delete') value.current = value.current.slice(0, -1);
      else value.current += val;
      if (props.onChange) props.onChange(value.current);
    }
  }
  return (
    <View style={styles.container}>
      {rows.map((row, ind) => (
        <View key={ind} style={styles.row}>
          {row.map(val => (
            <View style={styles.buttonContainer} key={val + row}>
              <TouchableOpacity onPress={onPress.bind(onPress, val)} style={styles.button}>
                {val == 'left' ? (
                  <View style={styles.iconsContainer}>
                    <Icon name="face-recognition" color={appColors.primary100} size={Size(27)} />
                    <Icon name="fingerprint" color={appColors.primary100} size={Size(27)} />
                  </View>
                ) : val == 'delete' ? (
                  <Icon name="keyboard-backspace" color={appColors.primary100} size={Size(30)} />
                ) : (
                  <Text style={styles.buttonText}>{val}</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
interface AuthKeyboardType {
  onChange?: Function;
  onLeftClick?: Function;
}
const styles = StyleSheet.create({
  container: { width: '100%' },
  row: {
    width: '100%',
    height: Size(90),
    alignItems: 'center',
    marginBottom: 7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonContainer: { flex: 1, alignItems: 'center', marginEnd: 7 },
  button: {
    alignItems: 'center',
    width: Size(75),
    height: Size(75),
    borderRadius: Size(75) / 2,
    borderColor: appColors.primary100,
    borderWidth: 1,
    justifyContent: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: Size(19),
    fontWeight: 'bold',
    color: appColors.primary100,
  },
});
