import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView,StyleSheet, View, Text } from 'react-native'
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

    return (
        <View style={styles.container}>

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
                {match.map(([key, value], index) => {

                    const genders = {
                        "Masculino": <Icon name='male-sharp' size={24} color='#03A3FF' />,
                        "Feminino": <Icon name='female-sharp' size={24} color='#EC49A7' />,
                    }

                    // if(value.ativa) {
                    return (
                        <View key={key}>
                            <MatchCard
                                cardIndex={index}
                                chaveId={key}
                                hora={value.hora}
                                categoria={value.categoria}
                                escalao={value.escalao}
                                genero={genders[value.genero]}
                                onPress={() => { escolherProva(key) }} />
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
        alignItems: 'baseline'
    },
    headerIcon: {
        marginStart: 16,
        color: 'white',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignSelf: 'baseline',
        width: 130,
        marginLeft: 16,
        color: 'white'
    },
    listContainer: {
        width: '100%',
    }
})
