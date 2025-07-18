import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated, 
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SkeletonCheckConnection from '../components/utils/skeletonCheckConnection';
import AuthenticationService from '@/services/authenticationService';
import PtgBrutService from '@/services/ptgBrutService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

async function getUserStorageKey(key: string): Promise<string> {
  const login = await AuthenticationService.getLogin();
  return `${login}_${key}`;
}

export default function SynchroScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSyncing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnim, {
            toValue: 1, 
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      colorAnim.setValue(0);
    }
  }, [isSyncing]);

  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1976d2', 'midnightblue'], 
  });

  const sync = async () => {
    // Démarre l'animation
    setIsSyncing(true);
    try {
      const storedHistory = await AsyncStorage.getItem(await getUserStorageKey('punchHistory'));
      console.log(storedHistory)
      if (storedHistory != null) {
        const parsedHistory = JSON.parse(storedHistory);
        const listPtgBrutRequest = parsedHistory.map((punch: { time: any; type: any; longitude: any; latitude: any; precision: any; }) => ({
          instPtg: new Date(punch.time).toISOString().split("Z")[0],
          tPtg: punch.type,
          longitude: punch.longitude ? punch.longitude : 0,
          latitude: punch.latitude ? punch.latitude : 0,
          precision: punch.precision ? punch.precision : 0,
          cMotifPtg: "Pointage manuel",
        }));
        const payload = { listePtgsBruts: listPtgBrutRequest };

        // Envoi la requête
        await PtgBrutService.punchIn(payload);
        await AsyncStorage.removeItem(await getUserStorageKey('punchHistory'));

        // Une fois la requête réussie, on attend 5 secondes pour afficher l'animation,
        // puis on arrête l'animation et on affiche le toast de confirmation.
        setTimeout(() => {
          setIsSyncing(false);
          if (Platform.OS === 'android') {
            ToastAndroid.show("Synchronisation terminée avec succès", ToastAndroid.SHORT);
          } else {
            Alert.alert("Synchronisation terminée avec succès");
          }
        }, 5000);
      } else {
        // S'il n'y a rien à synchroniser, on arrête l'animation immédiatement
        setIsSyncing(false);
        Alert.alert("Pas de pointages à synchroniser");
      }
    } catch (error) {
      console.error(error);
      setIsSyncing(false);
      Alert.alert("Erreur lors de la synchronisation");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <MaterialCommunityIcons name="cellphone" size={iconSize} color="#9e9e9e" />
        <View style={styles.centerContainer}>
          {isSyncing ? (
            <SkeletonCheckConnection isVisible={true} />
          ) : (
            <TouchableOpacity onPress={sync} style={styles.syncButton}>
              <MaterialCommunityIcons name="arrow-left" size={30} color="grey" style={styles.arrowLeft}/>
              <MaterialCommunityIcons name="database-sync" size={60} color="grey" />
              <MaterialCommunityIcons name="arrow-right" size={30} color="grey" style={styles.arrowRight}/>
            </TouchableOpacity>
          )}
        </View>
        <MaterialCommunityIcons name="cloud" size={iconSize} color="#9e9e9e" />
      </View>

      {!isSyncing ? (
        <Text style={styles.text}>Cliquez pour synchroniser vos pointages</Text>
      ) : (
        <Animated.Text style={[styles.textSynchro, { color: interpolatedColor }]}>
          Synchronisation en cours ...
        </Animated.Text>
      )}
    </SafeAreaView>
  );
}

const iconSize = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  centerContainer: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    padding: 20,
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: '5%',
    fontWeight: 'bold',
  },
  textSynchro: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: '5%',
    fontWeight: 'bold',
  },
  arrowLeft: {
    marginRight: 10, 
  },
  arrowRight: {
    marginLeft: 10, 
  },
});
