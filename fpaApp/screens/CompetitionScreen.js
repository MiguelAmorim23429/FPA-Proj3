import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild} from "firebase/database"
import { ListItem, Header } from 'react-native-elements'

const CompetitionScreen = ({route}) => {

    // Variável com o valor do idCompeticao da competição em que se clicou no ecrã anterior
    const idCompeticao = route.params.idComp

    // Referência ao sítio a que se vai buscar os dados na base de dados.
    const db = getDatabase();
    const provasRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idCompeticao))

    const [prova, setProva] = useState([])

    useEffect(() => {
        // Busca das provas existentes na competicao com id: 'competicao1'
        onValue(provasRef, (snapshot) => {
            let provas = [] 

            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              provas.push([childKey, childData])
            });
            setProva(provas)
            // console.log(provas)
        }, {
            onlyOnce: true
        });
    }, [])
    
    return (
        <View style={styles.container}>
            <Header 
                leftComponent={{text:'Provas', style: {fontSize: 20, fontWeight: 'bold', width: 150, marginLeft: 10, color: 'white'}}}
            />

            <ScrollView style={styles.listContainer}>
                {prova.map(([key, value]) => {
                    return(
                        <View key={key}>
                            <TouchableOpacity onPress={() => console.log(key)}>
                            <ListItem style={styles.listCard}>
                                <ListItem.Content style={styles.listRowsContainer}>
                                    <ListItem.Title style={styles.listRow}>{value.nome}</ListItem.Title>
                                    <ListItem.Title style={styles.listRow}>{value.genero}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            </TouchableOpacity>
                        </View>
                    )
                })
                }
            </ScrollView>
        </View>
    )
}

export default CompetitionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    }
})
