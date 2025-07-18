/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, Keyboard, ScrollView, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Size } from '../../../utils/size';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import appColors from '../../../colors';
import { FieldValues, UseControllerReturn } from 'react-hook-form';
import { CheckBox } from './checkbox.input';
import Label from '../elements/label';
import { SelectControl } from '../elements/controllers';
import { FlatList } from 'react-native-gesture-handler';
import { TextInput, TextInputProps } from './text.input';
import FeedBackText from '../elements/feedback';
import { DropdownStyle, InputStyle } from '../../../style';
import Text from '../../utils/text';
export const SelectInput = SelectInputController((props: SelectInputProps) => {
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  useEffect(() => {
    let listener: any = null;
    if (listener) {
      listener.remove();
      listener = null;
    }
    listener = DeviceEventEmitter.addListener('hidedropdown', () => {
      setShow(false);
    });
    return () => {
      if (listener) {
        listener.remove();
        listener = null;
      }
    };
  }, []);
  const [layout, setLayout] = useState<any>({ x: 0, y: 0, width: 0 });
  const elementRef: any = useRef(null);
  useEffect(() => {
    setOptions(props.options);
    const opts: any = [...props.options];
    const deft = props?.default
      ? Array.isArray(props?.default) && props.multiple
        ? props?.default
        : !Array.isArray(props?.default) && !props.multiple
        ? [props.default]
        : []
      : [];

    setValues(deft.filter(elt => opts.find((elt1: any) => elt1.value == elt || elt1 == elt)));
  }, [props.options, props.default, props.multiple]);

  function getInputBoxStyle() {
    let style: any = categoryStyle?.inputInitial;
    style = { ...style, ...props.subContainerStyle };
    if (props.disabled) {
      style = { ...style, ...categoryStyle?.inputDisabled, ...props.disabledStyle };
    } else if (show) style = { ...style, ...categoryStyle?.inputFocused };
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
    else if (values.length == 0)
      style = {
        ...style,
        ...categoryStyle?.inputPlaceHolderText,
        fontSize: categoryStyle?.inputText?.fontSize + 2,
        ...props.inputPlaceHolderStyle,
      };
    return style;
  }
  function onChange(elt: any, checked?: any) {
    let toupdate = [...values];
    const val = elt.value || elt;
    if (!props.multiple) toupdate = [val];
    else {
      if (toupdate.indexOf(val) != -1) toupdate = toupdate.filter(v => v != val);
      else toupdate.push(val);
    }
    setValues(toupdate);
    const res = !props.multiple ? toupdate[0] : toupdate;
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res, { item: elt, checked });
    if (!props.multiple) {
      setShow(false);
      props.controller?.field?.onBlur();
    }
  }
  function getLabels() {
    return props.options.filter((elt: any) => values.indexOf(elt.value || elt) != -1).map((elt: any) => elt.label || elt);
  }
  function onSearch(text: string) {
    if (!text) setOptions(props.options);
    else {
      const toupdate = [...props.options].filter((elt: any) => (elt.label || elt).startsWith(text));
      setOptions(toupdate);
    }
  }
  function onClearAll() {
    setValues([]);
    const res = !props.multiple ? '' : [];
    props.controller?.field?.onChange(res);
    if (props?.onChange) props?.onChange(res);
  }
  function hide() {
    hideDropdown();
    if (show) {
      setShow(false);
      props.controller?.field?.onBlur();
    }
  }
  const categoryStyle = (InputStyle as any)[props.category || 'primary'];
  const dropDownCategoryStyle = (DropdownStyle as any)[props.dropDownCategory || props.category || 'primary'];
  return (
    <>
      {show && (
        <TouchableOpacity
          onPress={hide}
          style={{
            ...styles.outsideZone,
            top: -layout.py,
            left: -layout.x,
            zIndex: props.zIndex || Math.floor(Math.abs(10000 - layout.py)) || 2,
          }}
        />
      )}
      {props.label && <Label textStyle={{ ...categoryStyle?.labelText, ...props.labelStyle }}>{props.label}</Label>}
      <View style={{ zIndex: props.zIndex || Math.floor(Math.abs(10000 - layout.py)) || 2 }}>
        <View style={{ ...categoryStyle?.container, ...props.containerStyle }}>
          <TouchableOpacity
            disabled={props.disabled}
            ref={elementRef}
            onPress={() => {
              elementRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
                setLayout({ x: px, y: fy + height, py: py, width: width });
                if (!show) hideDropdown();
                setShow(old => {
                  if (old) props.controller?.field?.onBlur();
                  return !old;
                });
                Keyboard.dismiss();
              });
            }}
            style={getInputBoxStyle()}
          >
            <Text numberOfLines={props.numberOfLines} style={getInputTextStyle()}>
              {getLabels().join(' , ') || props.placeHolder || ''}
            </Text>
            {values.length > 0 && !props.noClearIcon && !props.disabled && (
              <TouchableOpacity onPress={onClearAll}>
                <MatIcon name={'clear'} color={props.iconColor || appColors.primary150} size={props.iconSize || Size(23)} />
              </TouchableOpacity>
            )}
            <MatIcon
              name={show ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              color={props.iconColor || props.disabled ? categoryStyle?.inputDisabledText.color : appColors.primary100}
              size={props.iconSize || Size(23)}
            />
          </TouchableOpacity>
          {props.controller?.fieldState?.invalid ? (
            <FeedBackText category="error" textStyle={{ ...categoryStyle?.errorText, ...props.errorTextStyle }}>
              {props.controller?.fieldState?.error?.message}
            </FeedBackText>
          ) : props.feedback ? (
            <FeedBackText textStyle={{ ...categoryStyle?.feedBackText, ...props.errorTextStyle }}>{props.feedback}</FeedBackText>
          ) : null}
        </View>
        {show && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: layout.width,
              top: layout.y,
              ...styles.dropDownStyle,
              ...dropDownCategoryStyle?.container,
              ...props.dropDownStyle,
            }}
          >
            {props.search && (
              <TextInput
                renderEnd={() => (
                  <MatIcon name={'search'} color={props.iconColor || appColors.primary100} size={props.iconSize || Size(24)} />
                )}
                placeHolder={'search'}
                placeHolderColor={'gray'}
                onChange={onSearch}
                inputTextStyle={{ fontSize: Size(15) }}
                subContainerStyle={styles.searchInput}
                {...props.searchInputProps}
              />
            )}
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
              <FlatList
                data={options}
                contentContainerStyle={{ width: '100%', flexGrow: 1 }}
                renderItem={p => <RenderItem categoryStyle={dropDownCategoryStyle} {...p} values={values} onSelect={onChange} {...props} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item: any) => item.value || item}
              />
            </ScrollView>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
});

