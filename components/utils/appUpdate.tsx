import { StyleSheet, Modal, View, Dimensions, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
//import VersionCheck from 'react-native-version-check';
import { Size } from '../../utils/size';
import Button from '../form/elements/button';
import appColors from '../../colors';
import Config from 'react-native-config';
import Text from './text';

export default function AppUpdate(props: any) {
  const [storeUrl, setStoreUrl] = useState('');
  const [lastVersion, setLastVersion] = useState('');
  const [show, setShow] = useState(false);
  /* useEffect(() => {
    (async () => {
      try {
        if (__DEV__ || Config.env != 'production') return;
        const res = await VersionCheck.needUpdate();
        if (res && res.isNeeded) {
          setStoreUrl(res.storeUrl);
          setLastVersion(res.latestVersion);
          setShow(true);
        } else {
          setStoreUrl('');
          setShow(false);
        }
      } catch (e) {
      }
    })();
  }, []); */
  return show ? (
    <Modal visible={show}>
      <View style={styles.modalWrap}>
        <View style={styles.modalStyle}>
          <Text category="H2" style={styles.title}>
            Mise à jour requise
          </Text>
          <Text style={styles.textStyle}>La version {lastVersion} est disponible</Text>
          <View>
            <Button
              style={{ marginBottom: Size(5) }}
              title="Mettre à jour"
              onPress={() =>
                Linking.openURL(storeUrl)
                  .then(() => {
                    setShow(false);
                  })
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  .catch(() => {})
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  ) : (
    props.children
  );
}
const styles = StyleSheet.create({
  modalWrap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textStyle: {
    fontSize: Size(19),
    fontWeight: '600',
    marginBottom: Size(20),
    color: appColors.primary100,
  },
  title: {
    fontSize: Size(27),
    fontWeight: '600',
    marginBottom: Size(20),
    color: appColors.textDark,
  },
  modalStyle: {
    width: '94%',
    paddingVertical: Size(40),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
});
