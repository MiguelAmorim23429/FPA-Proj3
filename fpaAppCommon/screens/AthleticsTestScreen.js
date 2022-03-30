import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const idMatch = route.params.idProva

    const navigation = useNavigation()

    const db = getDatabase()
    const participantsRef = ref(db, '/provas/' + idMatch + '/participantes/')
    const athletesRef = ref(db, '/atletas')
    const matchRef = ref(db, `/provas/${idMatch}`) // referência à base de dados para ir buscar a prova que clicamos

    const [results, setResults] = useState({})

    const [match, setMatch] = useState(null)
    const [enrolled, setAthletes] = useState({})

    useEffect(() => {

        const handlerMatch = (snapshot) => {
            const matchObj = snapshot.val()
            setMatch(matchObj)
            
        }

        // console.log(match)

        const fetchMatch = onValue(matchRef, handlerMatch)

        // get(matchRef).then((snapshot) => {
        //     setMatch(snapshot.val())
        // })

        return(() => {
            fetchMatch()
        })
    }, [])

    useEffect(() => {
        
        const handler = async (snapshot) => {

            let atletasSnapshot = await get(athletesRef)

            let atletas = {}

            atletasSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                
                if (childData.genero === match.genero) {
                    atletas[childKey] = childData
                }
            })
            
            // let inscritos = {}
            let newResults = {}
            let enrolledResultsArray = []
            let enrolledResults = {}

            snapshot.forEach((childSnapshot) => {
                const idParticipant = childSnapshot.key
                const idAthlete = childSnapshot.val().atleta;
                const result = childSnapshot.val().resultado;

                newResults[idParticipant] = result || ''
                // inscritos[idParticipant] = atletas[idAthlete]

                atletas[idAthlete].resultado = result || ''
                enrolledResults[idParticipant] = atletas[idAthlete]

                enrolledResultsArray = Object.entries(enrolledResults)

                for(let i = 0; i<enrolledResultsArray.length; i++) {
                    enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
                }
            });

            setAthletes(enrolledResultsArray)
            
        }

        const fetchParticipants = onValue(participantsRef, handler)
        // if (match) {
            fetchParticipants()
        // }

        return (() => {
            // if (match) {
                fetchParticipants()
                // off(handler)
            // }
        })
    }, [match])

    

    const goToPreviousScreen = () => {
        navigation.goBack()
    }
    
   

    const setResultadoOnIndex = (valResultado, index) => {
        let newResultado = Object.assign({}, results)

        newResultado[index] = valResultado;
        // console.log(newResultado)
        setResults(newResultado)
        console.log(results)
    }

    return (
        <View style={styles.container}>
            <Header
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                        <Text style={styles.headerTitle}>Participantes</Text>
                    </View>
                }
            />

            <View style={styles.labelContainer}>
                <Text style={styles.labelNome}>Nome</Text>
                <Text style={styles.labelRow}>Clube</Text>
                <Text style={styles.labelRow}>Escalão</Text>
                <Text style={styles.labelRow}>Marca</Text>
            </View>
            <ScrollView style={styles.listContainer}>
                {Object.entries(enrolled).map(([key, value], index) => {
                    // console.log(`chave: ${key} com valor: ${value[1].resultado} e index: ${index}`)

                    return (
                        <View key={index}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                                <ListItem style={styles.listCard}>
                                    <ListItem.Content style={styles.listRowsContainer}>
                                        <ListItem.Title style={styles.listName}>{value[1].nome}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value[1].clube}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value[1].escalao.substring(0, 3)}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value[1].resultado || ''}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default AthleticsTestScreen

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        alignItems: 'baseline'
    },
    headerIcon: {
        marginEnd: 24,
        color: 'white',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 150,
        color: 'white',
    },
    listContainer: {
        width: '100%',
    },
    listCard: {
        borderWidth: 1,
        borderColor: 'rgb(200,200,200)',
    },
    listRowsContainer: {
        flexDirection: 'row',
    },
    listName: {
        flex: 2,
    },
    listRow: {
        flex: 1,
        textAlign: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    labelNome: {
        marginStart: 24,
        marginEnd: 128,
    },
    labelRow: {
        marginEnd: 32,
        textAlign: 'center',
    },
})