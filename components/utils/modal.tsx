import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Dimensions, View, Modal as RNModal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
export function Modal() {
  const [visible, setVisble] = useState(false);
  const [content, setContent] = useState(null);
  const [params, setParams]: any = useState({});
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('modal', data => {
      setVisble(data.show);
      setContent(data.content || null);
      setParams(data.params || {});
    });
    return () => {
      listener.remove();
    };
  }, []);

  function dismiss() {
    if (!params.disableOutsideClose) setVisble(false);
  }
  return (
    <RNModal transparent={params.closeFromOutside != undefined ? params.closeFromOutside : true} visible={visible}>
      <TouchableWithoutFeedback onPress={dismiss}>
        <View
          style={{
            ...styles.modalStyle,
            ...params.modalStyle,
          }}
        >
          <TouchableWithoutFeedback>{content}</TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
export function showModal(
  content: () => React.JSX.Element,
  params?: { modalStyle?: any; disableOutsideClose?: boolean; transparent?: boolean },
) {
  DeviceEventEmitter.emit('modal', { show: true, content, params });
}
export function hideModal() {
  DeviceEventEmitter.emit('modal', { show: false });
}
const styles = StyleSheet.create({
  modalStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },
});
