import { StyleSheet, TouchableOpacity, Keyboard, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React, { useState } from 'react';
import { ButtonStyle } from '../../../style';
import Text from '../../utils/text';

const Button = (props: ButtonProps) => {
  const [progress, setProgress] = useState(false);
  const [touched, setTouched] = useState(false);
  async function onPress() {
    Keyboard.dismiss();
    if (progress) return;
    setProgress(true);
    if (props.onPress)
      try {
        await props.onPress();
      } catch (e) {
        /* empty */
      }
    setProgress(false);
  }

  const disabled = props.disabled || (progress && props.disableOnProgress != false);
  const categoryStyle = (ButtonStyle as any)[props.category || 'primary'];
  const containerStyle = disabled
    ? { ...categoryStyle?.disabledContainer, ...(props.disabledStyle as any) }
    : touched
    ? { ...categoryStyle?.touchedContainer, ...(props.touchedStyle as any) }
    : {};
  const textStyle = disabled
    ? { ...categoryStyle?.disabledText, ...(props.disabledTextStyle as any) }
    : touched
    ? { ...categoryStyle?.touchedText, ...(props.touchedTextStyle as any) }
    : {};

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPressIn={() => setTouched(true)}
      onPressOut={() => setTouched(false)}
      style={[styles.containerStyle, categoryStyle?.initialContainer, containerStyle, props.style]}
      onPress={onPress}
    >
      {props.renderStart && props.renderStart()}
      <Text style={[categoryStyle?.initialText, textStyle, props.textStyle]}>{props.title}</Text>
      {props.renderEnd && props.renderEnd()}
    </TouchableOpacity>
  );
};
interface ButtonProps {
  title: string;
  disabled?: boolean;
  disableOnProgress?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
  touchedStyle?: StyleProp<ViewStyle>;
  touchedTextStyle?: StyleProp<TextStyle>;
  category?: string;
  disableOnError?: boolean;
  onPress?: Function;
  renderStart?: any;
  renderEnd?: any;
}
export default Button;

const styles = StyleSheet.create({
  containerStyle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
