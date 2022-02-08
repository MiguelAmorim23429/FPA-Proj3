import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View,  ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native'
import { Card, Header } from 'react-native-elements'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from '../firebase';

const HomeScreen = (props) => {
  const db = getDatabase()
  const competicoesRef = ref(db, '/competicoes/')

  const auth = getAuth()
  const navigation = useNavigation()

  const [competicoes, setCompeticoes] = useState([])

  useEffect(() => {
    onValue(competicoesRef, (snapshot) => {
      let comps = []

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const arrayEntries = Object.entries(childData)

        comps.push([childKey, childData])
      });
      setCompeticoes(comps)
      // console.log(competicoes)
    }, {
      onlyOnce: true
    });
  }, [])

  const handleLogout = () => {
      auth
      .signOut()
  }
  
  // Clicar no Card e redirecionar para outro ecrã com a lista de provas dessa competição selecionada.
  const escolherCompeticao = (val) => {
    console.log(val)
    navigation.navigate('Competition', {idComp: val})
  }

  return (
    <View style={styles.container}>
      <Header
      leftComponent={{text:'Competições', style: {fontSize: 20, fontWeight: 'bold', flexDirection: 'row', alignSelf: 'baseline', width: 130, marginLeft: 10, color: 'white'}}}
      rightComponent={<Pressable style={styles.logOutPressable} title='Logout' onPress={handleLogout}><Text style={styles.textPressable}>Sair</Text></Pressable>}
      />

      <ScrollView style={styles.cardContainer}>
          {competicoes.map(([key, value]) => {
            if(value.ativa){
              return (
                <View key={key}>
                  <TouchableOpacity onPress={() => escolherCompeticao(key)}>
                    <Card>
                      <Card.Title style={{fontSize:18}}>{value.nome}</Card.Title>
                      <Card.Divider/>
                      <Card.Image style={{borderRadius: 5}} source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}>
                      </Card.Image>
                      <Text style={{fontSize: 16}}>{value.data}</Text>
                      <Text style={{fontSize: 16}}>{value.local}</Text>
                    </Card>
                  </TouchableOpacity>
                </View>
              )
            }
          })}
        
      </ScrollView>
      
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        // backgroundColor: '#fff',
    },
    cardContainer: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
    logOutPressable: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 5,
      width: 64,
      height: 30,
      flexDirection: 'row',
      alignSelf: 'baseline',
    },
    textPressable: {
      color: '#5A79BA',
      fontWeight: 'bold',
      fontSize: 16,
    },
})
