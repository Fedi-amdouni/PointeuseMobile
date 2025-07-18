/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CountryPicker from 'rn-country-picker';
import { Size } from '../../../utils/size';
import { TextInput } from './text.input';
import { InputStyle, TextStyle } from '../../../style';
import Label from '../elements/label';
import { strings, useAppContext } from '../../../contexts/app.context';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import parsePhoneNumber from 'libphonenumber-js';
import FeedBackText from '../elements/feedback';
import { PhoneControl } from '../elements/controllers';
import { formatPhoneInput } from '../../../utils/functions';

export const PhoneNumberInput = PhonenputController((props: PhoneInputType) => {
  const phoneInfo: any = useRef({});
  const { appInfos } = useAppContext();
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  useEffect(() => {
    const deflt = props.default ? (props.default.startsWith('+') ? props.default : '+' + props.default) : '';
    const phoneParse = parsePhoneNumber(deflt);
    const code = phoneParse?.countryCallingCode || props.defaultCode || '';
    const phone = phoneParse?.nationalNumber || props.default || '';
    setCountryCode(code);
    setValue(formatPhoneInput(phone));
    phoneInfo.current = {
      country: phoneParse?.country,
      code: code,
      nationalNumber: phone,
      number: '+' + code + phone,
    };
  }, [props.default, props.defaultCode]);

  function onSelectCountry(val: any) {
    const phoneParse = parsePhoneNumber('+' + val.callingCode);
    phoneInfo.current = {
      country: phoneParse?.country,
      code: val.callingCode,
      nationalNumber: '',
      number: '+' + val.callingCode,
    };
    if (props.onChange) props.onChange(phoneInfo.current);
    setValue('');
    setCountryCode(val.callingCode);
  }
  function onChangePhone(val: string) {
    const v = val.replace(/\s/g, '');
    const code = countryCode || '243';
    const phoneParse = parsePhoneNumber('+' + code + v);
    phoneInfo.current = {
      country: phoneParse?.country,
      code: code,
      nationalNumber: v,
      number: '+' + code + v,
    };
    if (props.onChange) props.onChange(phoneInfo.current);
    props.controller?.field?.onChange(phoneInfo.current);
    setValue(formatPhoneInput(v));
  }

  return (
    <View style={categoryStyle.container}>
      {props.label && <Label textStyle={{ ...categoryStyle?.labelText, ...props.labelStyle }}>{props.label}</Label>}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TextInput
          containerStyle={{ flex: props.singleInput || props.national ? 1 : 0, marginBottom: 0 }}
          disabled={props.disabled}
          maxLength={props.maxLength}
          default={value}
          onBlur={() => {
            props.controller?.field?.onBlur();
          }}
          onChange={onChangePhone}
          placeHolder={props.placeHolder}
          isError={props.controller?.fieldState?.invalid && (props.singleInput || props.national)}
          subContainerStyle={{
            width: !props.singleInput && !props.national ? Size(140) : undefined,
            marginEnd: Size(10),
          }}
          keyboardType="number-pad"
          renderStart={() =>
            !props.national ? (
              <CountryPicker
                disable={props.disabled || props.disabledSelect}
                animationType={'slide'}
                language={appInfos.language == 'fr' ? 'fra' : 'en'}
                countryFlagStyle={{ width: Size(29), height: Size(20), display: props.hideFlag ? 'none' : undefined }}
                containerStyle={{
                  width: !props.singleInput ? '100%' : undefined,
                  justifyContent: props.hideFlag ? 'center' : 'space-between',
                  flexDirection: 'row',
                }}
                dropDownImageStyle={{
                  tintColor: '#849391',
                  display: props.hideDropDown ? 'none' : undefined,
                  marginStart: !props.hideFlag && !props.singleInput ? Size(7) : Size(3),
                }}
                pickerTitleStyle={TextStyle.current}
                searchBarStyle={TextStyle.current as any}
                countryNameTextStyle={{ ...TextStyle.legend, marginStart: Size(10) }}
                selectedCountryTextStyle={{
                  ...categoryStyle?.inputText,
                  ...((props.disabledSelect && !props.singleInput) || props.disabled ? categoryStyle?.inputDisabledText : {}),
                  flex: 0,
                  marginStart: !props.hideFlag ? Size(7) : 0,
                  fontSize: categoryStyle?.inputText?.fontSize + (props.singleInput ? 4 : 2),
                  marginEnd: props.singleInput ? Size(5) : 0,
                }}
                pickerTitle={props.pickerTitle || strings.country_title}
                searchBarPlaceHolder={props.pickerSearchPlaceHolder || strings.search}
                hideCountryFlag={false}
                hideCountryCode={false}
                countryCode={countryCode || '243'}
                selectedValue={onSelectCountry}
              />
            ) : null
          }
        />
        {!props.singleInput && !props.national && (
          <TextInput
            onBlur={() => props.controller?.field?.onBlur()}
            keyboardType="number-pad"
            placeHolder={props.placeHolder}
            onChange={onChangePhone}
            isError={props.controller?.fieldState?.invalid}
            maxLength={props.maxLength}
            containerStyle={{ marginBottom: 0, flex: 1 }}
            default={value}
            disabled={props.disabled}
          />
        )}
      </View>
      {props.controller?.fieldState?.invalid ? (
        <FeedBackText category="error" textStyle={{ ...categoryStyle?.errorText, ...props.errorTextStyle }}>
          {props.errorMsg || props.controller?.fieldState?.error?.message}
        </FeedBackText>
      ) : props.feedback ? (
        <FeedBackText textStyle={{ ...categoryStyle?.feedBackText, ...props.errorTextStyle }}>{props.feedback}</FeedBackText>
      ) : null}
    </View>
  );
});
function PhonenputController(Input: any) {
  return function (props: PhoneInputType) {
    return PhoneControl(Input, props);
  };
}
interface PhoneInputType {
  defaultCode?: string;
  category?: string;
  hideFlag?: boolean;
  hideDropDown?: boolean;
  disabledSelect?: boolean;
  disabled?: boolean;
  maxLength?: number;
  label?: string;
  placeHolder?: string;
  name?: string;
  required?: boolean;
  errorMsg?: string;
  errorTextStyle?: any;
  labelStyle?: any;
  onChange?: Function;
  feedback?: string;
  national?: boolean;
  pickerTitle?: string;
  default?: string;
  pickerSearchPlaceHolder?: string;
  singleInput?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
}
