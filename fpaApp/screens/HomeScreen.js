import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Button } from 'react-native'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, child, get } from "firebase/database";
import { app } from '../firebase';

const HomeScreen = () => {

    const auth = getAuth()
    // const navigation = useNavigation()
    const modalidade = 'modalidade1'
    const [data, setData] = useState('')

    const dbRef = ref(getDatabase());
    get(child(dbRef, `modalidades/${modalidade}/nome`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val())
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    const handleLogout = () => {
        auth
        .signOut()
    }

    return (
        <View style={styles.container}>
            {/* <Text>Estás logado em: {auth.currentUser.email}</Text> */}
            <Text>Modalidade: {data}</Text>
            <Button title='Logout' onPress={handleLogout}/>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#fff',
    }
})
