import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, Animated, Keyboard } from 'react-native'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import { Header } from 'react-native-elements'
import { getDatabase, ref, onValue, get, update } from "firebase/database";
import { getAuth } from 'firebase/auth';

import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from './Toast';
import useSportModalities from './useSportModalities';

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

    const [sportModality] = useSportModalities({ sportModalityId: match?.modalidade })

    const [inputChanged, setInputChanged] = useState(false);
    const [resultsChanged, setResultsChanged] = useState(false);

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

    const sortFunction = ([, a], [, b]) => {
        if (sportModality?.unidade === "segundos") {
            if (a.resultado === "" || a.resultado === null) return 1;
            if (b.resultado === "" || b.resultado === null) return -1;
            if (a.resultado === b.resultado) return 0;
            return a.resultado < b.resultado ? -1 : 1;
        } else if (sportModality?.unidade === "metros") {
            if (a.resultado === "" || a.resultado === null) return 1;
            if (b.resultado === "" || b.resultado === null) return -1;
            if (a.resultado === b.resultado) return 0;
            return a.resultado > b.resultado ? -1 : 1;
        }
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

                for (let i = 0; i < enrolledResultsArray.length; i++) {
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

    const setResultOnIndex = (valResultado, index, mask) => {
        // let newResult = Object.assign({}, results)
        console.log(mask)
        let regex = new RegExp(mask)
        setInputChanged(true)
        let newResult = Object.assign({}, inscritos)
        // console.log(valResultado, index, results, inscritos)
        // newResult[index] = valResultado;

        newResult[index][1].resultado = valResultado

        if(regex.test(valResultado)) {
            console.log("igual", valResultado, mask)
        } else {
            console.log("nao igual", valResultado, mask)
        }

        setAtletas(newResult)
    }

    const maskInputCreator = (key) => {
        let sportModalityMaskInput;

        let secondsMask = "[d, d, ':', d, d, 's']$"

        // [/\d/, /\d/, ':', /\d/, /\d/, 's']
        // let secondsMask = `${}`

        // let aa = /(\d\d:\d\ds)/
        // let bb = /\d\d:\d\ds/

        if (match.estado === "ativa") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={inscritos[key][1].resultado || ''}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, key, secondsMask)}
                    mask={[/\d/, /\d/, ':', /\d/, /\d/, 's']}
                    placeholder='00:00s' />

            } else if (sportModality.unidade === 'metros') {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={inscritos[key][1].resultado || ''}
                    editable={user.autorizado ? true : false}
                    selectTextOnFocus={user.autorizado ? true : false}
                    onChangeText={text => setResultOnIndex(text, key)}
                    mask={[/\d/, /\d/, '.', /\d/, /\d/, 'm']}
                    placeholder='00.00m' />

            }
        } else if (match.estado === "finalizada") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={inscritos[key][1].resultado || ''}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00:00s' />

            } else if (sportModality.unidade === 'metros') {
                sportModalityMaskInput = <MaskInput
                    style={styles.textInput}
                    value={inscritos[key][1].resultado || ''}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00.00m' />

            }
        } else if (match.estado === "emInscricoes") {
            if (sportModality.unidade === "segundos") {
                sportModalityMaskInput = <TextInput
                    style={styles.textInput}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder='00:00s' />

            } else if (sportModality.unidade === 'metros') {
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
                    statusBarProps={
                        {
                            backgroundColor: 'transparent',
                            translucent: true,
                        }
                    }
                    // containerStyle={{ margin: 0, padding: 0, height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                    containerStyle={{ margin: 0, padding: 0, height: 100, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
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
                    // containerStyle={{ margin: 0, padding: 0, height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
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
                            {/* <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => { inputChanged ? console.log("QUER VOLTAR ATRÁS?") : goToPreviousScreen() }} /> */}
                            <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                            <Text style={styles.headerTitle}>Participantes</Text>
                        </View>
                    }
                    rightComponent={
                        inputChanged &&
                        <View style={styles.headerContainer}>
                            <Icon name='checkmark-sharp' style={styles.headerIcon} size={24} onPress={() => addResult(inscritos)} />
                        </View>
                    }
                />

                <ScrollView style={styles.listContainer}>

                    {Object.entries(inscritos).map(([key, value], index) => {
                        return (
                            <View key={key} style={styles.cardsContainer}>
                                <View style={styles.listRowsContainer}>


                                    <Text style={styles.listInfoParticipantTablePositionText}>{index + 1}º</Text>

                                    <Text style={styles.listInfoNameText}>{value[1].nome}</Text>

                                    <Text style={styles.listInfoClubText}>{value[1].clube}</Text>

                                    <Text style={styles.listInfoAgeGroupText}>{value[1].escalao.substring(0, 3)}</Text>

                                    {maskInputCreator(key)}


                                    {/* <Text style={styles.listInfoResultText}>{props.result}</Text> */}

                                    {/* <View style={styles.listGenderIconContainer}>
            {props.genero}
        </View> */}
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
        // backgroundColor: '#ff7700',
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
    textInput: {
        borderBottomWidth: 3,
        borderColor: 'white',
        // borderColor: 'rgba(255, 246, 0, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        // backgroundColor: 'rgba(255, 246, 0, 0.5)',
        fontSize: 16,
        color: 'white',
        // opacity: 1,
        position: 'absolute',
        top: 12,
        left: 300,
        width: 80,
        height: 40,
        paddingStart: 8,
        // borderRadius: 16,
    },
    textInputFocused: {
        borderBottomWidth: 3,
        borderColor: '#00D448',
        // borderColor: 'rgba(255, 246, 0, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        // backgroundColor: 'rgba(255, 246, 0, 0.5)',
        fontSize: 16,
        color: 'white',
        // opacity: 1,
        position: 'absolute',
        top: 12,
        left: 300,
        width: 80,
        height: 40,
        paddingStart: 8,
        // borderRadius: 16,
    },
    // listContainer: {
    //     width: '100%',
    // },
    // listCard: {
    //     borderWidth: 1,
    //     borderColor: 'rgb(200,200,200)',
    // },
    // listRowsContainer: {
    //     flexDirection: 'row',
    // },
    // listName: {
    //     flex: 2,
    // },
    // listRow: {
    //     flex: 1,
    //     textAlign: 'center',
    // },
    // textInput: {
    //     borderWidth: 0.5,
    //     // borderRadius: 4,
    //     borderColor: 'rgb(120, 120, 120)',
    //     flex: 0.8,
    //     padding: 5,
    //     height: 30,
    // },
    // labelContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    // },
    // labelNome: {
    //     marginStart: 24,
    //     marginEnd: 128,
    // },
    // labelRow: {
    //     marginEnd: 32,
    //     textAlign: 'center',
    // },
    // btnPressable: {
    //     marginTop: 50,
    //     alignSelf: 'center',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: '#5A79BA',
    //     height: 40,
    //     width: 150,
    //     borderRadius: 5,
    // },
    // btnPressableHide: {
    //     display: 'none',
    // },
    // textPressable: {
    //     color: 'white',
    //     fontSize: 18,
    //     fontWeight: 'bold'
    // },
})