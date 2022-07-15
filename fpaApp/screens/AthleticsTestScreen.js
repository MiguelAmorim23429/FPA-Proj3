import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, Pressable, Keyboard } from 'react-native'
import MaskInput from 'react-native-mask-input';
import { Button, Header } from 'react-native-elements'
import { getDatabase, ref, onValue, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';

import { LinearGradient } from 'expo-linear-gradient';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from './Toast';
import useSportModalities from './useSportModalities';

import LongJumpComponent from './LongJumpComponent';
import HighJumpComponent from './HighJumpComponent';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const idMatch = route.params.idProva

    const navigation = useNavigation()

    const db = getDatabase()
    const auth = getAuth()
    const participantsRef = ref(db, '/provas/' + idMatch + '/participantes/')
    const athletesRef = ref(db, '/atletas')
    const matchRef = ref(db, `/provas/${idMatch}`) // referência à base de dados para ir buscar a prova que clicamos
    const userRef = ref(db, `/users/${auth.currentUser.uid}`);
    const clubsRef = ref(db, '/clubes/')

    const [numberOfJumps, setNumberOfJumps] = useState(0);

    const [match, setMatch] = useState(null)
    const [user, setUser] = useState(null)

    const [participants, setParticipants] = useState([])
    const [enrolledKey, setEnrolledKey] = useState('')
    const [enrolledIndex, setEnrolledIndex] = useState(-1)

    const [sportModality] = useSportModalities({ sportModalityId: match?.modalidade })

    const [inputChanged, setInputChanged] = useState(false);
    const [resultsChanged, setResultsChanged] = useState(false);

    // const [showLongJumpComponent, setShowLongJumpComponent] = useState(false);
    // const [showInsertResultsComponent, setShowInsertResultsComponent] = useState(false);
    const [showInsertResultsComponent, setShowInsertResultsComponent] = useState(false);

    const sortResultsEachAthlete = (a, b) => {


        if (sportModality?.nome === "Salto em altura") {
            if (a.altura < b.altura) return -1
            if (a.altura > b.altura) return 1
        }

        // return a.altura > b.altura ? -1 : 1
    }

    const sortHighestResultsTablePositionTRUE = ([, a], [, b]) => {

        if (sportModality?.unidade === 'segundos' || sportModality?.unidade === 'horas') {
            if (a.resultado === "" || a.resultado === null) return 1;
            if (b.resultado === "" || b.resultado === null) return -1;
            if (a.resultado === b.resultado) return 0;
            return a.resultado < b.resultado ? -1 : 1;
        }

        if (sportModality?.nome === 'Salto em altura') {

            const resultsA = a.resultado
            const resultsB = b.resultado

            const failedAttemptA = resultsA.find(result => {
                const attempts = result.tentativas
                const failedAttemptsHeight = attempts.every(attempt => !attempt)
                if (failedAttemptsHeight) return result
            })

            const failedAttemptB = resultsB.find(result => {
                const attempts = result.tentativas
                const failedAttemptsHeight = attempts.every(attempt => !attempt)
                if (failedAttemptsHeight) return result
            })

            if (resultsA.length !== 1 && resultsB.length !== 1) {
                if (failedAttemptA && failedAttemptB) {
                    console.log("AA", resultsA[resultsA.length - 2].altura, "BB", resultsB[resultsB.length - 2].altura)

                    if (resultsA[resultsA.length - 2].altura > resultsB[resultsB.length - 2].altura) return -1
                    if (resultsA[resultsA.length - 2].altura < resultsB[resultsB.length - 2].altura) return 1
                }
            }

            if (resultsA[resultsA.length - 1].altura > resultsB[resultsB.length - 1].altura) return -1
            if (resultsA[resultsA.length - 1].altura < resultsB[resultsB.length - 1].altura) return 1
        }
    }

    useEffect(() => {
        const handlerMatch = (snapshot) => {
            const matchObj = snapshot.val()
            setMatch(matchObj)

            // let userObj = await get(userRef)

            // setUser(userObj)

        }

        const closeFetchMatch = onValue(matchRef, handlerMatch)

        get(userRef).then((snapshot) => {
            setUser(snapshot.val())
        })

        return (() => {
            closeFetchMatch()
        })

    }, [])

    useEffect(() => {

        const handler = async (snapshot) => {

            let athletesSnapshot = await get(athletesRef);
            let clubsSnapshot = await get(clubsRef);

            let athletes = {}
            let clubs = {}

            clubsSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                clubs[childKey] = childData;
            })

            athletesSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.genero === match.genero) {
                    athletes[childKey] = childData;
                    athletes[childKey].clube = clubs[childData.clube];
                }
            });

            let enrolledResults = {}
            let enrolledResultsArray = []

            snapshot.forEach((childSnapshot) => {
                const idParticipant = childSnapshot.key
                const idAthlete = childSnapshot.val().atleta;
                const result = childSnapshot.val().resultado

                athletes[idAthlete].resultado = result || ''
                enrolledResults[idParticipant] = athletes[idAthlete]

                enrolledResultsArray = Object.entries(enrolledResults)

                enrolledResultsArray.map(enrolledResult => {
                    const result = enrolledResult[1].resultado
                    // let sortedResultsOfEachAthlete = []
                    // sortedResultsOfEachAthlete = 

                    if (sportModality?.unidade === 'metros') result.sort(sortResultsEachAthlete)

                    // console.log("xx", result)
                    // sortedResultsOfEachAthlete.sort(sortHighestResultsTablePosition)
                    // console.log("SSS", sortedResultsOfEachAthlete)
                    return enrolledResult
                })

                for (let i = 0; i < enrolledResultsArray.length; i++) {
                    enrolledResultsArray.sort(sortHighestResultsTablePositionTRUE)
                }
            });

            setParticipants(enrolledResultsArray)

        }

        const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

        return (() => {
            match && closeParticipantsOnvalue()
        })

    }, [match, sportModality])

    const goToPreviousScreen = () => {
        if (inputChanged) {
            Alert.alert(
                "Tens a certeza?",
                "Vais perder as alterações que fizeste.",
                [
                    {
                        text: 'Sim',
                        onPress: () => {
                            navigation.goBack()
                        },
                    },
                    {
                        text: 'Não',
                    },
                ]
            )
        } else {
            navigation.goBack()
        }
    }



    const addResult = (participants) => {

        const updates = {}
        let resultsArray = []

        // const enrolledResultsArray = Object.entries(enrolledResults)

        participants.forEach((participant) => {

            const participantKey = participant[0]
            const participantResult = participant[1].resultado

            resultsArray.push(participantResult)
            updates[`/provas/${idMatch}/participantes/${participantKey}/resultado/`] = participantResult || ''

            // updates[`/provas/${idMatch}/participantes/${idParticipant}/resultado/`] = result

            // resultsArray.push(result)

        })

        console.log("blabla", resultsArray)

        if (resultsArray.every(result => result !== null && result !== undefined && result !== "")) {
            updates[`/provas/${idMatch}/estado/`] = "finalizada"
        }


        update(ref(db), updates)

        setResultsChanged(true);

        setInputChanged(false)

        Keyboard.dismiss();

        setTimeout(() => {
            setResultsChanged(false)
        }, 1500);

        // Alert.alert('Resultados adicionados com sucesso.')
    }

    const setResultOnIndex = (result, index) => {
        setInputChanged(true)
        let clonedEnrolled = [...participants]
        // let newResult = Object.assign({}, enrolled)
        // console.log(valResultado, index, results, inscritos)
        // newResult[index] = valResultado;

        clonedEnrolled[index][1].resultado = result

        setParticipants(clonedEnrolled)
    }

    const openComponentToInsertResults = (enrolledKey, enrolledIndex) => {

        if (sportModality.nome === 'Salto em comprimento') {
            if (numberOfJumps !== 0) {
                // setShowLongJumpComponent(true)
                setShowInsertResultsComponent(true)
                setEnrolledKey(enrolledKey)
                setEnrolledIndex(enrolledIndex)
            } else {
                Alert.alert('Selecione o número de saltos da prova.')
            }
        }

        if (sportModality.nome === 'Salto em altura') {
            // setShowLongJumpComponent(true)
            setShowInsertResultsComponent(true)
            setEnrolledKey(enrolledKey)
            setEnrolledIndex(enrolledIndex)
        }
    }

    const getHighestValueOfJump = (results) => {
        let highestLegalResult = 0

        if (sportModality.nome === 'Salto em altura') {
            const failedAttempt = results.find(result => {
                const attempts = result.tentativas
                const failedAttemptsHeight = attempts.every(attempt => !attempt)
                if (failedAttemptsHeight) return result
            })

            if (results.length === 1 && results.length !== 0) {
                highestLegalResult = results[results.length - 1].altura
            } else {
                failedAttempt ? highestLegalResult = results[results.length - 2].altura : highestLegalResult = results[results.length - 1].altura
            }
            return highestLegalResult
        }
    }

    const maskInputCreator = (key, index) => {
        let sportModalityMaskInput;

        if (match.estado === "ativa") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={participants[index][1].resultado + 's' || ''}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, index)}
                    mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                    placeholder='00:00s' />
            }
            else if (sportModality.unidade === "horas") {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={participants[index][1].resultado ? participants[index][1].resultado + 'h': ''}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, index)}
                    mask={[/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]}
                    placeholder='hh:mm:ss' />
            }
            else if (sportModality.unidade === 'metros') {
                sportModalityMaskInput = <MaterialIcon style={styles.showAddResultsIcon} name='post-add' color='white' size={32}
                    onPress={() => openComponentToInsertResults(key, index)} />
            }
        } else if (match.estado === "finalizada") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={participants[index][1].resultado + 's' || ''}
                    editable={false}
                    selectTextOnFocus={false}
                />
            } else if (sportModality.unidade === 'horas') {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={participants[index][1].resultado + 'h' || ''}
                    editable={false}
                    selectTextOnFocus={false}
                />
            }
            else if (sportModality.unidade === 'metros' && sportModality.nome === 'Salto em comprimento') {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={participants[index][1].resultado.length === 0 ? '' : participants[index][1].resultado[0].marca + 'm' || ''}
                    editable={false}
                    selectTextOnFocus={false}
                />
            }
            else if (sportModality.unidade === 'metros' && sportModality.nome === 'Salto em altura') {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    // value={enrolled[index][1].resultado.length === 0 ? '' : enrolled[index][1].resultado[0].altura + ' m' || ''}
                    value={participants[index][1].resultado.length === 0 ? '' : getHighestValueOfJump(participants[index][1].resultado) + 'm' || ''}
                    editable={false}
                    selectTextOnFocus={false}
                />
            }
        } else if (match.estado === "emInscricoes") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <TextInput
                    style={styles.textInput}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00:00s' />

            } else if (sportModality.unidade === 'metros') {
                // sportModalityMaskInput = <Pressable style={{ width: 100, height: 32, backgroundColor: 'white', }} onPress={() => { setShowLongJumpComponent(true) }} ><Text>CLICK</Text></Pressable>
                sportModalityMaskInput = <Pressable style={styles.textInput} disabled onPress={() => { setShowLongJumpComponent(true) }} ><Text>CLICK</Text></Pressable>
                // sportModalityMaskInput = <Button title='CLICK' onPress={() => { setShowLongJumpComponent(true) }}>CLICK</Button>
                // sportModalityMaskInput = <TextInput
                //     style={styles.textInput}
                //     editable={false}
                //     selectTextOnFocus={false}
                //     placeholder='00.00m' />
            }
        }

        return sportModalityMaskInput
    }

    return (
        Object.entries(participants).length === 0 ? (
            <View style={styles.container}>
                <Header
                    statusBarProps={
                        {
                            backgroundColor: 'transparent',
                            translucent: true,
                        }
                    }
                    containerStyle={{ margin: 0, padding: 0, height: 100, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                    backgroundColor='#1375BC'
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#1375BC', '#1794e8'],
                        start: { x: 0.1, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    leftComponent={
                        <View style={styles.headerContainer}>
                            <IoniIcon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
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
                    statusBarProps={
                        {
                            backgroundColor: 'transparent',
                            translucent: true,
                        }
                    }
                    containerStyle={{ margin: 0, padding: 0, height: 100, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                    backgroundColor='#1375BC'
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#1375BC', '#1794e8'],
                        start: { x: 0.1, y: 0.5 },
                        end: { x: 1, y: 0.5 },
                    }}
                    leftComponent={
                        <View style={styles.headerContainer}>
                            <IoniIcon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                            <Text style={styles.headerTitle}>Participantes</Text>
                        </View>
                    }
                    rightComponent={
                        inputChanged &&
                        <View style={styles.headerContainer}>
                            <IoniIcon name='checkmark-sharp' style={styles.headerIcon} size={24} onPress={() => addResult(participants)} />
                        </View>
                    }
                />

                {showInsertResultsComponent && {
                    "Salto em altura": <HighJumpComponent enrolled={participants} setEnrolled={setParticipants} enrolledIndex={enrolledIndex}
                        inputChanged={inputChanged} setInputChanged={setInputChanged} setShowInsertResultsComponent={setShowInsertResultsComponent} />,
                    "Salto em comprimento": <LongJumpComponent enrolled={participants} setEnrolled={setParticipants} enrolledKey={enrolledKey}
                        enrolledIndex={enrolledIndex} setShowInsertResultsComponent={setShowInsertResultsComponent} numberOfJumps={numberOfJumps}
                        inputChanged={inputChanged} setInputChanged={setInputChanged} />

                }[sportModality.nome]}

                {sportModality.nome === 'Salto em comprimento' &&
                    <View style={styles.numberOfJumpsContainer}>
                        <Text style={styles.numberOfJumpsLabel}>Número de saltos: {numberOfJumps}</Text>
                        <View style={styles.numberOfJumpsButtonsContainer}>
                            <Pressable style={styles.numberOfJumpsButton} onPress={() => setNumberOfJumps(3)}>
                                <Text style={styles.numberOfJumpsButtonText}>3</Text>
                            </Pressable>
                            <Pressable style={styles.numberOfJumpsButton} onPress={() => setNumberOfJumps(6)}>
                                <Text style={styles.numberOfJumpsButtonText}>6</Text>
                            </Pressable>
                        </View>
                    </View>
                }

                <ScrollView style={styles.listContainer}>

                    {participants.map((participant, index) => {
                        return (
                            <View key={index} style={styles.cardsContainer}>
                                <View style={styles.listRowsContainer}>
                                    <Text style={styles.listInfoParticipantTablePositionText}>{index + 1}º</Text>
                                    <Text style={styles.listInfoNameText}>{participant[1].nome}</Text>
                                    <Text style={styles.listInfoClubText}>{participant[1].clube.sigla}</Text>
                                    <Text style={styles.listInfoAgeGroupText}>{participant[1].escalao.substring(0, 3)}</Text>
                                    {maskInputCreator(participant[0], index)}
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>

                <Toast toastTrigger={resultsChanged} />
            </View>
        )
    )
}

export default AthleticsTestScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
    },
    headerIcon: {
        marginStart: 16,
        color: 'white',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        width: 180,
        marginLeft: 16,
        color: 'white'
    },
    noAthleteText: {
        fontSize: 20,
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        height: '100%',
    },
    numberOfJumpsLabel: {
        fontSize: 18,
        color: 'black',
        marginVertical: 8,
    },
    numberOfJumpsContainer: {
    },
    numberOfJumpsButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    numberOfJumpsButton: {
        width: 40,
        height: 40,
        borderRadius: 24,
        backgroundColor: 'grey',
    },
    numberOfJumpsButtonText: {
        width: 40,
        height: 40,
        borderRadius: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        color: 'white',
    },
    cardsContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
        height: 64,
        padding: 0,
        marginVertical: 8,
        borderRadius: 16,
    },
    listRowsContainer: {
        height: 64,
        paddingLeft: 8,
        backgroundColor: '#464646',
        width: '100%',
        borderRadius: 16,
        position: 'relative',
        elevation: 4,
        shadowColor: "#000",
    },
    infoTextContainer: {
        flex: 1,
    },
    listInfoParticipantTablePositionText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 16,
    },
    listInfoNameText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 48,
    },
    listInfoClubText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 172,
    },
    listInfoAgeGroupText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 250,
    },
    listInfoResultText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 320,
    },
    listGenderIconContainer: {
        position: 'absolute',
        top: 22,
        left: 270,
    },
    showAddResultsIcon: {
        position: 'absolute',
        top: 15,
        left: 320,
    },
    textInput: {
        borderBottomWidth: 3,
        borderColor: 'white',
        backgroundColor: '#464646',
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 12,
        left: 300,
        width: 80,
        height: 40,
    },
    textInputFocused: {
        borderBottomWidth: 3,
        borderColor: '#00D448',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 12,
        left: 300,
        width: 80,
        height: 40,
        paddingStart: 8,
    },
})