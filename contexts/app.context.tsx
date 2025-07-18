/* eslint-disable @typescript-eslint/no-empty-function */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import english from '../resources/translation/en.json';
import french from '../resources/translation/fr.json';

const iniInfos: { token?: string | null; user?: any; language?: string } = { token: null, user: null, language: 'fr' };

const AppContext = createContext(iniInfos);

const AppContextUpdater = createContext((state: typeof iniInfos) => {
  return state as any;
});


export const useAppUpdate = () => {
  return React.useContext(AppContextUpdater);
};
export const useAppContext = () => {
  return { appInfos: React.useContext(AppContext), setAppInfos: useAppUpdate() };
};

export default function AppContextProvider(props: any) {
  const [appInfos, updateAppInfos] = useState(iniInfos);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let savedInfos: any = await AsyncStorage.getItem('appInfos');
        if (savedInfos) {
          savedInfos = JSON.parse(savedInfos);
          updateAppInfos(old => {
            return { ...old, ...savedInfos };
          });
        } else {
        }
      } catch (e) {
        /* empty */
      }
      setReady(true);
    })();
  }, []);
  const setAppInfos = useCallback((state: typeof iniInfos) => {
    updateAppInfos(old => {
      const newState = { ...old, ...state };
      AsyncStorage.setItem('appInfos', JSON.stringify(newState))
        .then(() => {})
        .catch(() => {});
      return newState;
    });
  }, []);
  return (
    ready && (
      <AppContext.Provider value={appInfos}>
        <AppContextUpdater.Provider value={setAppInfos}>{props.children}</AppContextUpdater.Provider>
      </AppContext.Provider>
    )
  );
}


