import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild } from "firebase/database"
import { ListItem, Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

const CompetitionScreen = ({ route }) => {

    // Variável com o valor do idCompeticao da competição em que se clicou no ecrã anterior
    const idCompetition = route.params.idComp
    const navigation = useNavigation()

    // Referência ao sítio a que se vai buscar os dados na base de dados.
    const db = getDatabase();
    const matchesRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idCompetition))

    const [matchesById, setMatches] = useState([])

    useEffect(() => {
        // Busca das provas existentes na competicao que selecionamos no ecrã anterior
        onValue(matchesRef, (snapshot) => {
            let matchesArray = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                matchesArray.push([childKey, childData])
            });
            setMatches(matchesArray)
        }, {
            onlyOnce: true
        });
    }, [])

    // Clicar no Card e redirecionar para outro ecrã com a lista de provas dessa competição selecionada.
    const escolherProva = (val) => {
        for(let match of matchesById) {
            if(match[0] == val) {
                if(match[1].estado == "finalizada") {
                    navigation.navigate('AthleticsTest', { idProva: val })
                } else if(match[1].estado == "ativa"){
                    Alert.alert('Esta prova ainda se encontra a decorrer.')
                } else if(match[1].estado == "emInscricoes") {
                    Alert.alert('Esta prova ainda está em fase de inscrições.')
                }
            }
        }        
    }

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Header
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                        <Text style={styles.headerTitle}>Provas</Text>
                    </View>
                }
            />

            <View style={styles.labelContainer}>
                <Text style={styles.labelHora}>Hora</Text>
                <Text style={styles.item_label}>Prova</Text>
                <Text style={styles.item_label}>Escalão</Text>
                <Text style={styles.item_label}>Género</Text>
            </View>

            <ScrollView style={styles.listContainer}>
                {matchesById.map(([key, value]) => {

                    const genders = {
                        "Masculino": <Icon name='male-sharp' size={20} color='#03A3FF' />,
                        "Feminino": <Icon name='female-sharp' size={20} color='#EC49A7' />,
                    }

                        return (
                            <View key={key}>
                                <TouchableOpacity onPress={() => escolherProva(key)}>
                                    <ListItem style={styles.listCard}>
                                        <ListItem.Content style={styles.listRowsContainer}>
                                            <ListItem.Title style={styles.listHora}>{value.hora}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value.categoria}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                                            <ListItem.Title style={styles.listRow}>{genders[value.genero]}</ListItem.Title>
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
        alignItems: 'center',
        justifyContent: 'center',
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
    listHora: {
        flex: 1,
        marginStart: 24,
    },
    listRow: {
        flex: 1,
        textAlign: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    labelHora: {
        marginStart: 48,
        marginEnd: 48,
        color: 'black',
    },
    item_label: {
        flex: 1,
        color: 'black',
        textAlign: 'center',
    },
})