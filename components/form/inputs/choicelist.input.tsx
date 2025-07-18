/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckBox } from './checkbox.input';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import FeedBackText from '../elements/feedback';
import Label from '../elements/label';
import { Size } from '../../../utils/size';
import { Switch } from './switch.input';
import { ChoicesControl } from '../elements/controllers';
import { InputStyle } from '../../../style';

export const ChoiceList = ChoicesController((props: ChoiceListProps) => {
  const [values, setValues] = useState<any[]>([]);
  const [optionsByColumn, setOptionsByColumn] = useState<any[]>([]);

  useEffect(() => {
    const result: any[] = [];
    const options: any = [...props.options];
    const deft = props?.default ? (Array.isArray(props?.default) ? props?.default : [props.default]) : [];
    setValues(deft.filter(elt => options.find((elt1: any) => elt1.value == elt || elt1 == elt)));
    if (props.columns)
      for (let i = props.columns; i > 0; i--) {
        result.push(options.splice(0, Math.ceil(options.length / i)));
      }
    else {
      result.push(options);
    }
    setOptionsByColumn(result);
  }, [props.columns, props.options, props.default, props.mode]);
  const lastLine = !props.columns ? props.options.length - 1 : props.options.length / props.columns - 1;
  function onChange(elt: any, checked: boolean) {
    const val = elt.value || elt;
    let old = [...values];
    if (props.mode == 'radio') old = [val];
    else {
      if (old.indexOf(val) != -1) old = old.filter(v => v != val);
      else old.push(val);
    }
    setValues(old);
    const res = props.mode == 'radio' ? old[0] : old;
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res, { item: elt, checked });
  }

  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  return (
    <View style={{ ...categoryStyle?.container, ...props.containerStyle }}>
      {props.label && <Label textStyle={props.labelStyle}>{props.label}</Label>}
      <View style={{ ...styles.subContainer, ...props.subContainerStyle }}>
        {optionsByColumn.map((column, ind1) => (
          <View key={ind1} style={{ ...styles.columnStyle, ...props.columnStyle }}>
            {column.map((elt: any, ind2: number) => {
              return props.mode != 'switch' ? (
                <CheckBox
                  label={elt.label || elt}
                  default={
                    props.mode == 'radio'
                      ? (elt.value || elt) == values[0]
                      : Array.isArray(props?.default) && props?.default?.indexOf(elt.value || elt) != -1
                  }
                  key={ind1 + '' + ind2}
                  labelStart={props.labelStart}
                  labelStyle={props.checkLabelStyle}
                  disabled={
                    props.disabled ||
                    elt.disabled ||
                    (props?.maxItems && values?.length >= props?.maxItems && values?.indexOf(elt.value || elt) == -1)
                  }
                  activeIcon={props.activeIcon}
                  inactiveIcon={props.inactiveIcon}
                  disabledColor={props.disabledColor}
                  fullyTouchable={props.fullyTouchable}
                  onChange={onChange.bind(onChange, elt)}
                  containerStyle={{ marginBottom: ind2 == lastLine ? 0 : Size(15), ...props.checkContainerStyle }}
                  subContainerStyle={props.checkSubContainerStyle}
                />
              ) : (
                <Switch
                  label={elt.label || elt}
                  default={Array.isArray(props?.default) && props?.default?.indexOf(elt.value || elt) != -1}
                  key={ind1 + '' + ind2}
                  labelStart={props.labelStart}
                  labelStyle={props.checkLabelStyle}
                  disabled={
                    props.disabled ||
                    elt.disabled ||
                    (props?.maxItems && values?.length >= props?.maxItems && values?.indexOf(elt.value || elt) == -1)
                  }
                  activeColor={props.activeColor}
                  thumbColor={props.thumbColor}
                  disabledColor={props.disabledColor}
                  disabledActiveColor={props.disabledActiveColor}
                  disabledInactiveColor={props.disabledInactiveColor}
                  onChange={onChange.bind(onChange, elt) as any}
                  inactiveColor={props.inactiveColor}
                  containerStyle={{ marginBottom: ind2 == lastLine ? 0 : Size(15), ...props.checkContainerStyle }}
                  subContainerStyle={props.checkSubContainerStyle}
                />
              );
            })}
          </View>
        ))}
      </View>
      {props.controller?.fieldState?.invalid && !props.hideError && (
        <FeedBackText category="error" textStyle={props.errorTextStyle}>
          {props.errorMsg}
        </FeedBackText>
      )}
    </View>
  );
});
function ChoicesController(Input: any) {
  return function (props: ChoiceListProps) {
    return ChoicesControl(Input, props);
  };
}
export interface ChoiceListProps {
  options: (string | number)[] | { value: string | number; label: string; disabled?: boolean }[];
  default?: (string | number)[] | string | number;
  columns?: number;
  label?: string;
  labelStart?: boolean;
  labelStyle?: any;
  checkLabelStyle?: any;
  columnStyle?: any;
  checkContainerStyle?: any;
  checkSubContainerStyle?: any;
  category?: string;
  containerStyle?: any;
  subContainerStyle?: any;
  activeColor?: string;
  inactiveColor?: string;
  disabledColor?: string;
  disabledActiveColor?: string;
  disabledInactiveColor?: string;
  thumbDisabledColor?: string;
  thumbColor?: string;
  mode?: 'check' | 'switch' | 'radio';
  switch?: boolean;
  activeIcon?: string;
  inactiveIcon?: string;
  disabled?: boolean;
  fullyTouchable?: boolean;
  name?: string;
  minItems?: number;
  required?: boolean;
  errorMsg?: string;
  maxItems?: number;
  errorTextStyle?: any;
  hideError?: boolean;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
}
const styles = StyleSheet.create({
  subContainer: { flexDirection: 'row', width: '100%' },
  columnStyle: { flex: 1 },
});
