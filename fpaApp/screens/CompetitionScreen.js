import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild } from "firebase/database"
import { ListItem, Header, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

import Accordion from './Accordion';

const CompetitionScreen = ({ route }) => {

    // Variável com o valor do idCompeticao da competição em que se clicou no ecrã anterior
    const idCompetition = route.params.idComp
    const navigation = useNavigation()

    // Referência ao sítio a que se vai buscar os dados na base de dados.
    const db = getDatabase();
    const matchesRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idCompetition))

    const [match, setMatch] = useState([])

    useEffect(() => {
        // Busca das provas existentes na competicao que selecionamos no ecrã anterior
        onValue(matchesRef, (snapshot) => {
            let matchesArray = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                matchesArray.push([childKey, childData])
            });
            setMatch(matchesArray)
        }, {
            onlyOnce: true
        });
    }, [])

    // Clicar no Card e redirecionar para outro ecrã com a lista de provas dessa competição selecionada.
    const escolherProva = (val) => {
        console.log(val)
        navigation.navigate('AthleticsTest', { idProva: val })
    }

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    const showInput = () => {
        return <Text>aaaa</Text>
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

            <ScrollView style={styles.listContainer}>
                {match.map(([key, value], index) => {

                    const genders = {
                        "Masculino": <Icon name='male-sharp' size={24} color='#03A3FF' />,
                        "Feminino": <Icon name='female-sharp' size={24} color='#EC49A7' />,
                    }

                    let listCard = <ListItem.Content style={styles.listRowsContainer} onPress={(e) => { escolherProva(key) }}>
                        <ListItem.Title style={styles.listHora}>{value.hora}</ListItem.Title>
                        <ListItem.Title style={styles.listRow}>{value.categoria}</ListItem.Title>
                        <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                        <ListItem.Title style={styles.listRow}>{genders[value.genero]}</ListItem.Title>
                    </ListItem.Content>

                    // if(value.ativa) {
                    return (
                        <View key={key}>
                            {/* <TouchableOpacity onPress={() => escolherProva(key)}>
                                <ListItem style={styles.listCard}>
                                    <ListItem.Content style={styles.listRowsContainer}>
                                        <ListItem.Title style={styles.listHora}>{value.hora}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.categoria}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{genders[value.genero]}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity onPress={() => escolherProva(key)}> */}
                            <Accordion cardIndex={index} chaveId={key} hora={value.hora} categoria={value.categoria} escalao={value.escalao} genero={genders[value.genero]} onPress={() => {escolherProva(key)}} />

                            {/* <ListItem style={styles.listCard}>
                                    <ListItem.Content style={styles.listRowsContainer}>
                                        <ListItem.Title style={styles.listHora}>{value.hora}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.categoria}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{value.escalao.substring(0, 3)}</ListItem.Title>
                                        <ListItem.Title style={styles.listRow}>{genders[value.genero]}</ListItem.Title>
                                        <ListItem.Chevron style={styles.listRow} onPress={() => { showInput(); console.log("CHEVRON") }} />
                                    </ListItem.Content>
                                </ListItem> */}

                            {/* </TouchableOpacity> */}
                        </View>
                    )
                    // }
                })
                }
            </ScrollView>
        </View>
    )
}

export default CompetitionScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        backgroundColor: 'white',
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
    // listRowsContainer: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    // },
    // listHora: {
    //     marginEnd: 16,
    // },
    // listRow: {
    //     flex: 1,
    // },
    listLabelContainer: {
        // width: '100%',
        height: 32,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    labelContainer: {
        width: '23%',
        color: 'black',
        // backgroundColor: 'green',
        height: '100%',
    },
    listInfoLabel: {
        fontSize: 18,
        color: 'black',
        // flex: 1,
    },
    labelHora: {
        color: 'black',
        marginStart: 16,
        flex: 0.3,
    },
    item_label: {
        color: 'black',
        flex: 1,
    },
})
