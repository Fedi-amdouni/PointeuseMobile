import { Pressable, TextInput, View, StyleSheet, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Size } from '../../../utils/size';
import Text from '../../utils/text';
import AnimatedCursor from '../elements/cursor';
import appColors from '../../../colors';

export default function CodeInput(props: {
  length: number;
  onChange?: Function;
  secureText?: boolean;
  disabled?: boolean;
  boxStyle?: any;
  containerStyle?: any;
  value?: string;
  boxFocusStyle?: any;
  textStyle?: any;
  cursorStyle?: any;
}) {
  const [code, setCode] = useState('');
  const [containerIsFocused, setContainerIsFocused] = useState(false);

  const codeDigitsArray = new Array(props.length).fill(0);
  const ref: any = useRef(null);

  // eslint-disable-next-line react/no-unstable-nested-components
  function DigitInput(_value: number, idx: number) {
    const emptyInputChar = ' ';
    const digit = code?.[idx] ? (props.secureText ? '*' : code?.[idx]) : emptyInputChar;
    const isCurrentDigit = idx === code?.length;
    const isLastDigit = idx === props.length - 1;
    const isCodeFull = code?.length === props.length;
    const isFocused = containerIsFocused && (isCurrentDigit || (isLastDigit && isCodeFull));
    const containerStyle = isFocused
      ? [styles.codeInputCellContainer, props.boxStyle, styles.inputContainerFocused, props.boxFocusStyle]
      : [styles.codeInputCellContainer, props.boxStyle];
    return (
      <View key={idx} style={containerStyle}>
        {containerIsFocused && isFocused && digit == emptyInputChar && <AnimatedCursor cursorStyle={props.cursorStyle} />}
        <Text style={{ ...styles.textStyle, ...props.textStyle }}>{digit}</Text>
      </View>
    );
  }

  const handleOnPress = () => {
    setContainerIsFocused(true);
    ref?.current?.blur();
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  // Effects

  useEffect(() => {
    setCode(props.value || '');
  }, [props.value, props.disabled]);

  useEffect(() => {
    setTimeout(() => {
      ref?.current?.focus();
      setContainerIsFocused(true);
    }, 250);
  }, []);

  return (
    <>
      <Pressable disabled={props.disabled} style={{ ...styles.inputsContainer, ...props.containerStyle }} onPress={handleOnPress}>
        {codeDigitsArray.map(DigitInput)}
      </Pressable>
      <TextInput
        ref={ref}
        value={code}
        onChangeText={text => {
          setCode(text);
          if (text.length == props.length) {
            setContainerIsFocused(false);
            Keyboard.dismiss();
          }
          if (props.onChange) props.onChange(text);
        }}
        onEndEditing={handleOnBlur}
        keyboardType="number-pad"
        selectTextOnFocus={!props.disabled}
        editable={!props.disabled}
        textContentType="oneTimeCode"
        maxLength={props.length}
        style={styles.hiddenCodeInput}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainerFocused: {
    borderColor: 'orange',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
  codeInputCellContainer: {
    height: Size(80),
    width: Size(80),
    borderRadius: Size(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: Size(20),
    color: appColors.textDark,
  },
});
