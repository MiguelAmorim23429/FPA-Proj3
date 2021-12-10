import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Header, Icon, ListItem } from 'react-native-elements'
import { getDatabase, ref, onValue, orderByChild, equalTo, query } from "firebase/database";

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

    return (
        <View style={styles.container}>
            <Header 
                leftComponent={
                    <View>
                        <Icon name='arrow-back' color='white' onPress={() => voltarBotao()}/>
                    </View>
                }
                centerComponent={{text:'Participantes', style: {fontSize: 20, fontWeight: 'bold', width: 150, color: 'white'}}}
            />

            <ScrollView style={styles.listContainer}>
                {atletaIgual.map(([key, value]) => {
                    return(
                        <View key={key}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                            <ListItem style={styles.listCard}>
                                <ListItem.Content style={styles.listRowsContainer}>
                                    <ListItem.Title style={styles.listRow}>{value[0].nome}</ListItem.Title>
                                    <ListItem.Title style={styles.listRow}>{value[0].genero}</ListItem.Title>
                                    <TextInput style={styles.textInput} placeholder='Resultado'>{value[1].resultado}</TextInput>
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
        marginEnd: 20,
    },
    textInput: {
        //borderStyle: 'solid',
        borderWidth: 2,
        // borderColor: '#000',
        borderColor: 'rgb(120, 120, 120)',
        padding: 5,
        // marginBottom: 25,
        width: 100,
        marginStart: 130,
        fontSize: 16,
    },
})
