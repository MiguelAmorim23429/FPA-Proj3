import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CompetitionScreen from './screens/CompetitionScreen';
import AthleticsTestScreen from './screens/AthleticsTestScreen';
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { View, ActivityIndicator, Image, Screen } from 'react-native'
import LoadingScreen from './screens/LoadingScreen';

export default function App() {

  useEffect(() => {
    /**
     * Espera dois segundos para meter o estado de loading como falso. 
     * Como O firebase vai buscar a info mais rápido do que 2 segundos,
     * a LoadingScreen amostra na mesma e ao mesmo tempo conseguimos desativá-la mais tarde.
     * */  
    setTimeout(() => setLoading(false), 2000)
  }, [])

  const auth = getAuth()
  const [loggedIn, setLoggedIn] = useState(!!auth.currentUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const authChange = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user)
      setLoading(false)
      // if (user) {
      //   setLoggedIn(!!user)
      //   setLoading(false)
      // } else {
      //   // User is signed out
      //   setLoggedIn(!!user)
      // }
    });
    return () => {
      authChange()
    }
  }, [])

  const Stack = createNativeStackNavigator();

  if(loading) {
    return (<LoadingScreen />)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="Competition" component={CompetitionScreen} options={{headerShown: false}} />
            <Stack.Screen name="AthleticsTest" component={AthleticsTestScreen} options={{headerShown: false}} />
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTeste: {
    width: 176,
    height: 120,
    marginTop: 120,
  },
});
