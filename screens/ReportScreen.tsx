import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/app.navigation';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import PtgBrutService from '@/services/ptgBrutService';
import AuthenticationService from '@/services/authenticationService';
import authenticationService from '@/services/authenticationService';

type ReportScreenRouteProp = RouteProp<RootStackParamList, 'Report'>;
type ReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Report'>;

interface ReportScreenProps {
  route: ReportScreenRouteProp;
  navigation: ReportScreenNavigationProp;
}

interface EmployeeHours {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  inTime: string;
  day: string;
}
const orderedDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const daysMap: Record<string, string> = {
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
  Sunday: 'Dimanche',
};

const ReportScreen: React.FC<ReportScreenProps> = ({ route }) => {
  const { userEmail } = route.params;
  const [employeeHours, setEmployeeHours] = useState<EmployeeHours[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
    orderedDays.reduce((acc, day) => ({ ...acc, [day]: false }), {})
  );
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(new Date);
  const [idEmp, setIdEmp] = useState<number | null>(null);

  const handleWeekSelection = () => {
    DateTimePickerAndroid.open({
      value: selectedWeekStart || new Date(),
      mode: 'date',
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          const dayOfWeek = selectedDate.getDay();
          const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          const monday = new Date(selectedDate);
          monday.setDate(selectedDate.getDate() + mondayOffset);
          monday.setHours(0, 0, 0, 0); 
          setSelectedWeekStart(monday);
        }
      }
    });
  };

  const loadWorkHours = async () => {
    showLoading("Recuperation des pointages...")
    
    try {
      const data = await authenticationService.myData();
      setIdEmp(data.idEmp)
      if (idEmp != null)
      {
        const storedHistory = await PtgBrutService.getMyPunchHist(idEmp)
        if (storedHistory && selectedWeekStart) {
          const history = storedHistory;
          const employeeHoursList: EmployeeHours[] = [];
          let inTime: Date | null = null;
      
          const weekEnd = new Date(selectedWeekStart);
          weekEnd.setDate(selectedWeekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
      
          history.forEach((entry: { tPtg: string; instPtg: string }) => {
            const entryDate = new Date(entry.instPtg);
            entryDate.setHours(0, 0, 0, 0); 
      
            if (entryDate >= selectedWeekStart && entryDate<= weekEnd) {
              if (entry.tPtg === 'IN') {
                inTime = new Date(entry.instPtg);
              } else if (entry.tPtg === 'OUT' && inTime) {
                const outTime = new Date(entry.instPtg);
                const diffInSeconds = Math.round((outTime.getTime() - inTime.getTime()) / 1000);
                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;
      
                const dayEnglish = inTime.toLocaleDateString('en-US', { weekday: 'long' });
                const dayFrench = daysMap[dayEnglish] || dayEnglish;
      
                employeeHoursList.push({
                  totalHours: hours,
                  totalMinutes: minutes,
                  totalSeconds: seconds,
                  inTime: inTime.toLocaleString('fr-FR'),
                  day: dayFrench
                });
      
                inTime = null;
              }
            }
          });
          setEmployeeHours(employeeHoursList);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec du chargement des heures de travail');
      console.error('Erreur lors du chargement des heures :', error);
    }
    hideLoading()

  };



  useEffect(() => {
    if (selectedWeekStart) {
      loadWorkHours();
    }
  }, [selectedWeekStart]);

  const groupByDay = (data: EmployeeHours[]) => {
    return data.reduce((acc: { [key: string]: EmployeeHours[] }, item) => {
      const day = item.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByDay(employeeHours);

  const toggleDay = (day: string) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const renderDayItem = ({ item: day }: { item: string }) => {
    const isExpanded = expandedDays[day];
    const dayEntries = groupedData[day] || [];
  
    // Calcul de la somme des durées pour la journée
    const totalSeconds = dayEntries.reduce((acc, entry) => acc + (entry.totalHours * 3600) + (entry.totalMinutes * 60) + entry.totalSeconds, 0);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSec = totalSeconds % 60;
  
    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity onPress={() => toggleDay(day)} style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: isExpanded ? 'green' : 'grey' }]}>
            {day} 
          </Text>
          <Text style={[styles.totalHeures, { color: isExpanded ? 'green' : '#4A5568' }]}>{dayEntries.length > 0 ? ` ${totalHours}h ${totalMinutes}m ${totalSec}s` : ''}</Text>
          <Icon name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} size={24}  color={isExpanded ? 'green' : '#4A5568'}/>
        </TouchableOpacity>
  


        {isExpanded && (
          dayEntries.length > 0 ? (
            dayEntries.map((entry, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemTime}>
                  In : {entry.inTime}
                </Text>
                <Text style={styles.itemDuration}>
                  Durée: {entry.totalHours}h {entry.totalMinutes}m {entry.totalSeconds}s
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEntriesText}>Pas de pointages pour ce jour-là</Text>
          )
        )}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.title}>Rapport des pointages</Text>
  </View>

  <View style={styles.content}>
    <TouchableOpacity onPress={handleWeekSelection} style={styles.button}>
      <Icon name="calendar-today" size={20} color="white" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>
        {selectedWeekStart ? `La semaine de ${selectedWeekStart.toDateString()}` : 'Sélectionner une semaine'}
      </Text>
    </TouchableOpacity>

    <FlatList
      data={orderedDays}
      renderItem={renderDayItem}
      keyExtractor={(day) => day}
    />
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D5A80',
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight : 'bold',
    color : "grey",

  },
  sectionHeaderIcon: {
    fontSize: 16,
    color: '#4A5568',
  },
  item: {
    backgroundColor: '#EEEEEE',
    padding: 15,
    borderRadius: 6,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemTime: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  itemDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  noEntriesText: {
    color: '#718096',
    fontStyle: 'italic',
    padding: 15,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#4335A7', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, 
    marginTop : '4%'
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10, 
  },
  
  buttonIcon: {
    color: 'white',
  },
  totalHeures:{
    color: 'black',
    fontWeight: "bold",
    textAlign: 'right',
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content : {
    padding : 20,
    flex: 1
  }
  
});

export function showLoading(title?: string) {
  DeviceEventEmitter.emit('loading', { title, show: true });
}
export function hideLoading() {
  DeviceEventEmitter.emit('loading', { show: false });
}

export default ReportScreen;