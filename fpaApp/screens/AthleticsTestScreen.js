import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, orderByChild, equalTo, query, set, update } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';

const AthleticsTestScreen = ({route}) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const idProva = route.params.idProva

    const navigation = useNavigation()

    const db = getDatabase()
    const participantesRef = ref(db, '/provas/' + idProva + '/participantes/')
    const atletasRef = ref(db, '/atletas')

    const [participante, setParticipante] = useState([])
    const [atleta, setAtleta] = useState([])
    const [atletaIgual, setAtletaIgual] = useState([])
    const [resultados, setResultados] = useState({})

    useEffect(() => {
        // Busca dos participantes existentes na prova que selecionamos no ecrã anterior
        let participantes = []
        
        onValue(participantesRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              participantes.push([childKey, childData])
            });
            setParticipante(participantes)

            // Preencher objeto com 
            let newResultados = {}
            for([key, data] of participantes){
                newResultados[key] = data.resultado||''
            }
            setResultados(newResultados)
            console.log(newResultados)
        }, {
            onlyOnce: true
        });
    }, [])

    useEffect(() => {
        let atletas = []
        onValue(atletasRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // if(childKey == participante[0][1].atleta) {
                //     console.log(childData)
                //     atletas.push(childData)
                // }
                atletas.push([childKey, childData])
                
            });
            setAtleta(atletas)
        }, {
            onlyOnce: true
        });
    }, [])

    useEffect(() => {
        let atletasIguais = []
        atleta.map(([key, value]) => {
            participante.map(([keyParticipante, valueParticipante]) => {
                if(key == valueParticipante.atleta){
                    atletasIguais.push([keyParticipante, [value, valueParticipante]])
                }
            })
        })
        setAtletaIgual(atletasIguais)
    }, [atleta])

    const voltarBotao = () => {
        navigation.goBack()
    }

    const adicionarResultado = (participantes, resultados) => {
        // set(ref(db, '/provas/' + idProva + '/participantes/' + idParticipante + '/resultado/'), {
        //     resultado: resultado,
        // })

        // const resultadoParticipante = {
        //     resultado: res
        // }
        const updates = {}
        participantes.forEach((participante, index) => {
            updates['/provas/' + idProva + '/participantes/' + participante + '/resultado/'] = resultados[index]
            // resultados.forEach((resultado) => {
                
            // })
        })

        update(ref(db), updates)

        Alert.alert('Resultados adicionados com sucesso.')
    }

    const setResultadoOnIndex = (valResultado, index) => {
        let newResultado = Object.assign({}, resultados)
        newResultado[index] = valResultado;
        setResultados(newResultado)
    }

    return (
        <View style={styles.container}>
            <Header 
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => voltarBotao()}/>
                        <Text style={styles.headerTitle}>Participantes</Text>
                    </View>
                }
            />

            <View style={styles.labelContainer}>
                <Text style={styles.labelNome}>Nome</Text>
                <Text style={styles.labelClube}>Clube</Text>
                <Text style={styles.labelEscalao}>Escalão</Text>
                <Text style={styles.labelMarca}>Marca</Text>
            </View>
            <ScrollView style={styles.listContainer}>
                {atletaIgual.map(([key, value], index) => {
                    
                    return(
                        <View key={index}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                            <ListItem style={styles.listCard}>
                                <ListItem.Content style={styles.listRowsContainer}>
                                    <ListItem.Title style={[styles.listRow, styles.listName]}>{value[0].nome}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listTeam]}>{value[0].clube}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listAge]}>{value[0].escalao.substring(0, 3)}</ListItem.Title>
                                    <TextInput style={styles.textInput} value={resultados[key]||''} onChangeText={text => setResultadoOnIndex(text, key)} placeholder='Resultado'></TextInput>
                                    {/* {console.log(resultado)} */}
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
    listContainer: {
        width: '100%',
    },
    listCard: {
        borderWidth: 1,
        borderColor: 'rgb(200,200,200)',
    },
    listRowsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
    },
    listRow: {
        fontSize: 18,
    },
    listName: {
        flex: 2,
        marginStart: 5,
    },
    listTeam: {
        flex: 1,
    },
    listAge: {
        flex: 1,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgb(120, 120, 120)',
        padding: 5,
        fontSize: 16,
        height: 30,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        marginTop: 20,
        backgroundColor: '#5A79BA',
    },
    labelNome: {
        flex: 1.6,
        marginStart: 28,
        color: 'white',
    },
    labelClube: {
        flex: 0.8,
        color: 'white',
    },
    labelEscalao:{
        flex: 1,
        color: 'white',
    },
    labelMarca:{
        flex: 1,
        color: 'white',
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