import { useEffect, useRef, useState } from 'react';
import { strings, useAppContext } from '../../contexts/app.context';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '../../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hideLoading, showLoading } from './loading';
import { showToast } from './toast';

export default function HttpInterceptor({ children }: any) {
  const { appInfos, setAppInfos } = useAppContext();
  const feedback = useRef({ count: 0, progressMsg: '', status: 1, statusMsg: '' });
  const [ready, setready] = useState(false);
  useEffect(() => {
    const resInterceptor = axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);
    const reqInterceptor = axiosInstance.interceptors.request.use(requestInterceptor, errorInterceptor);
    setready(true);
    return () => {
      axiosInstance.interceptors.response.eject(resInterceptor);
      axiosInstance.interceptors.request.eject(reqInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInfos.token]);
  async function requestInterceptor(request: InternalAxiosRequestConfig) {
    if (appInfos.token) request.headers.Authorization = 'bearer ' + appInfos.token;
    const extraParams = (request as any).extraParams;
    if (extraParams?.showProgress != false) {
      handleLoading(true, extraParams?.showProgress);
    }
    if (extraParams?.cache && request.method == 'get') {
      const cacheRequest = await handleCacheRequest(request);
      return cacheRequest;
    }
    return request;
  }

  async function responseInterceptor(response: AxiosResponse) {
    const extraParams = (response.config as any).extraParams;
    if (extraParams?.cache && response.config.method == 'get') {
      await handleCacheResponse(response);
    }
    if (extraParams?.showProgress != false) handleLoading();
    return response;
  }

  async function errorInterceptor(error: AxiosResponse) {
    const extraParams = (error?.config as any)?.extraParams;
    if (extraParams?.showProgress != false) handleLoading();
    handleErrors(error);
    return Promise.reject(error);
  }

  function handleLoading(isrequest = false, showProgress?: any) {
    const loading = feedback.current;
    loading.count = isrequest ? loading.count + 1 : loading.count - 1 >= 0 ? loading.count - 1 : 0;
    if (!isrequest) loading.progressMsg = loading.count <= 1 ? '' : loading.progressMsg;
    else loading.progressMsg = typeof showProgress == 'string' && !loading.progressMsg ? showProgress : loading.progressMsg;
    if (loading.count == 0) hideLoading();
    else showLoading(loading.progressMsg);
  }
  function handleErrors(error: any) {
    if (error.code == 'ERR_NETWORK') {
      showToast({
        category: 'error',
        title: strings.networkerror,
        position: 'top',
        duration: 4000,
      });
    }
    if (error?.response?.status) {
      const status = error?.response?.status;
      if (status >= 500) {
        showToast({
          category: 'error',
          title: strings.servererror,
          position: 'top',
          duration: 4000,
        });
      }
      if (status == 401) {
        setAppInfos({ user: null, token: null });
      }
    }
  }
  async function handleCacheRequest(request: InternalAxiosRequestConfig) {
    const extraParams = (request as any).extraParams;
    const cache = extraParams.cache;
    const { method, url, params, headers } = request;
    let key = cache.key || `${method}:${url}${params ? ':' + JSON.stringify(params) : ''}`;
    if (extraParams.perSession != false && headers.Authorization) key += ':' + headers.Authorization;
    if (cache.clean) AsyncStorage.removeItem(key);
    else {
      try {
        const cachedResponse = await AsyncStorage.getItem(key);
        if (cachedResponse) {
          const cachedData = JSON.parse(cachedResponse);
          if (cachedData.expiry < Date.now()) {
            AsyncStorage.removeItem(key);
          } else {
            request.adapter = function () {
              return new Promise(resolve => {
                return resolve(cachedData.response);
              });
            };
          }
        }
        return request;
      } catch (e) {
        return request;
      }
    }
    return request;
  }

  async function handleCacheResponse(response: AxiosResponse) {
    const extraParams = (response.config as any).extraParams;
    const cache = extraParams.cache;
    const expiry = typeof cache == 'number' ? cache : cache.expiry;
    const { method, url, params, headers } = response.config;
    let key = cache.key || `${method}:${url}${params ? ':' + JSON.stringify(params) : ''}`;
    if (extraParams.perSession != false && headers.Authorization) key += ':' + headers.Authorization;
    try {
      const dataExistence = await AsyncStorage.getItem(key);
      if (!dataExistence) AsyncStorage.setItem(key, JSON.stringify({ response: response, expiry: Date.now() + expiry }));
    } catch (e) {
      return;
    }
  }
  return ready && children;
}
