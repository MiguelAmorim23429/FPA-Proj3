import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
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

    const [participante, setParticipante] = useState([])
    const [atleta, setAtleta] = useState([])
    const [atletaIgual, setAtletaIgual] = useState([])
    const [resultados, setResultados] = useState({})

    const [prova, setProva] = useState(null)
    const [inscritos, setAtletas] = useState({})

    useEffect(() => {
        get(provaRef).then((snapshot) => {
            setProva(snapshot.val())
        })

        console.log(prova)
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

            console.log("BATATAS")

            // console.log("aa" + atletas)

            let inscritos = {}
            let newResultados = {}

            snapshot.forEach((childSnapshot) => {
                const participanteId = childSnapshot.key
                const atletaId = childSnapshot.val().atleta;
                const resultado = childSnapshot.val().resultado

                console.log(`id participante: ${participanteId}`)
                console.log(`resultado: ${resultado}`)
                newResultados[participanteId] = resultado || ''
                // console.log("İrem")
                console.log(newResultados)
                // console.log("Pedro")
                inscritos[participanteId] = atletas[atletaId]
            });

            console.log(inscritos)

            console.log("ARROZ")

            setAtletas(inscritos)


            // for([key, data] of Object.entries(inscritos)){
            //     console.log(key)
            //     console.log(data)
            //     newResultados[key] = data.resultado||''
            // }

            console.log(newResultados)
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

    // useEffect(() => {
    //     // Busca dos participantes existentes na prova que selecionamos no ecrã anterior
    //     let participantes = []

    //     onValue(participantesRef, (snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //           const childKey = childSnapshot.key;
    //           const childData = childSnapshot.val();
    //           participantes.push([childKey, childData])
    //         });
    //         setParticipante(participantes)

    //         // Preencher objeto com 
    //         let newResultados = {}
    //         for([key, data] of participantes){
    //             newResultados[key] = data.resultado||''
    //         }
    //         setResultados(newResultados)
    //         console.log("CARNEE")
    //         console.log(newResultados)
    //     }, {
    //         onlyOnce: true
    //     });
    // }, [])

    // useEffect(() => {
    //     let atletas = []
    //     onValue(atletasRef, (snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             // if(childKey == participante[0][1].atleta) {
    //             //     console.log(childData)
    //             //     atletas.push(childData)
    //             // }
    //             atletas.push([childKey, childData])

    //         });
    //         setAtleta(atletas)
    //     }, {
    //         onlyOnce: true
    //     });
    // }, [])

    // useEffect(() => {
    //     let atletasIguais = []
    //     atleta.map(([key, value]) => {
    //         participante.map(([keyParticipante, valueParticipante]) => {
    //             if(key == valueParticipante.atleta){
    //                 atletasIguais.push([keyParticipante, [value, valueParticipante]])
    //             }
    //         })
    //     })
    //     setAtletaIgual(atletasIguais)
    // }, [atleta])

    const voltarBotao = () => {
        navigation.goBack()
    }

    const setResultadoOnIndex = (valResultado, index) => {
        let newResultado = Object.assign({}, resultados)

        newResultado[index] = valResultado;
        // console.log(newResultado)
        setResultados(newResultado)
        console.log(resultados)
    }

    return (
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
                    // console.log(`chave: ${key} com valor: ${value} e index: ${index}`)

                    return (
                        <View key={index}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                                <ListItem style={styles.listCard}>
                                    <ListItem.Content style={styles.listRowsContainer}>
                                        <ListItem.Title style={styles.listName}>{value.nome}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.clube}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{resultados[key] || ''}</ListItem.Title>
                                        {/* {console.log(resultado)} */}
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