import axiosWithAuth from '@/config/axiosWithAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

const PtgBrutService = {
  punchIn: async (listPtgBrut: any) => {
    try {
      const token = await getToken();
      const response = await axiosWithAuth(token).post(
        "https://pointeusebe.technet-world.com/api/PtgBrut/mobile",listPtgBrut);
      return response.data;
      
    } catch (error: any) {
      console.error("Erreur lors du pointage:", error);
      throw new Error(
        error.response?.data?.message || "Une erreur est survenue lors du pointage."
      );
    }
  },

  getMyPunchHist: async(idEmp : number)=>{
    try {
      const token = await getToken();
      const response = await axiosWithAuth(token).get(
        `https://pointeusebe.technet-world.com/api/PtgBrut?IdEmp=${idEmp}`);
      return response.data;
      
    } catch (error: any) {
      console.error("Erreur lors du pointage:", error);
      throw new Error(
        error.response?.data?.message || "Une erreur est survenue lors du pointage."
      );
    }
  }
};



export default PtgBrutService;








