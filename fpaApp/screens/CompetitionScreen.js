import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild } from "firebase/database"
import { Header } from 'react-native-elements'

import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MatchCard from './MatchCard';

const CompetitionScreen = ({ route }) => {

    // Variável com o valor do idCompeticao da competição em que se clicou no ecrã anterior
    const idCompetition = route.params.idComp
    const navigation = useNavigation()

    // Referência ao sítio a que se vai buscar os dados na base de dados.
    const db = getDatabase();
    const matchesRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idCompetition))

    const [matches, setMatches] = useState([])

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
        navigation.navigate('AthleticsTest', { idProva: val })
    }

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>

            <Header
                statusBarProps={
                    {
                        backgroundColor: 'transparent',
                        translucent: true,
                    }
                }
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
                        <Text style={styles.headerTitle}>Provas</Text>
                    </View>
                }
            />

            <ScrollView style={styles.listContainer}>
                {matches.map(([matchKey, match], index) => {

                    const genders = {
                        "Masculino": <Icon name='male-sharp' size={24} color='#00B2FF' />,
                        "Feminino": <Icon name='female-sharp' size={24} color='#EC49A7' />,
                    }



                    if (match.estado !== 'removida') {
                        return (
                            <View key={matchKey}>
                                <MatchCard
                                    cardIndex={index}
                                    chaveId={matchKey}
                                    hora={match.hora}
                                    categoria={match.categoria}
                                    escalao={match.escalao}
                                    genero={genders[match.genero]}
                                    onPress={() => { escolherProva(matchKey) }} />
                            </View>
                        )
                    }
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
    listContainer: {
        width: '100%',
    }
})
