import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Size } from '../utils/size';
import BootSplash from 'react-native-bootsplash';
import appColors from '../colors';
export function WithSplashScreen({
  children,
  isAppReady,
  showJsSplash,
}: {
  isAppReady: boolean;
  children: React.ReactNode;
  showJsSplash?: boolean;
}) {
  useEffect(() => {
    (async () => {
      if (isAppReady || showJsSplash) await BootSplash.hide({ fade: true });
    })();
  }, [isAppReady, showJsSplash]);
  return (
    <>
      {children}
      {showJsSplash && <SplashScreen isAppReady={isAppReady} />}
    </>
  );
}

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export const SplashScreen = ({ isAppReady }: { isAppReady: boolean }) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState<
    typeof LOADING_IMAGE | typeof FADE_IN_IMAGE | typeof WAIT_FOR_APP_TO_BE_READY | typeof FADE_OUT | typeof HIDDEN
  >(LOADING_IMAGE);

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500, // Fade in duration
        useNativeDriver: true,
      }).start(() => {
        setState(WAIT_FOR_APP_TO_BE_READY);
      });
    }
  }, [imageOpacity, state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500, // Fade out duration
        delay: 1000, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) return null;

  return (
    <Animated.View collapsable={false} style={[style.container, { opacity: containerOpacity }]}>
      <Animated.Image
        source={require('../assets/splash-icon.png')}
        fadeDuration={0}
        onLoad={() => {
          setState(FADE_IN_IMAGE);
        }}
        style={[style.image, { opacity: imageOpacity }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: appColors.splashBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Size(250),
    height: Size(250),
  },
});
