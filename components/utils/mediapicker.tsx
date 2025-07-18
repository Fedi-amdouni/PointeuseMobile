import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Size } from '../../utils/size';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { hideActionSheet, showActionSheet } from './actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import appColors from '../../colors';
import DocumentPicker from 'react-native-document-picker';
import Text from './text';
import { strings } from '../../contexts/app.context';

export default function MediaPicker(props?: MediaPickerType) {
  async function onChoose(picker?: boolean, videocam?: boolean) {
    try {
      let res: any = null;
      if (!picker)
        res = await ImagePicker.openCamera({
          cropping: !videocam,
          mediaType: videocam ? 'video' : 'photo',
          cropperCancelText: strings.cancel,
          cropperChooseText: strings.confirm,
        });
      else {
        if (props?.mediaType == 'any')
          if (props.multiple)
            res = await DocumentPicker.pick({
              type: [DocumentPicker.types.video, DocumentPicker.types.images],
              allowMultiSelection: true,
            });
          else
            res = await DocumentPicker.pickSingle({
              type: [DocumentPicker.types.video, DocumentPicker.types.images],
            });
        else if (props?.mediaType == 'video')
          if (props.multiple)
            res = await DocumentPicker.pick({
              type: DocumentPicker.types.video,
              allowMultiSelection: true,
            });
          else
            res = await DocumentPicker.pickSingle({
              type: DocumentPicker.types.video,
            });
        else
          res = await ImagePicker.openPicker({
            cropping: true,
            multiple: props?.multiple,
            maxFiles: props?.maxFile,
            cropperCancelText: strings.cancel,
            cropperChooseText: strings.confirm,
          });
      }
      if (props?.onChoose) props.onChoose(res);
    } catch (e) {
      if (props?.onError) props.onError(e);
      /* empty */
    }
    hideActionSheet();
  }

  return (
    <View style={{ ...styles.subContainer, paddingVertical: Size(30) }}>
      {props?.mediaType != 'video' && (
        <TouchableOpacity onPress={onChoose.bind(onChoose, false, false)} style={{ ...styles.button, ...styles.btnMargin }}>
          <MatIcon color={appColors.primary100} name="camera-alt" size={Size(32)} />
          <Text category="exergue" style={styles.text}>
            Caméra
          </Text>
        </TouchableOpacity>
      )}
      {props?.mediaType && props?.mediaType != 'photo' && (
        <TouchableOpacity onPress={onChoose.bind(onChoose, false, true)} style={{ ...styles.button, ...styles.btnMargin }}>
          <MatIcon color={appColors.primary100} name="videocam" size={Size(32)} />
          <Text category="exergue" style={styles.text}>
            Video
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onChoose.bind(onChoose, true, false)} style={styles.button}>
        <MatIcon color={appColors.primary100} name="image" size={Size(32)} />
        <Text category="exergue" style={styles.text}>
          Galerie
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export function showMediaPicker(props?: MediaPickerType) {
  return new Promise((resolve, reject) => {
    showActionSheet(() => <MediaPicker onError={(error: any) => reject(error)} onChoose={(res: any) => resolve(res)} {...props} />, {
      containerStyle: styles.container,
      onClose: () => reject(new Error('action sheet close')),
    });
  });
}
interface MediaPickerType {
  mediaType?: 'photo' | 'video' | 'any';
  multiple?: boolean;
  maxFile?: number;
  onChoose?: Function;
  onError?: Function;
}
const styles = StyleSheet.create({
  container: { backgroundColor: appColors.screenBackground, padding: 0 },
  indicatorStyle: { backgroundColor: 'black', height: 0 },
  subContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 'auto',
    paddingStart: Size(20),
    alignItems: 'center',
    paddingVertical: Size(20),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  btnMargin: {
    marginBottom: 20,
  },
  text: {
    fontSize: Size(19),
    marginStart: Size(18),
  },
});
