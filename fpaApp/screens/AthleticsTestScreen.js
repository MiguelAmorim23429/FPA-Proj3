import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const idProva = route.params.idProva

    const navigation = useNavigation()

    const db = getDatabase()
    const participantesRef = ref(db, '/provas/' + idProva + '/participantes/')
    const atletasRef = ref(db, '/atletas')
    const provaRef = ref(db, `/provas/${idProva}`) // referência à base de dados para ir buscar a prova que clicamos
    const modalidadesRef = ref(db, `modalidades`)

    const [resultados, setResultados] = useState({})

    const [prova, setProva] = useState(null)
    const [inscritos, setAtletas] = useState({})
    const [modalidades, setModalidades] = useState({})

    useEffect(() => {
        get(provaRef).then((snapshot) => {
            setProva(snapshot.val())
        })
    }, [])

    useEffect(() => {

        const handler = async (snapshot) => {

            let atletasSnapshot = await get(atletasRef)

            let atletas = {}

            atletasSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.genero == prova.genero) {
                    atletas[childKey] = childData
                }
            });

            let modalidadesSnapshot = await get(modalidadesRef)

            let modalidades = {}

            modalidadesSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childKey == prova.modalidade) {
                    modalidades[childKey] = childData.unidade
                }
            })

            setModalidades(modalidades)

            let inscritos = {}
            let newResultados = {}

            snapshot.forEach((childSnapshot) => {
                const participanteId = childSnapshot.key
                const atletaId = childSnapshot.val().atleta;
                const resultado = childSnapshot.val().resultado

                newResultados[participanteId] = resultado || ''
                inscritos[participanteId] = atletas[atletaId]
            });

            setAtletas(inscritos)
            setResultados(newResultados)

        }

        if (prova) {
            onValue(participantesRef, handler)
        }

        return (() => {
            if (prova) {
                off(handler)
            }
        })
    }, [prova])

    const voltarBotao = () => {
        navigation.goBack()
    }

    const adicionarResultado = (participantes, resultados) => {

        const updates = {}
        participantes.forEach((participante, index) => {
            updates['/provas/' + idProva + '/participantes/' + participante + '/resultado/'] = resultados[index]
        })

        update(ref(db), updates)

        Alert.alert('Resultados adicionados com sucesso.')
    }

    const setResultadoOnIndex = (valResultado, index) => {
        let newResultado = Object.assign({}, resultados)

        newResultado[index] = valResultado;
        setResultados(newResultado)
    }

    const maskInputCreator = (key) => {
        let maskInputModalidade;

        if (Object.values(modalidades).includes("segundos")) {
            maskInputModalidade = <MaskInput style={styles.textInput} value={resultados[key] || ''} onChangeText={text => setResultadoOnIndex(text, key)} mask={[/\d/, /\d/, ':', /\d/, /\d/, 's']} placeholder='00:00s' />
        } else if (Object.values(modalidades).includes("metros")) {
            maskInputModalidade = <MaskInput style={styles.textInput} value={resultados[key] || ''} onChangeText={text => setResultadoOnIndex(text, key)} mask={[/\d/, /\d/, '.', /\d/, /\d/, 'm']} placeholder='00.00m' />
        }

        return maskInputModalidade
    }

    return (
        Object.entries(inscritos).length == 0 ? (
            <View style={styles.container}>
                <Header
                    leftComponent={
                        <View style={styles.headerContainer}>
                            <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => voltarBotao()} />
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
                            <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => voltarBotao()} />
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
                                            <ListItem.Title style={styles.listName}>{value.nome}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value.clube}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                                            {maskInputCreator(key)}
                                        </ListItem.Content>
                                    </ListItem>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    <Pressable
                        style={styles.btnPressable}
                        onPress={() => adicionarResultado(Object.keys(resultados), Object.values(resultados))}>
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