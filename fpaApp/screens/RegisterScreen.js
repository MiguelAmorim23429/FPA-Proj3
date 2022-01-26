import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, Alert, Pressable } from 'react-native'
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

const RegisterScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const auth = getAuth()

    const handleRegister = () => {
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          // const [user, setUser] = useState(userCredentials.user)
          auth.currentUser = null
          // setUser(null)
          // console.log(user.email)
          // userCredentials
          // const user = userCredentials.user
          // console.log(user.email)
          Alert.alert('Conta criada com sucesso')
        })
        .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
      
            <Image
            style={styles.imageTeste}
            source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}
            />
            <View>

              {/* <Text style={styles.titleRegisto}>REGISTO</Text> */}
              <TextInput style={styles.textInput} keyboardType='email-address' value={email} onChangeText={text => setEmail(text)} placeholder='Email'></TextInput>
              <TextInput style={styles.textInput} value={password} onChangeText={text => setPassword(text)} placeholder='Password' secureTextEntry></TextInput>
              {/* <TextInput style={[styles.textInput, styles.pwInput]} value={password} onChangeText={text => setPassword(text)} placeholder='Password' secureTextEntry></TextInput> */}
              <View style={styles.redirectContainer}>
                <Text style={styles.perguntaConta}>Já tens uma conta?</Text>
                <Text style={styles.linkLogin} onPress={() => navigation.navigate('Login')}>Iniciar sessão</Text>
              </View>
              <Pressable
                  style={styles.btnPressable}
                  onPress={handleRegister}>
                <Text style={styles.textPressable}>Criar conta</Text>
              </Pressable>
            </View>

            <StatusBar style="auto" />
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  imageTeste: {
    width: 176,
    height: 120,
    marginTop: 120,
  },
  textInput: {
    width: 300,
    //borderStyle: 'solid',
    borderBottomWidth: 2,
    // borderColor: '#000',
    borderColor: 'rgb(120, 120, 120)',
    padding: 10,
    // marginBottom: 25,
    marginTop: 25,
    fontSize: 18,
  },
  usernameLabel: {
    marginTop: 30,
    marginLeft: 5,
    fontSize: 16,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    marginStart: 5,
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
  linkLogin: {
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
