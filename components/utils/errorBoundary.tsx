import React, { Component } from 'react';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import { Size } from '../../utils/size';
import appColors from '../../colors';
import Button from '../form/elements/button';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from './text';
export default class ErrorBoundries extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }
  async onPress() {
    try {
      await AsyncStorage.clear();
      await RNRestart.Restart();
    } catch (e) {
      /* empty */
    }
  }
  render() {
    if (this.state.hasError && !__DEV__) {
      return (
        <Modal visible={true}>
          <View style={styles.modalWrap}>
            <View style={styles.modalStyle}>
              <Text category="H2" style={styles.title}>
                Oups, une erreur est survenue!
              </Text>
              <View>
                <Button
                  style={{ marginBottom: Size(5) }}
                  title="Redémarrer l'application"
                  onPress={() => {
                    RNRestart.Restart();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      );
    } else if (!this.state.hasError) return this.props.children;
    else return null;
  }
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

  title: {
    fontSize: Size(27),
    fontWeight: '700',
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
