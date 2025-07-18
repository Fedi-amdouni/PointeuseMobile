import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosWithAuth = (authToken: any) => {
    const instance = axios.create({
        baseURL: apiUrl
    });

    instance.interceptors.request.use(
        (config) => {
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export default axiosWithAuth;