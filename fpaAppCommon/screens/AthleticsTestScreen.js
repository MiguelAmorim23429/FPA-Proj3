import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import useParticipants from './useParticipants';
import ParticipantResultCard from './ParticipantResultCard';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const { idMatch, idSportModality } = route.params;
    // const idSportModality = route.params.idSportModality

    const navigation = useNavigation()

    const db = getDatabase()
    const participantsRef = ref(db, '/provas/' + idMatch + '/participantes/')
    const athletesRef = ref(db, '/atletas')
    const matchRef = ref(db, `/provas/${idMatch}`) // referência à base de dados para ir buscar a prova que clicamos

    const [results, setResults] = useState({})

    // const [match, setMatch] = useState(null)
    // const [enrolled, setAthletes] = useState({})

    // const [sportModality] = useSportModalities({ sportModalityId: match?.modalidade })
    const [participants] = useParticipants({ matchId: idMatch, modalidadeId: idSportModality })

    useEffect(() => {
        // console.log(`modalidade: ${sportModalityId} e prova: ${matchId}`)
    }, [idSportModality, idMatch])


    // useEffect(() => {

    //     const handlerMatch = (snapshot) => {
    //         const matchObj = snapshot.val()
    //         setMatch(matchObj)

    //     }

    //     console.log("repetições")

    //     const fetchMatch = onValue(matchRef, handlerMatch)

    //     // get(matchRef).then((snapshot) => {
    //     //     setMatch(snapshot.val())
    //     // })

    //     return (() => {
    //         fetchMatch()
    //     })
    // }, [idMatch])

    // const sortFunction = ([, a], [, b]) => {
    //     // console.log(`MODALIDADE: ${sportModality?.unidade}`)
    //     // if(Object?.values(sportModality).includes("segundos")) {
    //     //     if(a.resultado === "" || a.resultado === null) return 1;
    //     //     if(b.resultado === "" || b.resultado === null) return -1;
    //     //     if(a.resultado === b.resultado) return 0;
    //     //     return a.resultado < b.resultado ? -1 : 1;
    //     // } else if(Object?.values(sportModality).includes("metros")) {
    //     //     if(a.resultado === "" || a.resultado === null) return 1;
    //     //     if(b.resultado === "" || b.resultado === null) return -1;
    //     //     if(a.resultado === b.resultado) return 0;
    //     //     return a.resultado > b.resultado ? -1 : 1;
    //     // }
    //     if (sportModality?.unidade === "segundos") {
    //         if (a.resultado === "" || a.resultado === null) return 1;
    //         if (b.resultado === "" || b.resultado === null) return -1;
    //         if (a.resultado === b.resultado) return 0;
    //         return a.resultado < b.resultado ? -1 : 1;
    //     } else if (sportModality?.unidade === "metros") {
    //         if (a.resultado === "" || a.resultado === null) return 1;
    //         if (b.resultado === "" || b.resultado === null) return -1;
    //         if (a.resultado === b.resultado) return 0;
    //         return a.resultado > b.resultado ? -1 : 1;
    //     }
    // }

    // useEffect(() => {

    //     const handler = async (snapshot) => {

    //         let atletasSnapshot = await get(athletesRef)

    //         let atletas = {}

    //         atletasSnapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();

    //             if (childData.genero === match?.genero) {
    //                 atletas[childKey] = childData
    //             }
    //         })

    //         // let inscritos = {}
    //         let newResults = {}
    //         let enrolledResultsArray = []
    //         let enrolledResults = {}

    //         snapshot.forEach((childSnapshot) => {
    //             const idParticipant = childSnapshot.key
    //             const idAthlete = childSnapshot.val().atleta;
    //             const result = childSnapshot.val().resultado;

    //             newResults[idParticipant] = result || ''
    //             // inscritos[idParticipant] = atletas[idAthlete]

    //             atletas[idAthlete].resultado = result || '';
    //             enrolledResults[idParticipant] = atletas[idAthlete]

    //             enrolledResultsArray = Object.entries(enrolledResults)

    //             for (let i = 0; i < enrolledResultsArray.length; i++) {
    //                 // enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
    //                 enrolledResultsArray.sort(sortFunction)
    //             }
    //         });

    //         setAthletes(enrolledResultsArray)

    //     }

    //     const fetchParticipants = onValue(participantsRef, handler)
    //     // if (match) {
    //     fetchParticipants()
    //     // }

    //     return (() => {
    //         // if (match) {
    //         fetchParticipants()
    //         // off(handler)
    //         // }
    //     })
    // }, [match, sportModality])

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
                statusBarProps={
                    {
                        backgroundColor: 'transparent',
                        translucent: true,
                    }
                }
                containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                backgroundColor='#1375BC'
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                    colors: ['#1375BC', '#1794e8'],
                    start: { x: 0.1, y: 0.5 },
                    end: { x: 1, y: 0.5 },
                  }}
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                        <Text style={styles.headerTitle}>Participantes</Text>
                    </View>
                }
            />

            {/* <View style={styles.labelContainer}>
                <Text style={styles.labelNome}>Nome</Text>
                <Text style={styles.labelRow}>Clube</Text>
                <Text style={styles.labelRow}>Escalão</Text>
                <Text style={styles.labelRow}>Marca</Text>
            </View> */}
            <ScrollView style={styles.listContainer}>
                {Object.entries(participants).map(([key, value], index) => {
                    return (

                        <ParticipantResultCard key={key} position={index} name={value[1].nome} club={value[1].clube} ageGroup={value[1].escalao.substring(0,3)} result={value[1].resultado} />
                        // <View key={index}>
                        //     <TouchableOpacity onPress={() => console.log(key)}>
                        //         <ListItem style={styles.listCard}>
                        //             <ListItem.Content style={styles.listRowsContainer}>
                        //                 <ListItem.Title style={styles.listName}>{value[1].nome}</ListItem.Title>
                        //                 <ListItem.Title style={styles.listRow}>{value[1].clube}</ListItem.Title>
                        //                 <ListItem.Title style={styles.listRow}>{value[1].escalao.substring(0, 3)}</ListItem.Title>
                        //                 <ListItem.Title style={styles.listRow}>{value[1].resultado || ''}</ListItem.Title>
                        //             </ListItem.Content>
                        //         </ListItem>
                        //     </TouchableOpacity>
                        // </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default AthleticsTestScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        backgroundColor: 'white'
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