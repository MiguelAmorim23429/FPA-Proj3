import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CompetitionScreen from './screens/CompetitionScreen';
import AthleticsTestScreen from './screens/AthleticsTestScreen';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

export default function App() {

  const auth = getAuth()
  const [loggedIn, setLoggedIn] = useState(auth.currentUser)
    useEffect(() => {
     const authChange =  onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          const email = user.email
          setLoggedIn(user)
          console.log(uid + '            ENTROUUUUUU')
          
          // ...
        } else {
          // User is signed out
          // ...
          setLoggedIn(user)
          console.log('NAO entrouuuuuuuuuuuuu')
        }
      });
      return () => {
        authChange()
      }
    }, [])
    

  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loggedIn == null ? (
          <>
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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
});
