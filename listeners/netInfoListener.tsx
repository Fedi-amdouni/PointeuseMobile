import netInfo from '@react-native-community/netinfo';

netInfo.addEventListener(async state => {
    if (state.isConnected) {
      try {
        console.log("Device is connected")
      } catch (error) {
        console.error('Erreur réseau lors de la vérification de session', error);
      }
    }
  });