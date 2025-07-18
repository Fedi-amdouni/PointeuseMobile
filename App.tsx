import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, AppState } from 'react-native';
import AppNavigation from './navigation/app.navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import dayjs from 'dayjs';
import { hideLoading, showLoading } from '@/components/utils/loading';
import AuthenticationService from './services/authenticationService';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import netInfo from '@react-native-community/netinfo';
import PtgBrutService from './services/ptgBrutService';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const BACKGROUND_FETCH_TASK = 'background-fetch';
const LOCATION_TASK_NAME = 'background-location-task';


async function getUserStorageKey(key: string): Promise<string> {
  const login = await AuthenticationService.getLogin();
  return `${login}_${key}`;
}

async function handlePunchOut(
  stateCallbacks?: {
    setPunchTime?: (time: string) => void;
    setHistory?: (history: any[]) => void;
    setIsPunchedIn?: (val: boolean) => void;
  }
) {
  const currentTime = dayjs(new Date())
    .locale('fr')
    .format('MM/DD/YYYY HH:mm:ss');

  if (stateCallbacks?.setPunchTime) {
    stateCallbacks.setPunchTime(currentTime);
  }

    showLoading('Punching Out...');

  const placeName = 'unknown';
  const currentTimeISO = new Date().toISOString();

  const historyKey = await getUserStorageKey('punchHistory');
  const storedHistory = await AsyncStorage.getItem(historyKey);
  const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];

  const newHistory = [
    ...currentHistory,
    { type: 'Out', time: currentTimeISO, placeName },
  ];

  await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));

  if (stateCallbacks?.setHistory) {
    stateCallbacks.setHistory(newHistory);
    
  }
  await AsyncStorage.setItem(await getUserStorageKey('punchHistoryToday'), JSON.stringify(newHistory));

  const isPunchedKey = await getUserStorageKey('isPunchedIn');
  await AsyncStorage.setItem(isPunchedKey, 'false');
  const punchTimeKey = await getUserStorageKey('punchTime');
  await AsyncStorage.setItem(
    punchTimeKey,
    dayjs(currentTimeISO).locale('fr').format('MM/DD/YYYY HH:mm:ss')
  );

  if (stateCallbacks?.setIsPunchedIn) {
    stateCallbacks.setIsPunchedIn(false);
  }

    hideLoading();
    Alert.alert('Pointage réussi', `Vous avez pointé "Out" à ${currentTime}.`);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Services de localisation désactivés",
        body: "Vous allez être pointé OUT car les services de localisation sont désactivés.",
      },
      trigger: null,
    });

}


TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Background fetch task running');

    //Punch Out Automatique
    const isPunchedInKey = await getUserStorageKey("isPunchedIn");
    const isPunchedIn = await AsyncStorage.getItem(isPunchedInKey);

    if (isPunchedIn === 'true') {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      try {
        const location = await Location.hasServicesEnabledAsync();

        await AsyncStorage.setItem(await getUserStorageKey("lastTimeDetection"),new Date().toString())

        if (location == false) { 
          console.log('Background location permission not granted');
           await handlePunchOut();

        }

      }catch(error){
        console.error("Unexpected error in location detection:", error);
      }      
    } else {
      console.log('User is not punched in. No location update required.');
    }

    //Synchronisation 
    try {
      const netState = await netInfo.fetch();
      const storedHistory = await AsyncStorage.getItem(await getUserStorageKey('punchHistory'));  
      const lastTimeSyncString = await AsyncStorage.getItem(await getUserStorageKey("lastTimeSync"));
      const lastTimeSync = lastTimeSyncString ? dayjs(lastTimeSyncString) : dayjs(0); 

      const now = dayjs();
      const noon = dayjs().hour(9).minute(50).second(0);
      const night = dayjs().hour(18).minute(0).second(0);


      if ( !lastTimeSync.isSame(now, 'day') || (now.isAfter(night) && (lastTimeSync.isBefore(night))) || (now.isAfter(noon) && (lastTimeSync.isBefore(noon))))
        {
          if (netState.isConnected && storedHistory != null) {
            const parsedHistory = JSON.parse(storedHistory);
    
            const listPtgBrutRequest = parsedHistory.map( (punch: { time: any; type: any; longitude: any; latitude: any; precision: any; }) => ({
              
              instPtg: new Date(punch.time).toISOString().split("Z")[0],
              tPtg: punch.type,
              longitude: punch.longitude ? punch.longitude : 0,
              latitude: punch.latitude ? punch.latitude : 0,
              precision: punch.precision ? punch.precision : 0,
              cMotifPtg: "Pointage manuel",
            }));
            const payload = {
              listePtgsBruts: listPtgBrutRequest,
            };
          
            await PtgBrutService.punchIn(payload) 
            await AsyncStorage.removeItem(await getUserStorageKey('punchHistory'));   
          }
          await AsyncStorage.setItem(await getUserStorageKey("lastTimeSync"), now.toISOString());
        }
  
    } catch (error) {
      console.error("Error checking network state:", error);
    }
    
  

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Error in background fetch task:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});


