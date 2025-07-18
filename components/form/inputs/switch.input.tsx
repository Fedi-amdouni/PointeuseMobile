import { StyleSheet, Switch as RNSwitch, View, Platform, Dimensions, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Size, pixelSizeHorizontal } from '../../../utils/size';
import appColors from '../../../colors';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import { InputControl } from '../elements/controllers';
import { InputStyle } from '../../../style';
import Text from '../../utils/text';

export const Switch = SwitchController((props: SwitchProps) => {
  const [value, setValue] = useState(false);
  useEffect(() => {
    setValue(props.default == 1 || props.default == true);
  }, [props.default]);

  function onSwitch() {
    Keyboard.dismiss();
    setValue(old => {
      const val = !props.numberify ? !old : old ? 0 : 1;
      if (props.onChange) props.onChange(val);
      props.controller?.field?.onChange(val);
      return !old;
    });
  }
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  return (
    <View style={{ ...categoryStyle?.container, ...props.containerStyle }}>
      <View style={{ ...styles.subContainer, ...props.subContainerStyle }}>
        {props.labelStart && <Text style={{ ...styles.labelStart, ...props.labelStyle }}>{props.label}</Text>}
        <RNSwitch
          style={{
            transform:
              Platform.OS == 'ios' && Dimensions.get('window').width < 800
                ? [{ scaleX: Dimensions.get('window').width / 600 }, { scaleY: Dimensions.get('window').width / 600 }]
                : undefined,
            ...props.switchStyle,
          }}
          testID={props.testId || props.name}
          thumbColor={props.thumbColor || appColors.textLight}
          ios_backgroundColor={
            !value
              ? props.disabled
                ? props.disabledInactiveColor || props.disabledColor || appColors.disabled
                : props.inactiveColor || appColors.dangerSecondary
              : undefined
          }
          trackColor={{
            true: props.disabled
              ? props.disabledActiveColor || props.disabledColor || appColors.disabled
              : props.activeColor || appColors.primary100,
            false: props.disabled
              ? props.disabledInactiveColor || props.disabledColor || appColors.disabled
              : props.inactiveColor || appColors.dangerSecondary,
          }}
          value={value}
          disabled={props.disabled}
          onChange={onSwitch}
        />
        {!props.labelStart && <Text style={{ ...styles.labelEnd, ...props.labelStyle }}>{props.label}</Text>}
      </View>
      {props.controller?.fieldState?.invalid && (
        <FeedBackText category="error" textStyle={props.errorTextStyle}>
          {props.controller?.fieldState?.error?.message}
        </FeedBackText>
      )}
    </View>
  );
});
function SwitchController(Input: any) {
  return function (props: SwitchProps) {
    return InputControl(Input, props);
  };
}
interface SwitchProps {
  default?: boolean | 0 | 1;
  label?: string;
  labelStart?: boolean;
  labelStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  switchStyle?: any;
  activeColor?: string;
  inactiveColor?: string;
  category?: string;
  disabledColor?: string;
  disabledActiveColor?: string;
  disabledInactiveColor?: string;
  thumbDisabledColor?: string;
  thumbColor?: string;
  testId?: string;
  disabled?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  errorTextStyle?: any;
  numberify?: boolean;
  name?: string;
  required?: boolean | string;
}

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStart: {
    fontSize: Size(19),
    marginEnd: pixelSizeHorizontal(10),
    color: appColors.textDark,
  },
  labelEnd: {
    fontSize: Size(19),
    marginStart: Size(10),
    color: appColors.textDark,
    flex: 1,
  },
  errorTextStyle: {
    color: appColors.dangerPrimary,
    fontWeight: 'bold',
    fontSize: Size(15),
    marginTop: Size(7),
    marginStart: Size(5),
  },
});
