import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
interface extraParamsType {
  extraParams: {
    showProgress?: boolean | string;
    showErrorMsg?: boolean;
    cache?: { key?: string; expiry: number; clean?: boolean; perSession?: boolean } | number;
  };
}
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D> & extraParamsType): Promise<R>;
}
const axiosInstance: CustomAxiosInstance = axios.create({
  baseURL: Config.server_url + '/api/',
});
export default axiosInstance;