async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 120, 
    stopOnTerminate: false,
    startOnBoot: true,
  });
}


async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}



export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { type: string; time: string; placeName?: string }[]
  >([]);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    registerBackgroundFetchAsync().catch((err) =>
      console.error('Error registering background fetch task:', err)
    );
    return () => {
      unregisterBackgroundFetchAsync().catch((err) =>
        console.error('Error unregistering background fetch task:', err)
      );
    };
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAppReady(true);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {

    const checkLocationServices = async (): Promise<boolean> => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationEnabled(false);
        return false;
      }
      try {
        const location = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocationEnabled(true);
        return true;
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationEnabled(false);
        return false;
      }
    };

    const intervalId = setInterval(async () => {
      const isPunchedKey = await getUserStorageKey('isPunchedIn');
      const lastPunch = await AsyncStorage.getItem(isPunchedKey);
      if (lastPunch === 'true') {
        setIsPunchedIn(true);
      }

      if (isPunchedIn) {
        const locationAvailable = await checkLocationServices();
        if (!locationAvailable) {
          console.log(
            "Services de localisation désactivés. Exécution du pointage 'Out'."
          );
          await handlePunchOut({
            setPunchTime,
            setHistory,
            setIsPunchedIn,
          });
        }
      }
    }, 120000);

    return () => clearInterval(intervalId);
  }, [isPunchedIn]);
  

  useEffect(() => {

    const timeDetect =  setInterval(async() =>{
      const isPunchedIn = await AsyncStorage.getItem(await getUserStorageKey('isPunchedIn'))
      if (isPunchedIn){
        const time = new Date().toISOString();
        await AsyncStorage.setItem(await getUserStorageKey("lastTimeDetection"),time)
      }      
    },10000)
    return () => clearInterval(timeDetect);

  }, []);






  useEffect(() => {
    const checkLastLog = async () => {
      const lastLogDetection = await AsyncStorage.getItem(await getUserStorageKey('lastLogDetection'))

      const isPunchedIn = await AsyncStorage.getItem(await getUserStorageKey('isPunchedIn'))
      const myLastTimeDetection = await getUserStorageKey('lastTimeDetection');
      const lastTimeDetection = await AsyncStorage.getItem(myLastTimeDetection);
      if (lastTimeDetection == null) {
        await AsyncStorage.setItem(await getUserStorageKey("lastTimeDetetion"), new Date().toISOString())
      }
  

      if (lastLogDetection == "logged in" && isPunchedIn == "true"){
        if(lastTimeDetection != null)
        {
          const date = new Date(lastTimeDetection).toISOString()

          const placeName = 'unknown';
        
          const historyKey = await getUserStorageKey('punchHistory');
          const storedHistory = await AsyncStorage.getItem(historyKey);
          const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
        
          const newHistory = [
            ...currentHistory,
            { type: 'Out', time: date, placeName },
          ];
        
          await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));
        
          const isPunchedKey = await getUserStorageKey('isPunchedIn');
          await AsyncStorage.setItem(isPunchedKey, 'false');
          const punchTimeKey = await getUserStorageKey('punchTime');
          await AsyncStorage.setItem(
            punchTimeKey,
            dayjs(date).locale('fr').format('MM/DD/YYYY HH:mm:ss')
          );
      }
    }
  }

  checkLastLog();   
  }, []);




  return (
    <View style={styles.container}>
      <AppNavigation />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
