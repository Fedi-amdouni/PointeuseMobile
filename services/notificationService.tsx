import axiosWithAuth from '@/config/axiosWithAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List } from 'lodash';
import Config from 'react-native-config';


const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

const NotificationService = {
    getMyNotifs : async(payload : any) =>{
        try {
            const token = await getToken();
            const response = await axiosWithAuth(token).get(
              "https://pointeusebe.technet-world.com/api/Notif",payload);
            return response.data;
          } catch (error: any) {
            console.error("Erreur lors du recupéuration des notifications:", error);
            throw new Error(
              error.response?.data?.message || "Une erreur est survenue lors du recupéuration des notifications."
            );
          }
    }
}




export default NotificationService;








