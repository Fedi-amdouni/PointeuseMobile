import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { Size } from '../../../utils/size';

const AnimatedCursor = (props: any) => {
  const cursorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cursorBlink = () => {
      Animated.sequence([
        Animated.timing(cursorAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(cursorAnimation, {
          toValue: 0.1,
          duration: 500,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]).start(() => cursorBlink());
    };

    cursorBlink();
  }, [cursorAnimation]);

  return (
    <View style={styles.cursorContainer}>
      <Animated.View
        style={[
          { ...styles.cursor, ...props.cursorStyle },
          {
            opacity: cursorAnimation,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cursorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    width: 2,
    height: Size(30),
    backgroundColor: 'black',
  },
});

export default AnimatedCursor;
