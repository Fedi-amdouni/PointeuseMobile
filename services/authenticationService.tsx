import axiosWithAuth from '@/config/axiosWithAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
    login: string;
    mdp: string;
    identifSociete : string
}


const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};


const AuthenticationService = {

  getLogin: async (): Promise<any> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token)
      { 
        const decoded: any = jwtDecode(token);
        const login = decoded?.login;
        return login
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  },

    login: async (credentials: LoginCredentials): Promise<any> => {
        try {
          const response = await axios.post(
            "https://pointeusebe.technet-world.com/api/connexion",
            credentials
            ,{
              headers: {
              "X-Code-Client": credentials.identifSociete
              }
            }
          );          
          AsyncStorage.setItem("token",response.data["jetonDto"].jeton)
          return response;
        } catch (error: any) {
          console.error("Erreur lors de la connexion:", error);
          throw new Error(
            error.response?.data?.message || "Une erreur est survenue lors de la connexion."
          );
        }
      },


      logout: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = axiosWithAuth(token).post(
                "https://pointeusebe.technet-world.com/api/connexion/deconnecter",
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );

            return response;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Une erreur est survenue lors de la déconnexion."
            );
        }
      },

      myData : async() => {
        try{
          const token = await getToken();
          const login = await AuthenticationService.getLogin();
          const response = await axiosWithAuth(token).get(
            `https://pointeusebe.technet-world.com/api/Utilisateur/${login}`);
            return response.data;
        }
        catch(error:any){
          throw new Error(
            error.response?.data?.message || "Une erreur est survenue lors de retrieve du data."
        );
        }
      }
    

};







export default AuthenticationService;
