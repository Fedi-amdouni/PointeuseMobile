/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import RnActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';
let listener: any = null;
export function ActionSheet() {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [content, setContent] = useState(null);
  const [actionSheetParams, setActionSheetParams] = useState({});
  useEffect(() => {
    if (listener) {
      listener.remove();
      listener = null;
    }
    listener = DeviceEventEmitter.addListener('actionsheet', data => {
      setContent(data.content || null);
      setActionSheetParams(data.actionSheetParams);
      if (data.show) {
        actionSheetRef.current?.show();
      } else actionSheetRef.current?.hide();
    });
    return () => {
      if (listener) {
        listener.remove();
        listener = null;
      }
    };
  }, []);
  return (
    <RnActionSheet indicatorStyle={{ backgroundColor: 'black' }} gestureEnabled {...actionSheetParams} ref={actionSheetRef}>
      {content}
    </RnActionSheet>
  );
}
export function showActionSheet(content: () => React.JSX.Element, actionSheetParams?: ActionSheetProps) {
  DeviceEventEmitter.emit('actionsheet', { show: true, content, actionSheetParams });
}
export function hideActionSheet() {
  DeviceEventEmitter.emit('actionsheet', { show: false });
}
