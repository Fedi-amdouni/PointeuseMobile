import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Platform, Text, StyleSheet, Alert, Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Accès à la localisation requis',
            message: "Cette application a besoin d'accéder à votre localisation pour fonctionner correctement.",
            buttonPositive: 'OK',
            buttonNegative: 'Annuler',
            buttonNeutral: 'Plus tard',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission de localisation accordée');
          setPermissionGranted(true);
          getCurrentLocation();
        } else {
          console.log('Permission de localisation refusée');
          setErrorMsg('Permission de localisation refusée');
        }
      } catch (err) {
        console.warn('Erreur lors de la demande de permission : ', err);
        setErrorMsg('Erreur lors de la demande de permission');
      }
    } else {
      setPermissionGranted(true);
      getCurrentLocation();
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();
      console.log('Adresse obtenue : ', data);
      return data.display_name || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse : ', error);
      return 'Erreur lors de la récupération de l\'adresse';
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        console.log('Position obtenue : ', position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({ latitude, longitude });

        // Appeler la fonction de géocodage inverse
        const name = await reverseGeocode(latitude, longitude);
        setPlaceName(name);
      },
      (error) => {
        console.log('Erreur lors de la récupération de la position : ', error);
        setErrorMsg(error.message);
        Alert.alert("Erreur", "Impossible d'obtenir la position");
      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleRequestPermissionAgain = () => {
    setErrorMsg(null);
    setPermissionGranted(false);
    requestLocationPermission();
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View>
          <Text style={styles.errorText}>{errorMsg}</Text>
          {!permissionGranted && (
            <Button title="Redemander la permission" onPress={handleRequestPermissionAgain} />
          )}
        </View>
      ) : location ? (
        <View>
          <Text style={styles.locationText}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
          <Text style={styles.locationText}>Lieu: {placeName}</Text>
        </View>
      ) : (
        <Text style={styles.locationText}>Obtention de la localisation...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LocationScreen;
