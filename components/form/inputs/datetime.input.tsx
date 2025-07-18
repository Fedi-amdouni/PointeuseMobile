import { View, TouchableOpacity, Appearance } from 'react-native';
import React, { useEffect, useState } from 'react';
import Calendar from '../../../../resources/assets/calendar.svg';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import RNDateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import Label from '../elements/label';
import { InputControl } from '../elements/controllers';
import { InputStyle } from '../../../style';
import { Size } from '../../../utils/size';
import Text from '../../utils/text';
import { strings } from '../../../contexts/app.context';

export const DateTimeInput = DateTimeInputController((props: DateTimeProps) => {
  const [value, setValue] = useState<Date | undefined>();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setValue(typeof props.default == 'string' ? new Date(props.default) : props.default);
  }, [props.default]);
  function showPicker() {
    setShow(true);
  }
  function onChange(evt: any) {
    setShow(false);
    setValue(evt);
    if (props.onChange) props.onChange(evt);
    props.controller?.field?.onChange(evt);
  }
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  function getInputBoxStyle() {
    let style: any = categoryStyle?.inputInitial;
    style = { ...style, ...props.subContainerStyle };
    if (props.disabled) {
      style = { ...style, ...categoryStyle?.inputDisabled, ...props.disabledStyle };
    } else if (show) style = { ...style, ...categoryStyle?.inputFocused, ...props.focusStyle };
    else if (props.controller?.fieldState?.invalid) style = { ...style, ...categoryStyle?.inputError, ...props.errorStyle };
    else if (props.controller?.fieldState?.isDirty) {
      style = { ...style, ...categoryStyle?.inputSuccess, ...props.successStyle };
    }
    return style;
  }
  function getInputTextStyle() {
    let style = {
      ...categoryStyle?.inputText,
      fontSize: categoryStyle?.inputText?.fontSize + 2,
      ...props.inputTextStyle,
    };
    if (props.disabled) style = { ...style, ...categoryStyle?.inputDisabledText, ...props.inputTextDisabledStyle };
    else if (!value)
      style = {
        ...style,
        ...categoryStyle?.inputPlaceHolderText,
        fontSize: categoryStyle?.inputText?.fontSize + 2,
        ...props.inputPlaceHolderStyle,
      };
    return style;
  }
  return (
    <View style={{ ...categoryStyle?.container, ...props.containerStyle }}>
      {props.label && <Label textStyle={{ ...categoryStyle?.labelText, ...props.labelStyle }}>{props.label}</Label>}
      <TouchableOpacity disabled={props.disabled} onPress={showPicker} style={getInputBoxStyle()}>
        <Text style={getInputTextStyle()}>
          {(value &&
            moment(value).format(
              props.format || (props.mode == 'time' ? 'HH:mm' : props.mode == 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY '),
            )) ||
            props.placeHolder ||
            ''}
        </Text>
        {props.icon ? props.icon() : <Calendar width={Size(24)} height={Size(24)} />}
      </TouchableOpacity>
      {show && (
        <RNDateTimePicker
          testID={props.testId || props.name}
          mode={props.mode || 'date'}
          is24hourSource="locale"
          date={value || new Date()}
          modal
          open={show}
          onCancel={() => {
            setShow(false);
          }}
          onConfirm={onChange}
          maximumDate={props.maximumDate}
          minimumDate={props.minimumDate}
          minuteInterval={props.minuteInterval as any}
          textColor={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}
          fadeToColor="white"
          confirmText={props.confirmText || strings.confirm}
          cancelText={props.cancelText || strings.cancel}
          title={props.modalTitle || strings.selectdate}
          locale={props.locale || 'fr'}
        />
      )}
      {props.controller?.fieldState?.invalid ? (
        <FeedBackText category="error" textStyle={{ ...categoryStyle?.errorText, ...props.errorTextStyle }}>
          {props.controller?.fieldState?.error?.message}
        </FeedBackText>
      ) : props.feedback ? (
        <FeedBackText textStyle={{ ...categoryStyle?.feedBackText, ...props.errorTextStyle }}>{props.feedback}</FeedBackText>
      ) : null}
    </View>
  );
});
function DateTimeInputController(Input: any) {
  return function (props: DateTimeProps) {
    return InputControl(Input, props);
  };
}
interface DateTimeProps {
  default?: Date;
  label?: string;
  labelStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  format?: string;
  errorStyle?: any;
  successStyle?: any;
  disabledStyle?: any;
  focusStyle?: any;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  inputPlaceHolderStyle?: any;
  placeHolder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  confirmText?: string;
  cancelText?: string;
  modalTitle?: string;
  locale?: string;
  testId?: string;
  minuteInterval?: number;
  disabled?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  errorTextStyle?: any;
  validate?: Function;
  mode?: 'date' | 'time' | 'datetime';
  numberify?: boolean;
  icon?: any;
  feedback?: string;
  name?: string;
  required?: boolean | string;
  category?: string;
}
