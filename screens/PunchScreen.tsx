import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, SafeAreaView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/app.navigation';
import * as Location from 'expo-location';
import { hideLoading, showLoading } from '@/components/utils/loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import authenticationService from '../services/authenticationService';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

type PunchScreenRouteProp = RouteProp<RootStackParamList, 'Punch'>;
type PunchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Punch'>;

interface PunchScreenProps {
  route: PunchScreenRouteProp;
  navigation: PunchScreenNavigationProp;
}

const PunchScreen: React.FC<PunchScreenProps> = ({ route,navigation  }) => {

  const [date, setDate] = useState(new Date());

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [idEmp, setIdEmp] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(true);

  const [history, setHistory] = useState<
    { type: string; time: string; placeName?: string }[]
  >([]);
  const { userEmail } = route.params;




  const getUserStorageKey = (key: string) => `${userEmail}_${key}`;


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return null;
      }
  
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      return location;
    } catch (error) {
      console.error('Error fetching current location:', error);
      setErrorMsg('Failed to retrieve location.');
      return null;
    }
  };

  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const lat = Number(latitude);
      const lon = Number(longitude);
  
      if (isNaN(lat) || isNaN(lon)) {
        throw new Error('Latitude or longitude is not a valid number.');
      }
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
        {
          headers: {
            'User-Agent': 'PointeuseMobile (fedyamd@gmail.com)',
          },
        }
      );
      const data = await response.json();
  
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  };
  
  const loadPunchData = async (date: any) => {
    try {
      const data = await authenticationService.myData();
      setIdEmp(data.idEmp)
      const storedIsPunchedIn = await AsyncStorage.getItem(getUserStorageKey('isPunchedIn'));
      const storedPunchTime = await AsyncStorage.getItem(getUserStorageKey('punchTime'));
      const storedHistory = await AsyncStorage.getItem(getUserStorageKey('punchHistoryToday'));

      if (storedIsPunchedIn == "true" || storedIsPunchedIn == null) {
        setIsPunchedIn(storedIsPunchedIn === 'true');
      } else {
        setIsPunchedIn(false);
      }
  
      if (storedPunchTime !== null) {
        setPunchTime(storedPunchTime);
      }
  
      if (storedHistory !== null) {
        const parsedHistory = JSON.parse(storedHistory);
  
        const targetDate = new Date(date); 
        const targetDateString = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}`;
  
        const filteredHistory = parsedHistory.filter((item: { time: string | number | Date; }) => {
          const itemDate = new Date(item.time);
          const itemDateString = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}-${itemDate.getDate().toString().padStart(2, '0')}`;
          return itemDateString === targetDateString;
        });
  
        setHistory(filteredHistory);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec du chargement des données');
      console.error('Erreur lors du chargement des données :', error);
    }
  };

  useEffect(() => {

    let datee = new Date(date).toISOString(); 
    loadPunchData(datee);

  }, [idEmp]);


  const savePunchData = async (punchIn: boolean, time: string, longitude:any ,latitude:any ,precision:any ,placeName?: string ) => {
    try {
      const currentTimeISO = new Date().toISOString();

      const newHistory = [
        ...history,
        { type: punchIn ? 'IN' : 'OUT', time: currentTimeISO, placeName, longitude:longitude ,latitude:latitude ,precision:precision},
      ];
      await AsyncStorage.setItem(getUserStorageKey('isPunchedIn'), punchIn.toString());
      await AsyncStorage.setItem(getUserStorageKey('punchTime'), dayjs(currentTimeISO).locale('fr').format("MM/DD/YYYY HH:mm:ss"));
      await AsyncStorage.setItem(getUserStorageKey('punchHistory'), JSON.stringify(newHistory));
      await AsyncStorage.setItem(getUserStorageKey('punchHistoryToday'), JSON.stringify(newHistory));

      setHistory(newHistory);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la sauvegarde des données');
      console.error('Erreur lors de la sauvegarde des données :', error);
    }
  };

  const handlePunchIn = async () => {


    const currentTime = dayjs(new Date()).locale('fr').format("MM/DD/YYYY HH:mm:ss");
    setIsPunchedIn(true);

    setPunchTime(currentTime);
  
    try {
      showLoading("Punching In...")
      const location = await getCurrentLocation();
      if (location) {
        const placeName = await reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
        
        await savePunchData(true, currentTime,location.coords.longitude,location.coords.latitude,location.coords.accuracy, placeName);
        await AsyncStorage.setItem(getUserStorageKey("punchTime"),currentTime)
        const instPtg = new Date().toISOString().split("Z")[0];

        const ptgBrutRequest = {
          instPtg: instPtg,
          tPtg: "IN",
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          precision: location.coords.accuracy,
          cMotifPtg: "Pointage manuel",
        };
        const listPtgBrutRequest =[ptgBrutRequest]
        const payload = {
          "listePtgsBruts": listPtgBrutRequest 
        };
        hideLoading();
        Alert.alert('Pointage réussi', `Vous avez pointé "In" à ${currentTime}.`);


        
      } else {
        setLoading(false);
        Alert.alert('Erreur', 'Impossible d’obtenir la localisation.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors du pointage.');
      console.error('Error during punch-in:', error);
    }
  };


  const handlePunchOut = async () => {
    const currentTime = dayjs(new Date()).locale('fr').format("MM/DD/YYYY HH:mm:ss");
    setIsPunchedIn(false);
    setPunchTime(currentTime);

    try {
      showLoading("Punching Out...")
      const location = await getCurrentLocation();
      if (location) {
        const placeName = await reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
  
        await savePunchData(false, currentTime,location.coords.longitude,location.coords.latitude,location.coords.accuracy, placeName);
        await AsyncStorage.setItem("punch","out")
        hideLoading()
        Alert.alert('Pointage réussi', `Vous avez pointé "Out" à ${currentTime}.`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la récupération de la localisation');
      console.error('Error during punch-in:', error);
    }
  };

  const renderHistoryItem = ({ item }: { item: { type: string; time: string; placeName?: string } }) => {
    const formattedTime = dayjs(item.time).locale('fr').format("MM/DD/YYYY HH:mm:ss");
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyTextTitle}>{`${item.type} à ${formattedTime}`}</Text>
        {item.placeName && <Text style={styles.historyText}>Lieu : {item.placeName}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion de Pointage</Text>
      {showToast && (<View style={[styles.statusContainer, isPunchedIn ? styles.inStatus : styles.outStatus]}>
        <Text style={styles.statusText}>{isPunchedIn ? `Pointé "In" à : ${punchTime}` : `Pointé "Out" à : ${punchTime}`}</Text>
      </View> )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.punchInButton]}
          onPress={handlePunchIn}
          disabled={isPunchedIn}
        >
          <Text style={styles.buttonText}>Entrée</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.punchOutButton]}
          onPress={handlePunchOut}
          disabled={!isPunchedIn}
        >
          <Text style={styles.buttonText}>Sortie</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>

        <Text style={styles.historyTitle}>Historique des Pointages</Text>
        <SafeAreaView>
          <View>
          <View  style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              value={`Aujourd'hui : ${dayjs(date).locale('fr').format('MM/DD/YYYY')}`}
              editable={false} 
            />
            <Icon name="calendar-today" size={20}/>
          </View>
          </View>
        </SafeAreaView>

        <FlatList
          data={[...history].sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())} // Sort in descending order
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

      </View>


      <TouchableOpacity
           style={styles.reportButton}
           onPress={() => navigation.navigate('Report', { userEmail })}
           >
        <Text style={styles.buttonText}>Voir Rapports</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 25,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inStatus: {
    backgroundColor: '#E0F7EF',
    borderColor: '#38A169',
    borderWidth: 2,
  },
  outStatus: {
    backgroundColor: '#FDE2E2',
    borderColor: '#E53E3E',
    borderWidth: 2,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A202C',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  punchInButton: {
    backgroundColor: '#38A169',
  },
  punchOutButton: {
    backgroundColor: '#E53E3E',
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  historyContainer: {
    flex: 1,
    width: '100%',
    marginTop: 5,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3D5A80',
    marginBottom: 15,
    textAlign: 'center',
  },
  historyItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  historyText: {
    fontSize: 16,
    color: '#2D3748',
  },
  historyTextTitle:{
    fontSize: 16,
    color: '#2D3748',
    fontWeight : "bold"
  },
  separator: {
    height: 10,
  },
  clearHistoryButton: {
    backgroundColor: '#E53E3E',
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
    width:"100%",
    alignItems: 'center',

  },
  reportButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width:"100%",

  },
  dateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B2C9AD',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    backgroundColor: '#B2C9AD',
    height: 50, 
    fontWeight: 'bold'
  },
  logout : {
    right : "50%"
  },
});

export default PunchScreen;
