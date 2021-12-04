import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, Alert, Pressable } from 'react-native'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const auth = authApp.getAuth()
    const navigation = useNavigation()
    const auth = getAuth()
    var user = ''

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            user = userCredentials.user
            Alert.alert('Entraste')
        })
        .catch(error => {
          console.log("Tenta outra vez")
          alert(error.message)
        })
    }

    return (
        <View style={styles.container}>
      
            <Image
            style={styles.imageTeste}
            source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}
            />
            <View>
              <TextInput style={styles.textInput} keyboardType='email-address' value={email} onChangeText={text => setEmail(text)} placeholder='Email'></TextInput>
              <TextInput style={styles.textInput} value={password} onChangeText={text => setPassword(text)} placeholder='Password' secureTextEntry></TextInput>
              <View style={styles.redirectContainer}>
                <Text style={styles.perguntaConta}>Ainda não tenho uma conta.</Text>
                <Text style={styles.linkRegister} onPress={() => navigation.navigate('Register')}>Criar conta</Text>
              </View>
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
        width: 250,
        //borderStyle: 'solid',
        borderBottomWidth: 2,
        // borderColor: '#000',
        borderColor: 'rgb(120, 120, 120)',
        paddingLeft: 5,
        marginTop: 25,
        fontSize: 16,
      },
      btnPressable: {
        marginTop: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
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
      }
})
