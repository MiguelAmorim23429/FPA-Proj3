import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import { Card, Header } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import moment from 'moment';

import { LinearGradient } from 'expo-linear-gradient';

import { getDatabase, ref, onValue } from "firebase/database";

const HomeScreen = () => {

  const db = getDatabase()
  const competicoesRef = ref(db, '/competicoes/')

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
        // containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
        containerStyle={{ margin: 0, padding: 0, height: 100, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
        backgroundColor='#1375BC'
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ['#1375BC', '#1794e8'],
          start: { x: 0.1, y: 0.5 },
          end: { x: 1, y: 0.5 },
      }}
        leftComponent={{ text: 'Competições', style: { fontSize: 20, fontWeight: 'bold', flexDirection: 'row', alignSelf: 'baseline', width: 130, marginLeft: 10, color: 'white' } }}
      />

      <ScrollView style={styles.cardContainer}>
        {competicoes.map(([key, value]) => {
          if (value.ativa) {
            return (
              <View style={{ justifyContent: 'center', alignSelf: 'center', width: '100%', height: 200, padding: 0, margin: 0, borderRadius: 16 }} key={key}>

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
    height: 180,
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