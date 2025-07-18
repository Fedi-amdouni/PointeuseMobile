import { Text as RnText, TextProps as RnTextProps } from 'react-native';
import React from 'react';
import { TextStyle } from '../../style';

interface TextProps extends RnTextProps {
  category?: string;
  color?: string;
}

export function Text(props: TextProps) {
  const defaultStyle = (TextStyle as any)[props.category || ''];
  return (
    <RnText {...props} style={[defaultStyle, { color: props.color || defaultStyle?.color }, props.style as any]}>
      {props.children}
    </RnText>
  );
}

export default Text;
