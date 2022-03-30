import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import UseModalidades from './UseModalidades';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const idMatch = route.params.idProva

    const navigation = useNavigation()

    const db = getDatabase()
    const auth = getAuth()
    const participantsRef = ref(db, '/provas/' + idMatch + '/participantes/')
    const athletesRef = ref(db, '/atletas')
    const matchRef = ref(db, `/provas/${idMatch}`) // referência à base de dados para ir buscar a prova que clicamos
    const userRef = ref(db, `/users/${auth.currentUser.uid}`)
    

    const [results, setResults] = useState({})

    const [match, setMatch] = useState(null)
    const [user, setUser] = useState(null)
    const [inscritos, setAtletas] = useState({})
    const [modalidades] = UseModalidades({ modalidade: match?.modalidade })

    useEffect(() => {

        const handlerMatch = (snapshot) => {
            const matchObj = snapshot.val()
            setMatch(matchObj)

            // let userObj = await get(userRef)

            // setUser(userObj)
            
        }

        const fetchMatch = onValue(matchRef, handlerMatch)

        get(userRef).then((snapshot) => {
            setUser(snapshot.val())
        })

        return(() => {
            fetchMatch()
        })

    }, [])

    const sortFunction = ([,a], [,b]) => {
        if(a.resultado === "" || a.resultado === null) return 1;
        if(b.resultado === "" || b.resultado === null) return -1;
        if(a.resultado === b.resultado) return 0;
        return a.resultado < b.resultado ? -1 : 1;
    }

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
            });

            let inscritos = {}
            let newResultados = {}

            // NOVA VERSÃO!!!!!
            let enrolledResultsArray = []
            let enrolledResults = {}

            snapshot.forEach((childSnapshot) => {
                const idParticipant = childSnapshot.key
                const idAthlete = childSnapshot.val().atleta;
                const result = childSnapshot.val().resultado

                newResultados[idParticipant] = result || ''
                inscritos[idParticipant] = atletas[idAthlete]

                // NOVA VERSÃO!!!!!
                atletas[idAthlete].resultado = result || ''
                enrolledResults[idParticipant] = atletas[idAthlete]

                enrolledResultsArray = Object.entries(enrolledResults)

                for(let i = 0; i<enrolledResultsArray.length; i++) {
                    // enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
                    enrolledResultsArray.sort(sortFunction)
                }
            });

            // setAtletas(inscritos)
            setResults(newResultados)

            // NOVA VERSÃO!!!!!
            setAtletas(enrolledResultsArray)

        }

        const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

        return(() => {
                match && closeParticipantsOnvalue()
        })

    }, [match])

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    const addResult = (enrolledResults) => {

        const updates = {}
        let resultsArray = []

        const enrolledResultsArray = Object.entries(enrolledResults)
        
        enrolledResultsArray.forEach((enrolledResult) => {

            const idParticipant = enrolledResult[1][0]
            const result = enrolledResult[1][1].resultado

            updates[`/provas/${idMatch}/participantes/${idParticipant}/resultado/`] = result

            resultsArray.push(result)
        })
        
        if(resultsArray.every(result => result !== null && result !== undefined && result !== "")) {
            updates[`/provas/${idMatch}/estado/`] = "finalizada"
        }
        

        update(ref(db), updates)

        Alert.alert('Resultados adicionados com sucesso.')
    }

    const setResultOnIndex = (valResultado, index) => {
        // let newResult = Object.assign({}, results)
        let newResult = Object.assign({}, inscritos)

        // newResult[index] = valResultado;
        newResult[index][1].resultado = valResultado

        setAtletas(newResult)
    }

    const maskInputCreator = (key) => {
        let sportModalityMaskInput;

        if(match.estado == "ativa") {
            if (Object.values(modalidades).includes("segundos")) {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={results[key] || 'aaaa'}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, key)}
                    mask={[/\d/, /\d/, ':', /\d/, /\d/, 's']}
                    placeholder='00:00s' />
    
            } else if (Object.values(modalidades).includes("metros")) {
                sportModalityMaskInput = <MaskInput 
                    style={styles.textInput} 
                    value={inscritos[key][1].resultado || ''}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, key)} 
                    mask={[/\d/, /\d/, '.', /\d/, /\d/, 'm']} 
                    placeholder='00.00m' />
                    
            }
        } else if(match.estado == "finalizada"){
            if (Object.values(modalidades).includes("segundos")) {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={inscritos[key][1].resultado || ''}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00:00s' />
    
            } else if (Object.values(modalidades).includes("metros")) {
                sportModalityMaskInput = <MaskInput 
                    style={styles.textInput} 
                    value={inscritos[key][1].resultado || ''}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00.00m' />
                    
            }
        } else if(match.estado == "emInscricoes") {
            if (Object.values(modalidades).includes("segundos")) {
                sportModalityMaskInput = <TextInput
                    style={styles.textInput}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00:00s' />
    
            } else if (Object.values(modalidades).includes("metros")) {
                sportModalityMaskInput = <TextInput 
                    style={styles.textInput} 
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00.00m' />
            }
        }

        return sportModalityMaskInput
    }

    return (
        Object.entries(inscritos).length == 0 ? (
            <View style={styles.container}>
                <Header
                    leftComponent={
                        <View style={styles.headerContainer}>
                            <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                            <Text style={styles.headerTitle}>Participantes</Text>
                        </View>
                    }
                />

                <View>
                    <Text style={styles.noAthleteText}>Não existem atletas inscritos nesta prova</Text>
                </View>
            </View>
        ) : (
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
                    
                    {Object.entries(inscritos).map(([key, value], index) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity onPress={() => console.log(key)}>
                                    <ListItem style={styles.listCard}>
                                        <ListItem.Content style={styles.listRowsContainer}>
                                            <ListItem.Title style={styles.listName}>{value[1].nome}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value[1].clube}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value[1].escalao.substring(0, 3)}</ListItem.Title>
                                            {maskInputCreator(key)}
                                        </ListItem.Content>
                                    </ListItem>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    <Pressable
                        style={styles.btnPressable}
                        onPress={() => addResult(inscritos)}>
                        {/* onPress={() => addResult(Object.keys(results), Object.values(results))}> */}
                        <Text style={styles.textPressable}>Adicionar</Text>
                    </Pressable>
                </ScrollView>
            </View>
        )
    )
}

export default AthleticsTestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    noAthleteText: {
        fontSize: 20,
        textAlign: 'center',
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
    textInput: {
        borderWidth: 0.5,
        // borderRadius: 4,
        borderColor: 'rgb(120, 120, 120)',
        flex: 0.8,
        padding: 5,
        height: 30,
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
})