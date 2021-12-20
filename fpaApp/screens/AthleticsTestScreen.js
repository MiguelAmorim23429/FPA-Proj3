import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, orderByChild, equalTo, query, set } from "firebase/database";

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
        // Busca dos participantes existentes na prova com id: 'prova1'
        let participantes = []
        
        onValue(participantesRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              participantes.push([childKey, childData])
            });
            setParticipante(participantes)
            let newResultados = {}
            for([key, data] of participantes){
                newResultados[key] = data.resultado||''
            }
            setResultados(newResultados)
            // console.log(participantes[0][1].atleta)
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

    const adicionarResultado = (idParticipante, resultado) => {
        // console.log()
        set(ref(db, 'provas/participantes/' + idParticipante), {
            resultado: resultado,
        })
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
                    <View style={{marginStart: 10}}>
                        <Icon name='arrow-back' color='white' onPress={() => voltarBotao()}/>
                    </View>
                }
                centerComponent={{text:'Participantes', style: {fontSize: 20, fontWeight: 'bold', width: 150, color: 'white'}}}
            />

            <View style={styles.labelContainer}>
                <Text style={styles.labelName}>Nome</Text>
                <Text style={styles.labelTeam}>Clube</Text>
                <Text style={styles.labelAge}>Escalão</Text>
                <Text></Text>
            </View>
            <ScrollView style={styles.listContainer}>
                {atletaIgual.map(([key, value], index) => {
                    let escalao = ''
                    if(value[0].escalao == 'INICIADOS'){
                        escalao = <Text>INI</Text>
                    } else if(value[0].escalao == 'JUNIORES'){
                        escalao = <Text>JUN</Text>
                    }
                    console.log(index)

                    return(
                        <View key={index}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                            <ListItem style={styles.listCard}>
                                <ListItem.Content style={styles.listRowsContainer}>
                                    <ListItem.Title style={[styles.listRow, styles.listName]}>{value[0].nome}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listTeam]}>{value[0].clube}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listAge]}>{escalao}</ListItem.Title>
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
                    onPress={() => console.log(resultados)}>
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
        // backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
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
    },
    labelName: {
        flex: 1,
        marginStart: 30,
    },
    labelTeam: {
        flex: 0.6,
    },
    labelAge:{
        flex: 1.6,
    },
    btnPressable: {
        marginTop: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
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