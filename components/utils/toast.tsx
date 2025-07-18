/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, TouchableOpacity, DeviceEventEmitter, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Size, pixelSizeVertical } from '../../utils/size';
import ErrorIcon from '../../resources/assets/error.svg';
import SuccessIcon from '../../resources/assets/success.svg';
import Text from './text';
import appColors from '../../colors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Toast(props: ToastType) {
  
  const [position, setPosition] = useState('');
  const [title, setTitle] = useState('');
  const [ready, setReady] = useState(false);
  const [msgs, setMsgs] = useState<string[]>([]);
  const timer: any = useRef(null);
  const [category, setCategory] = useState('info');
  const show = title || msgs?.length > 0;
  const insets = useSafeAreaInsets();
  const positionY = useSharedValue(position == 'top' ? -100 : 100);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(positionY.value) }],
    };
  });
  useEffect(() => {
    positionY.value = show ? (position != 'bottom' ? insets.top : -(insets.bottom + Size(10))) : position != 'bottom' ? -100 : 100;
  }, [show, position]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('toast', data => {
      update(data);
    });
    return () => {
      listener.remove();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    update(props);
  }, [props]);

  function update(data: ToastType) {
    if ((data && typeof data == 'string') || data.title || (data.msgs && data.msgs?.length > 0)) setReady(true);
    setTitle(typeof data == 'string' ? data : data.title || '');
    setMsgs(Array.isArray(data.msgs) ? data.msgs : data.msgs ? [data.msgs] : []);
    setPosition(data.position || position);
    setCategory(data.category || '');
    if (timer.current) clearTimeout(timer.current);
    if (typeof data == 'string' || data.title) timer.current = setTimeout(onClose, data.duration || 3000);
  }

  function onClose() {
    setTitle('');
    setMsgs([]);
  }
  function byCategory() {
    switch (category) {
      case 'success':
        return {
          bgColor: appColors.successSecondary,
          borderColor: 'rgba(92, 200, 103, 0.2)',
          textColor: appColors.successPrimary,
          borderWidth: 2,
          icon: <SuccessIcon width={Size(28)} height={Size(28)} />,
        };

      default:
        return {
          bgColor: appColors.dangerSecondary,
          borderColor: 'rgba(251, 64, 38, 0.2)',
          borderWidth: 2,
          textColor: appColors.dangerPrimary,
          icon: <ErrorIcon width={Size(28)} height={Size(28)} />,
        };
    }
  }
  return (
    ready && (
      <Animated.View style={[styles.container, position != 'bottom' ? styles.top : styles.bottom, styles.absolutePosition, animatedStyle]}>
        <View style={styles.zone}>
          <TouchableOpacity
            style={{
              ...styles.toast,
              backgroundColor: byCategory().bgColor,
              borderColor: byCategory().borderColor,
              shadowColor: byCategory().textColor,
              borderWidth: byCategory().borderWidth || styles.toast.borderWidth,
            }}
            activeOpacity={4}
          >
            <View style={styles.container1}>
              <View style={styles.container2}>
                {byCategory().icon}
                <Text category="current" style={{ ...styles.title, color: byCategory().textColor }}>
                  {title}
                </Text>
              </View>
            </View>
            <View>
              {msgs.map((msg, ind) => (
                <View key={ind} style={styles.container3}>
                  <Text style={{ ...styles.msgs, color: byCategory().textColor }}>{msg}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  );
}
export function showToast(props: ToastType | string) {
  DeviceEventEmitter.emit('toast', props);
}
interface ToastType {
  title?: string;
  msgs?: string | string[];
  position?: 'top' | 'bottom';
  category?: 'error' | 'success';
  duration?: number;
  showCloseButton?: boolean;
}
const styles = StyleSheet.create({
  container: {},
  absolutePosition: { position: 'absolute', left: '1%', right: '1%', zIndex: 7 },
  toast: {
    justifyContent: 'center',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 15,
    minHeight: Size(70),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 9,
    paddingVertical: Size(9),
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  container3: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginTop: 4,
  },
  title: {
    paddingHorizontal: 7,
    color: 'white',
    fontSize: Size(15),
    flex: 1,
    marginTop: pixelSizeVertical(2),
    textAlign: 'left',
  },
  msgs: {
    color: 'white',
    textAlign: 'justify',
    fontSize: Size(10),
    flex: 1,
    fontWeight: '500',
    marginLeft: 3,
  },
  zone: { backgroundColor: 'white', width: '92%', alignSelf: 'center', marginTop: Size(10), borderRadius: 15 },
});
