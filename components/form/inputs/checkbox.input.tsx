/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, TouchableOpacity, View, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import { InputControl } from '../elements/controllers';
import { CheckBoxStyle } from '../../../style';
import Text from '../../utils/text';

export const CheckBox = CheckBoxController((props: CheckboxInputProps) => {
  const [value, setValue] = useState(false);
  useEffect(() => {
    setValue(props.default == 1 || props.default == true);
  }, [props.default]);

  function onCheck() {
    if (props.disabled) return;
    Keyboard.dismiss();
    setValue(old => {
      const val = !props.numberify ? !old : old ? 0 : 1;
      if (props.onChange) props.onChange(val);
      props.controller?.field?.onChange(val);
      return !old;
    });
  }
  const categoryStyle = (CheckBoxStyle as any)[props.category || 'primary'];
  const Icon = value ? props.activeIcon || categoryStyle?.activeIcon : categoryStyle?.inactiveIcon || props.inactiveIcon;
  return (
    <View style={{ ...categoryStyle?.style?.container, ...props.containerStyle }}>
      <TouchableOpacity
        activeOpacity={props.fullyTouchable && !props.disabled ? 0 : 1}
        onPress={props.fullyTouchable ? onCheck : undefined}
        style={{ ...styles.subContainer, ...props.subContainerStyle }}
      >
        {props.labelStart && <Text style={{ ...categoryStyle?.style?.labelText, ...props.labelStyle }}>{props.label}</Text>}
        {!props.hideCheck && (
          <TouchableOpacity
            onBlur={props.controller?.field?.onBlur}
            onPress={onCheck}
            activeOpacity={!props.disabled ? 0 : 1}
            testID={props.testId || props.name}
          >
            <Icon width={categoryStyle.size} height={categoryStyle.size} />
          </TouchableOpacity>
        )}
        {!props.labelStart && <Text style={{ ...categoryStyle?.style?.labelText, flex: 1, ...props.labelStyle }}>{props.label}</Text>}
      </TouchableOpacity>
      {props.controller?.fieldState?.invalid && !props.hideError && (
        <FeedBackText category="error" textStyle={{ ...categoryStyle?.style?.errorText, ...props.errorTextStyle }}>
          {props.controller?.fieldState?.error?.message}
        </FeedBackText>
      )}
    </View>
  );
});
function CheckBoxController(Input: any) {
  return function (props: CheckboxInputProps) {
    return InputControl(Input, props);
  };
}
interface CheckboxInputProps {
  default?: boolean | 0 | 1;
  label?: string;
  labelStart?: boolean;
  fullyTouchable?: boolean;
  labelStyle?: any;
  errorTextStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  errorColor?: string;
  testId?: string;
  disabledColor?: string;
  activeIcon?: string;
  inactiveIcon?: string;
  hideCheck?: boolean;
  iconSize?: number;
  disabled?: boolean;
  numberify?: boolean;
  hideError?: boolean;
  category?: string;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  name?: string;
  required?: boolean | string;
}

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
