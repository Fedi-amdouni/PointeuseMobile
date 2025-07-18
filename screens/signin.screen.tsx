import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/app.navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthenticationService from '../services/authenticationService';
import * as Application from 'expo-application';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
type SignInScreenRouteProp = RouteProp<RootStackParamList, 'SignIn'>;

type Props = {
  navigation: SignInScreenNavigationProp;
  route: SignInScreenRouteProp;
};

const SignInScreen: React.FC<Props> = ({ navigation, route }) => {


  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [identifSociete, setIdentifSociete] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifVisible, setIdentifVisible] = useState(false);
  const [expired, setExpired] = useState(false);

  async function getUserStorageKey(key: string): Promise<string> {
    const login = await AuthenticationService.getLogin();
    return `${login}_${key}`;
  }


  const handleSignInDeployed = async () => {
    setLoading(true);

    const loginRequest = {
      login: email,
      mdp: password,
      idMobile: Application.getAndroidId(),
    };
    await AsyncStorage.setItem("identifSociete",identifSociete)


    
    try {
      AuthenticationService.getLogin();
      const response = await AuthenticationService.login(loginRequest);
      if (response && response.status == 200 && response.data)
      {
        await AsyncStorage.setItem(await getUserStorageKey('lastLogDetection'),"logged in")
        await AsyncStorage.setItem("password",password)
        await AsyncStorage.setItem("email",email)
        navigation.navigate('BottomNavigation', { userEmail: email });
      };
    } catch (error: any) {
      console.error('Error during sign-in:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const checkCredentials = async () => {
    const email = await AsyncStorage.getItem("email")
    const pass  = await AsyncStorage.getItem("password")
    const token = await AsyncStorage.getItem('token');
    if (email && pass && token) {
      setEmail(email)
      setPassword(pass)
      setToken(token)
      navigation.navigate("BottomNavigation",{userEmail : email})

    }
  };

  useEffect(() => {
    checkCredentials();

    const getIdentif = async() =>{
      const identif = await AsyncStorage.getItem("identifSociete")
      if (identif != null) { setIdentifSociete(identif) }
    }
    getIdentif();
  }, []);
  
  
  return (
    
    <View style={styles.container}>

      <Text style={styles.title}>Connexion</Text>
      <View style={styles.iconContainer}>
        <Icon style={styles.accountIcon} name="account-circle" />
      </View>      
      <Text style={styles.description}>Entrez vos identifiants de connexion fournis par votre administrateur</Text>

      <View style={styles.identifContainer}>
      <TextInput style={styles.inputIdentif} value={identifSociete} onChangeText={setIdentifSociete} placeholder="Identif. de la société *"  secureTextEntry={identifVisible} />
        <TouchableOpacity onPress={() => setIdentifVisible(!identifVisible)}>
          <CommIcon
            name={identifVisible ? 'eye-off' : 'eye'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Utilisateur *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Mot de passe *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <CommIcon
            name={passwordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>



      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.signInButton} onPress={handleSignInDeployed}>
          <Text style={styles.signInButtonText}>Se connecter</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent : 'center',
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },

  description: {
    fontSize: 15,
    textAlign: 'center',
    color : 'grey',
    marginBottom: '8%',
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#4051D3',
    borderRadius: 25,
    height: '15%',
    fontWeight: 'bold',
  },
  
  input: {
    height: 60,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: '8%',
    paddingHorizontal: 10,
    backgroundColor : 'white',
  },
  inputIdentif: {

    flex: 1, // Takes up most of the space
    alignItems:'center'
  },

  signInButton: {
    backgroundColor: '#78BE93',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    height : 60,
    justifyContent : "center"
  },

  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight : "bold"
  },

  signUpButton: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#841584',
  },

  signUpButtonText: {
    color: 'white',
    fontSize: 18,
  },

  accountIcon: {
    color: "grey",
    fontSize: 100 ,
    
  },

  iconContainer: {
    alignItems: 'center',
    marginVertical: 20, 
  },
  inputContainer: {
    height: 60,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: '8%',
    paddingHorizontal: 10,
    backgroundColor : 'white',
    flexDirection: 'row',
    alignItems: 'center', 
    marginVertical: 8,
    
    
  },
  identifContainer :{
    height: 60,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: '8%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center', 
    marginVertical: 8,
    backgroundColor : 'white',

  },
  inputField: {
    flex: 1, // Takes up most of the space
    height: 40,
  },
  
});

export default SignInScreen;