function RenderItem(props: any) {
  const disabled =
    props.disabled ||
    props.item.disabled ||
    (props?.maxItems && props.values?.length >= props?.maxItems && props.values?.indexOf(props.item.value || props.item) == -1);
  const selected = !props.multiple && props.values?.find((item: any) => item == (props.item.value || props.item));
  return (
    <CheckBox
      label={props.item.label || props.item}
      labelStart
      fullyTouchable
      disabled={disabled}
      onChange={props.onSelect?.bind(props.onSelect, props.item)}
      default={props.values?.find((item: any) => item == (props.item.value || props.item)) != undefined}
      hideCheck={!props.multiple}
      subContainerStyle={{ justifyContent: 'space-between' }}
      containerStyle={{ ...styles.itemContainerStyle, paddingHorizontal: props.multiple ? Size(10) : 0 }}
      labelStyle={{
        ...styles.itemStyle,
        marginStart: 0,
        paddingHorizontal: !props.multiple ? Size(10) : 0,
        ...props.itemStyle,
        ...props.categoryStyle?.item,
        ...(disabled ? { ...props.categoryStyle?.itemDisabled, ...props.activeItemStyle } : {}),
        ...(selected ? { ...props.categoryStyle?.itemSelected, ...props.activeItemStyle } : {}),
      }}
    />
  );
}

function SelectInputController(Input: any) {
  return function (props: SelectInputProps) {
    return SelectControl(Input, props);
  };
}
export function hideDropdown() {
  DeviceEventEmitter.emit('hidedropdown', { show: false });
}
export interface SelectInputProps {
  options: (string | number)[] | { value: string | number; label: string; disabled?: boolean }[];
  default?: (string | number)[] | string | number;
  label?: string;
  zIndex?: number;
  numberOfLines?: number;
  labelStyle?: any;
  containerStyle?: any;
  subContainerStyle?: any;
  disabled?: boolean;
  errorStyle?: any;
  successStyle?: any;
  disabledStyle?: any;
  category?: string;
  dropDownCategory?: string;
  focusStyle?: any;
  name?: string;
  minItems?: number;
  required?: boolean | string;
  errorMsg?: string;
  feedback?: string;
  inputTextStyle?: any;
  inputTextDisabledStyle?: any;
  inputPlaceHolderStyle?: any;
  multiple?: any;
  itemStyle?: any;
  disabledItemStyle?: any;
  activeItemStyle?: any;
  renderItem?: () => React.JSX.Element;
  validate?: Function;
  dropDownStyle?: any;
  maxItems?: number;
  noClearIcon?: boolean;
  errorTextStyle?: any;
  hideError?: boolean;
  placeHolder?: string;
  search?: boolean;
  searchInputProps?: TextInputProps;
  multipleMaxLines?: number;
  controller?: UseControllerReturn<FieldValues, string>;
  onChange?: Function;
  iconColor?: string;
  iconSize?: number;
}
const styles = StyleSheet.create({
  dropDownStyle: {
    position: 'absolute',
    alignSelf: 'center',
  },
  outsideZone: {
    ...(StyleSheet.absoluteFill as any),
    flex: 1,
    width: Dimensions.get('window').width,
    top: 0,
  },
  itemStyle: {
    fontSize: Size(17),
    flex: 1,
    paddingVertical: Size(5),
    color: appColors.textDark,
  },
  itemContainerStyle: {
    marginBottom: 0,
    paddingVertical: Size(5),
  },
  searchInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
});
