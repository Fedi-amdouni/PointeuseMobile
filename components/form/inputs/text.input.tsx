import { View, TextInput as RNTextInput, KeyboardTypeOptions, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Size } from '../../../utils/size';
import appColors from '../../../colors';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../elements/label';
import { InputControl } from '../elements/controllers';
import { InputStyle } from '../../../style';
import PasswordTester from '../elements/passwordTester';

export const TextInput = TextInputController((props: TextInputProps) => {
  const [value, setValue] = useState<string>('');
  const [show, setShow] = useState(false);
  const inputRef: any = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    setValue(props.default || '');
  }, [props.default]);

  function onChange(evt: string) {
    setValue(evt);
    if (props.onChange) props.onChange(evt);
    props.controller?.field?.onChange(evt);
  }
  function getInputBoxStyle() {
    let style: any = categoryStyle?.inputInitial;
    style = { ...style, ...props.subContainerStyle };
    if (props.disabled) {
      style = { ...style, ...categoryStyle?.inputDisabled, ...props.disabledStyle };
    } else if (isFocused) style = { ...style, ...categoryStyle?.inputFocused, ...props.focusStyle };
    else if (props.controller?.fieldState?.invalid || props.isError)
      style = { ...style, ...categoryStyle?.inputError, ...props.errorStyle };
    else if (props.controller?.fieldState?.isDirty) {
      style = { ...style, ...categoryStyle?.inputSuccess, ...props.successStyle };
    }
    return style;
  }
  function onFocus() {
    setIsFocused(true);
    if (props.onFocus) props.onFocus();
  }
  function onBlur() {
    setIsFocused(false);
    if (props.onBlur) props.onBlur();
    props.controller?.field?.onBlur();
  }
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  return (
    <View style={{ ...categoryStyle?.container, ...props.containerStyle }}>
      {props.label && <Label textStyle={{ ...categoryStyle?.labelText, ...props.labelStyle }}>{props.label}</Label>}
      <View style={getInputBoxStyle()}>
        {props.renderStart && (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={1}>
            {props.renderStart()}
          </TouchableOpacity>
        )}
        <RNTextInput
          onBlur={onBlur}
          onFocus={onFocus}
          value={props.format ? props.format(value) : value}
          selectionColor={props.cursorColor}
          textAlign={props.textAlign}
          ref={inputRef}
          autoCapitalize="none"
          keyboardType={
            props.keyboardType ? props.keyboardType : Platform.OS == 'android' && !props.secureTextEntry ? 'visible-password' : undefined
          }
          onChangeText={onChange}
          autoFocus={props.autoFocus}
          maxLength={props.maxLength}
          placeholderTextColor={
            props.disabled ? categoryStyle?.inputDisabledText?.color : props.placeHolderColor || categoryStyle?.inputPlaceHolderText?.color
          }
          placeholder={props.placeHolder}
          secureTextEntry={props.secureTextEntry && !show}
          editable={!props.disabled}
          numberOfLines={props.numberOfLines}
          selectTextOnFocus={!props.disabled}
          underlineColorAndroid={'transparent'}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            borderWidth: 0,
            height: '100%',
            ...categoryStyle?.inputText,
            fontSize: categoryStyle?.inputText?.fontSize + 2,
            ...props.inputTextStyle,
            ...(props.disabled ? { ...categoryStyle?.inputDisabledText, ...props.inputTextDisabledStyle } : {}),
          }}
        />
        {props.secureTextEntry && !props.noShowPasswordIcon && !props.renderEnd && (
          <TouchableOpacity onPress={() => setShow(prev => !prev)}>
            <MatIcon
              name={props.secureTextEntry && !show ? 'eye' : 'eye-off'}
              color={props.iconColor || appColors.primary100}
              size={props.iconSize || Size(24)}
            />
          </TouchableOpacity>
        )}
        {props.iconName && !props.renderEnd && (
          <TouchableOpacity disabled={!props.onIconPress} onPress={props.onIconPress as any}>
            <MatIcon name={props.iconName} color={props.iconColor || appColors.primary100} size={props.iconSize || Size(30)} />
          </TouchableOpacity>
        )}
        {props.renderEnd && (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={1}>
            {props.renderEnd()}
          </TouchableOpacity>
        )}
      </View>
      {props.withTester && value && <PasswordTester value={value} />}
      {props.controller?.fieldState?.invalid && props.controller?.fieldState?.error?.message ? (
        <FeedBackText category="error" textStyle={{ ...categoryStyle?.errorText, ...props.errorTextStyle }}>
          {props.controller?.fieldState?.error?.message}
        </FeedBackText>
      ) : props.feedback ? (
        <FeedBackText textStyle={{ ...categoryStyle?.feedBackText, ...props.errorTextStyle }}>{props.feedback}</FeedBackText>
      ) : null}
    </View>
  );
});
function TextInputController(Input: any) {
  return function (props: TextInputProps) {
    return InputControl(Input, props);
  };
}
export interface TextInputProps {
  default?: string;
  label?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  placeHolder?: string;
  maxLength?: number;
  testId?: string;
  iconName?: string;
  secureTextEntry?: boolean;
  textAlign?: 'left' | 'right' | 'center' | undefined;
  disabled?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  onFocus?: Function;
  onBlur?: Function;
  onIconPress?: Function;
  isError?: boolean;
  errorTextStyle?: any;
  labelStyle?: any;
  containerStyle?: any;
  category?: string;
  subContainerStyle?: any;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  errorStyle?: any;
  cursorColor?: any;
  autoFocus?: boolean;
  successStyle?: any;
  disabledStyle?: any;
  focusStyle?: any;
  placeHolderColor?: any;
  validate?: Function;
  format?: Function;
  feedback?: string;
  noShowPasswordIcon?: boolean;
  withTester?: boolean;
  name?: string;
  iconColor?: string;
  iconSize?: number;
  renderStart?: () => React.JSX.Element | null;
  renderEnd?: () => React.JSX.Element | null;
  required?: boolean | string;
}
