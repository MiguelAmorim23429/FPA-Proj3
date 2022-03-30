import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native'
import { Card, Header } from 'react-native-elements'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue, off } from "firebase/database";
import { app } from '../firebase';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = (props) => {

  const db = getDatabase()
  const competitionsRef = ref(db, '/competicoes/')

  const auth = getAuth()
  const navigation = useNavigation()

  const [competitions, setCompetitions] = useState([])

  useEffect(() => {

    const handler = (snapshot) => {

      let competitionsArray = []

      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        competitionsArray.push([childKey, childData])
      });
      setCompetitions(competitionsArray)
    }

    const closeCompetionsOnvalue = onValue(competitionsRef, handler)
    return (() => {
      closeCompetionsOnvalue()
    })
    // onValue(competicoesRef, (snapshot) => {
    //   let comps = []

    //   snapshot.forEach((childSnapshot) => {
    //     const childKey = childSnapshot.key;
    //     const childData = childSnapshot.val();
    //     const arrayEntries = Object.entries(childData)

    //     comps.push([childKey, childData])
    //   });
    //   setCompeticoes(comps)
    //   // console.log(competicoes)
    // }, {
    //   onlyOnce: true
    // });
  }, [])

  const handleLogout = () => {
    auth
      .signOut()
  }

  // Clicar no Card e redirecionar para outro ecrã com a lista de provas dessa competição selecionada.
  const escolherCompeticao = (val) => {
    console.log(val)
    navigation.navigate('Competition', { idComp: val })
  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ text: 'Competições', style: styles.screenTitle }}
        // rightComponent={<Pressable style={styles.logOutPressable} title='Logout' onPress={handleLogout}><Text style={styles.textPressable}>Sair</Text></Pressable>}
        rightComponent={<Icon name='logout' onPress={handleLogout} style={styles.logOutPressable} size={22} color='white'/>}
      />

      {/* <ScrollView style={styles.cardContainer}>
        {competitions.map(([key, value]) => {
          if (value.ativa) {
            return (
              <View key={key}>
                <TouchableOpacity onPress={() => escolherCompeticao(key)}>
                  <Card>
                    <Card.Title style={styles.cardTitle}>{value.nome}</Card.Title>
                    <Card.Divider />
                    <Card.Image style={{ borderRadius: 5 }} source={{uri: value.foto}}>
                    </Card.Image>
                    <Text style={styles.cardText}>{value.data}</Text>
                    <Text style={styles.cardText}>{value.local}</Text>
                  </Card>
                </TouchableOpacity>
              </View>
            )
          }
        })}

      </ScrollView> */}

      <ScrollView style={styles.cardContainer}>
        {competitions.map(([key, value]) => {
          if (value.ativa) {
            return (
              <View key={key}>
                <Pressable onPress={() => escolherCompeticao(key)}>
                  <Card containerStyle={styles.card}>

                    <Card.Image style={styles.cardImage} source={{ uri: value.foto }}></Card.Image>

                    <View style={styles.cardInfo}>

                      <Card.Title style={styles.cardTitle}>{value.nome}</Card.Title>

                      <View style={styles.cardLabelContainer}>
                        <Text style={styles.cardLabel}>{value.data}</Text>
                        <Text style={styles.cardLabel}>{value.local}</Text>
                      </View>

                    </View>

                  </Card>
                </Pressable>
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
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    padding: 0,
    borderRadius: 16,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    borderRadius: 16,
  },
  cardInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 24,
    color: 'white',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  cardLabelContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 56,
    left: 16,
  },
  cardLabel: {
    fontSize: 16,
    color: 'white',
  },
  logOutPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  screenTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 160,
    paddingStart: 16,
  }
})
