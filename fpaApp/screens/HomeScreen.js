import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { Card, ListItem, Icon } from 'react-native-elements'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { app } from '../firebase';
import { requireNativeViewManager } from 'expo-modules-core';

const HomeScreen = () => {
  const db = getDatabase()
  const dbRef = ref(db, '/competicoes/')

  const auth = getAuth()

  const [competicoes, setCompeticoes] = useState([])
  const [nomeCompeticao, setNomeCompeticao] = useState([])
  const [localCompeticao, setLocalCompeticao] = useState([])
  const [dataCompeticao, setDataCompeticao] = useState([])

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      let comps = []
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const arrayEntries = Object.entries(childData)
        // const data = [arrayEntries[0][1]]
        // const local = [arrayEntries[1][1]]
        // const nome = [arrayEntries[2][1]]
        // nomeCompeticao.push(nome)
        // localCompeticao.push(local)
        // dataCompeticao.push(data)
        comps.push(childData)
      });
      setCompeticoes(comps)
      setDataCompeticao(dataCompeticao)
      console.log(competicoes)
      setLocalCompeticao(localCompeticao)
      setNomeCompeticao(nomeCompeticao)
    }, {
      onlyOnce: true
    });
  }, [])

  const handleLogout = () => {
      auth
      .signOut()
  }

  return (
    <ScrollView>
      {/* <Text>Estás logado em: {auth.currentUser.email}</Text> */}  
      
      {/* <Text>Competição: {map}</Text> */}
      <View style={styles.container}>
        {competicoes.map((data) => {
          return (
            <Card containerStyle={{width: '95%', borderRadius: 10}}>
              <Card.Title style={{fontSize:18}}>{data.nome}</Card.Title>
              <Card.Divider/>
              <Card.Image style={{borderRadius: 5}} source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}>
              
              </Card.Image>
              <Text style={{fontSize: 16}}>{data.data}</Text>
              <Text style={{fontSize: 16}}>{data.local}</Text>
            </Card>
          )
        })}
        <Button title='Logout' onPress={handleLogout}/>
      </View>
      
      {/* <Card style={styles.card}>
        <Card.Title>{data}</Card.Title>
        <Card.Divider/>
        <Card.Image source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}>
        <Text>ffadsa</Text>
        <Text>aa</Text>
        </Card.Image>
      </Card> */}
      
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
        // backgroundColor: '#fff',
    },
    card: {
      width: '100%',
    }
})
