import { StyleSheet, View } from 'react-native';
import React from 'react';
import ProgressBar from 'react-native-progress-bar-horizontal';
import { strings } from '../../../contexts/app.context';
import Text from '../../utils/text';
import { Size } from '../../../utils/size';
export default function PasswordTester(props: { value: string }) {
  return (
    <View style={styles.containerStyle}>
      <ProgressBar
        progress={checkPasswordStrength(props.value).value}
        fillColor={checkPasswordStrength(props.value).color}
        unfilledColor="#F2FAF5"
        borderRadius={0}
        height={Size(2)}
        borderColor="white"
        duration={100}
      />
      <Text style={styles.textStyle} category="legend">
        {checkPasswordStrength(props.value).title}
      </Text>
    </View>
  );
}
export function checkPasswordStrength(value: string) {
  const lengthRegex = /^.{8,}$/;
  const digitRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[^A-Za-z0-9]/;
  let score = 0;
  if (lengthRegex.test(value)) {
    score++;
  }
  if (digitRegex.test(value)) {
    score++;
  }
  if (uppercaseRegex.test(value)) {
    score++;
  }
  if (lowercaseRegex.test(value)) {
    score++;
  }
  if (specialCharRegex.test(value)) {
    score++;
  }
  const maxScore = 5;
  const minRange = 0.1;
  const maxRange = 0.8;

  const val = minRange + (maxRange - minRange) * (score / maxScore);
  if (score === 5) {
    return { title: strings.strong_security, color: '#5CC867', value: 1 };
  } else if (score >= 3) {
    return { title: strings.medium_security, color: 'orange', value: val };
  } else {
    return { title: strings.low_security, color: 'red', value: val };
  }
}
const styles = StyleSheet.create({
  textStyle: { marginTop: Size(3), color: '#0C2D22' },
  containerStyle: { width: '100%', marginTop: Size(6) },
});
