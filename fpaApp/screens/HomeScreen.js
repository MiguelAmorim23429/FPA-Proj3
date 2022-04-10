import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { Card, Header } from 'react-native-elements'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from '../firebase';
import moment from 'moment';

import { LinearGradient } from 'expo-linear-gradient'

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
        statusBarProps={
          {
            backgroundColor: 'transparent',
            translucent: true,
          }
        }
        containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
        backgroundColor='#1375BC'
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#1375BC', '#1794e8'],
          start: { x: 0.1, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        leftComponent={{ text: 'Competições', style: { fontSize: 20, fontWeight: 'bold', flexDirection: 'row', alignSelf: 'baseline', width: 130, marginLeft: 16, color: 'white' } }}
        rightComponent={<Icon name='logout' onPress={handleLogout} style={styles.logOutPressable} size={24} color='white' />}
      />

      <ScrollView style={styles.cardContainer}>
        {competitions.map(([key, value]) => {
          if (value.ativa) {
            return (
              // <View style={{ justifyContent: 'center', alignSelf: 'center', width: '100%', height: 200, padding: 0, margin: 0, borderRadius: 16 }} key={key}>
              <View style={{ justifyContent: 'center', alignSelf: 'center', width: '100%', height: 160, padding: 0, margin: 0, borderRadius: 16 }} key={key}>

                <Card containerStyle={styles.card}>
                  <Pressable onPress={() => escolherCompeticao(key)}>
                    <Card.Image style={styles.cardImage} source={{ uri: value.foto }}></Card.Image>

                    <View style={styles.cardInfo}>

                      <Card.Title style={styles.cardTitle}>{value.nome}</Card.Title>

                      <View style={styles.cardLabelContainer}>
                        <Text style={styles.cardLabel}>{moment(value.data).format('DD-MM-YYYY')}</Text>
                        <Text style={styles.cardLabel}>{value.local}</Text>
                      </View>

                    </View>
                  </Pressable>
                </Card>

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
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: 'white',
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    padding: 0,
    margin: 0,
    borderRadius: 16,
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
    height: 140,
    // height: 180,
    borderWidth: 0,
    elevation: 4,
    shadowColor: "#000",
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 0,
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
