import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, Alert, Pressable } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, onValue } from "firebase/database";
import LoadingScreen from './LoadingScreen';

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState([])

  const navigation = useNavigation()

  const auth = getAuth()
  const db = getDatabase()
  const usersRef = ref(db, '/users')

  useEffect(() => {
    let usersArray = []
    const getUsers = onValue(usersRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        usersArray.push([childKey, childData])
      });
      setUser(usersArray)
    }, {
      onlyOnce: true
    });
    return () => {
      getUsers()
    }
  }, [])

  let username = ''

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {

        user.map(([key, value]) => {
          if (userCredentials.user.email === value.email) {
            console.log("E IGUALLLLL")
            username = value.username
          }
          console.log("chave: " + key + " / valor: " + value.email)
        })

        Alert.alert('Bem vindo ' + username)
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Campos vazios')
            break
          case 'auth/user-not-found':
            alert('E-mail introduzido errado ou não existe')
            break
          case 'auth/wrong-password':
            alert('Palavra-passe errada')
            break
          case 'auth/too-many-requests':
            alert('Falhou o inicio de sessão demasiadas vezes. Tente novamente mais tarde')
            break
        }
        console.log(error.message)
        // alert(error.message)
      })
  }

  return (
    <View style={styles.container}>

      <Image
        style={styles.imageTeste}
        source={require('../assets/fpa-logo.png')}
      />
      <View>
        <TextInput style={styles.textInput} keyboardType='email-address' value={email} onChangeText={text => setEmail(text)} placeholder='Email'></TextInput>
        <TextInput style={styles.textInput} value={password} onChangeText={text => setPassword(text)} placeholder='Palavra-passe' secureTextEntry></TextInput>
        {/* <View style={styles.redirectContainer}>
            <Text style={styles.perguntaConta}>Ainda não tenho uma conta.</Text>
            <Text style={styles.linkRegister} onPress={() => navigation.navigate('Register')}>Criar conta</Text>
          </View> */}
        <Pressable
          style={styles.btnPressable}
          onPress={handleLogin}>
          <Text style={styles.textPressable}>Entrar</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTeste: {
    width: 176,
    height: 120,
    marginTop: 120,
  },
  textInput: {
    width: 300,
    borderBottomWidth: 2,
    borderColor: 'rgb(120, 120, 120)',
    padding: 10,
    marginTop: 25,
    fontSize: 18,
  },
  btnPressable: {
    marginTop: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A79BA',
    height: 40,
    width: 150,
    borderRadius: 5,
  },
  textPressable: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  redirectContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    maxHeight: 20
  },
  linkRegister: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  perguntaConta: {
    color: 'rgb(120,120,120)',
    fontSize: 13,
  },
})
