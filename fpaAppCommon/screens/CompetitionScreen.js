import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild } from "firebase/database"
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import Accordion from './Accordion';
import { LinearGradient } from 'expo-linear-gradient';

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
    const escolherProva = (matchKey) => {
        console.log(`prova::::::${matchKey}`)
        // console.log(`prova: ${matchKey} e modalidade: ${sportModality}`)
        // for (let match of matchesById) {
        //     // console.log(matchKey)
        //     if (match[0] === matchKey) {
        //         if (match[1].estado === "finalizada") {

        //             navigation.navigate('AthleticsTest', {
        //                 matchId: matchKey
        //             })
        //         } else if (match[1].estado === "ativa") {
        //             Alert.alert('Esta prova ainda se encontra a decorrer.')
        //         } else if (match[1].estado === "emInscricoes") {
        //             Alert.alert('Esta prova ainda está em fase de inscrições.')
        //         }
        //     }
        // }
    }

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    return (
        matchesById.length === 0 ?
            (<View style={styles.container}>
                <Header
                    statusBarProps={
                        {
                            backgroundColor: 'transparent',
                            translucent: true,
                        }
                    }
                    containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
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
                            <Text style={styles.headerTitle}>Provas</Text>
                        </View>
                    }
                />
                <Text>Não há provas.</Text>
            </View>
            )
            :
            (<View style={styles.container}>
                <Header
                    statusBarProps={
                        {
                            backgroundColor: 'transparent',
                            translucent: true,
                        }
                    }
                    containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
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
                            <Text style={styles.headerTitle}>Provas</Text>
                        </View>
                    }
                />

                <ScrollView style={styles.listContainer}>

                    {matchesById.map(([key, value], index) => {

                        const genders = {
                            "Masculino": <Icon name='male-sharp' size={24} color='#03A3FF' />,
                            "Feminino": <Icon name='female-sharp' size={24} color='#EC49A7' />,
                        }
                        return (
                            <View key={key}>
                                <Accordion
                                    cardIndex={index}
                                    competitionId={idCompetition}
                                    matchId={key}
                                    sportModalityId={value.modalidade}
                                    hora={value.hora}
                                    categoria={value.categoria}
                                    escalao={value.escalao}
                                    genero={genders[value.genero]} />
                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>
            )

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
    }
})