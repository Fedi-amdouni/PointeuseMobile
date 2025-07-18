import { RootStackParamList } from "@/navigation/app.navigation";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';

type NotificationScreenRouteProp = RouteProp<RootStackParamList, 'Notifications'>;
type NotificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

interface NotificationScreenProps {
  route: NotificationScreenRouteProp;
  navigation: NotificationScreenNavigationProp;
}

interface NotificationItem {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      message: "Vous avez accumulé 3 retards ce mois-ci. Merci de respecter les horaires.",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: 2,
      message: "Votre demande de congé du 10 au 15 mars a été approuvée.",
      timestamp: "5 hours ago",
      read: false
    },
    {
      id: 3,
      message: "Votre temps de pause dépasse la durée autorisée. Merci de reprendre votre poste.",
      timestamp: "1 day ago",
      read: true
    },
    {
      id: 4,
      message: "Votre responsable a demandé une justification pour votre retard du 12 février.",
      timestamp: "2 days ago",
      read: true
    },
    {
      id: 5,
      message: "N'oubliez pas la réunion d'équipe aujourd'hui à 14h.",
      timestamp: "3 days ago",
      read: true
    },
  ]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((notification) => (
          <View 
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadNotification
            ]}
          >
            
            <View style={styles.notificationContent}>
              <Text style={styles.messageText}>{notification.message}</Text>
              <Text style={styles.timeText}>{notification.timestamp}</Text>
            </View>

            {!notification.read && <View style={styles.unreadIndicator} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
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
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#3D5A80',
  },
  markAllText: {
    color: '#3D5A80',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#F8F9FE',
    borderLeftWidth: 4,
    borderLeftColor: '#3D5A80',
  },
  notificationIcon: {
    marginRight: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#2C3A4B',
    marginBottom: 4,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#7C8DA6',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    marginLeft: 10,
  },
});