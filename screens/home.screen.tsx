import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/app.navigation';
import authenticationService from '../services/authenticationService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthenticationService from '../services/authenticationService';
import dayjs from 'dayjs';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const [login, setLogin] = useState('');
  const [emp, setEmp] = useState('');

  const [myData, setMyData] = useState<Record<string, any> | null>(null);
  const [punchTime, setPunchTime] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState('');

  async function getUserStorageKey(key: string): Promise<string> {
    const login = await AuthenticationService.getLogin();
    return `${login}_${key}`;
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = await authenticationService.getLogin();
        if (userEmail) {
          setLogin(userEmail);
        }
        const emp = await AsyncStorage.getItem(await getUserStorageKey('emp'))
        if (emp != null){
          setEmp(emp)
        }
        else {
          const data = await authenticationService.myData();
          await AsyncStorage.setItem(await getUserStorageKey('emp') , data.emp)
        }
       
        const storedPunchTime = await AsyncStorage.getItem(await getUserStorageKey('punchTime'));
        const storedIsPunchedIn = await AsyncStorage.getItem(await getUserStorageKey('isPunchedIn'));

        if (storedPunchTime) {
          setPunchTime(storedPunchTime); 
        }

        if (storedIsPunchedIn) {
          setIsPunchedIn(storedIsPunchedIn); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handlePress = async (iconName: string) => {
    try {
      const userEmail = await authenticationService.getLogin();

      switch (iconName) {
        case 'Punch':
          navigation.navigate('Punch', { userEmail });
          break;
        case 'Report':
          navigation.navigate('Report', { userEmail });
          break;
        case 'BottomNavigation':
          navigation.navigate('BottomNavigation', { userEmail });
          break;
        case 'Notifs':
          navigation.navigate("Notifications");
          break;
        case 'SignOut':
          authenticationService.logout();
          const isPunchedKey = await getUserStorageKey('isPunchedIn');
          const lastPunch = await AsyncStorage.getItem(isPunchedKey);
          if (lastPunch !="true"){
            
            await AsyncStorage.setItem(await getUserStorageKey("lastTimeDetection"),new Date().toString())
            await AsyncStorage.setItem(await getUserStorageKey("lastLogDetection"),"logged out")
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem(await getUserStorageKey('emp'))
            
            navigation.navigate('SignIn');
          }
          else {
              Alert.alert('Pointage Out automatique', `Vous allez automatiquement etre pointé Out lors de la déconnexion`, [{ text: "OK" }]);
              const date = new Date().toISOString()

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
            navigation.navigate('SignIn');

            break;
          default:
            console.log(`${iconName} clicked`);
        }
    } catch (error) {
      console.error('Error in navigating:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Soyez le bienvenu {login} !</Text>
      </View>

      <Image
        style={styles.image}
        placeholder={require('../assets/images/track.png')}
        contentFit="cover"
        transition={1500}
      />

      <View style={styles.iconGrid}>
      <View  style={styles.userDetails}>
        <Text style={[styles.nameHeader, { marginBottom: 20 }]}>{emp}</Text>
        <Text >Dernier Pointage: </Text>
        <Text style={[styles.punchHeader, { color: isPunchedIn === 'true' ? 'green' : 'red' }]}>
          {isPunchedIn === 'true' ? 'In à' : 'Out à'} {punchTime}
        </Text>

      </View>
        <TouchableOpacity onPress={() => handlePress('Punch')} style={styles.iconButton}>
          <Icon name="check" size={80} color="#4CAF50" />
          <Text style={styles.iconText}>Pointage</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('Report')} style={styles.iconButton}>
          <Ionicons name="document-text-outline" size={80} color="#4CAF50" />
          <Text style={styles.iconText}>Rapport</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('SignOut')} style={styles.iconButton}>
          <Icon name="sign-out" size={80} color="#4CAF50" />
          <Text style={styles.iconText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    flex: 0.4,
    width: '100%',
    backgroundColor: '#0553',
  },
  iconGrid: {
    flex: 0.7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    margin: 15,
    width: '42%',
    height: '40%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius : 20
  },
  userDetails: {
    alignItems: 'center',
    margin: 15,
    width: '42%',
    height: '40%',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  nameHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'midnightblue'
  },
  profileHeader: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  punchHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color : "#4CAF50"
  },
});

export default HomeScreen;
