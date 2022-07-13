import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { Header, ListItem } from 'react-native-elements'
import { getDatabase, ref } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import useParticipants from './useParticipants';
import ParticipantResultCard from './ParticipantResultCard';

const AthleticsTestScreen = ({ route }) => {

    // Variável com o valor do idProva da prova em que se clicou no ecrã anterior
    const { idMatch, idSportModality } = route.params;

    const navigation = useNavigation()

    const [participants, sportModality] = useParticipants({ matchId: idMatch, modalidadeId: idSportModality })

    const goToPreviousScreen = () => {
        navigation.goBack()
    }

    const getHighestValueOfJump = (results) => {
        let highestLegalResult = 0

        if (sportModality.nome === 'Salto em altura') {
            const failedAttempt = results.find(result => {
                const attempts = result.tentativas
                const failedAttemptsHeight = attempts.every(attempt => !attempt)
                if (failedAttemptsHeight) return result
            })

            if (results.length === 1) {
                highestLegalResult = results[results.length - 1].altura
            } else {
                failedAttempt ? highestLegalResult = results[results.length - 2].altura : highestLegalResult = results[results.length - 1].altura
            }
            return highestLegalResult
        }

        if (sportModality.nome === 'Salto em comprimento') {
            const validJumps = results.filter(result => { if (result.valido) return result })
            const jumpValues = validJumps.map(value => value.marca)
            highestLegalResult = Math.max(...jumpValues)
            console.log("xx", highestLegalResult)

            return highestLegalResult
        }
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
                // containerStyle={{ height: 80, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                containerStyle={{ margin: 0, padding: 0, height: 100, borderWidth: 0, elevation: 4, shadowColor: "#000" }}
                backgroundColor='#1375BC'
                ViewComponent={LinearGradient}
                linearGradientProps={{
                    colors: ['#1375BC', '#1794e8'],
                    start: { x: 0.1, y: 0.5 },
                    end: { x: 1, y: 0.5 },
                }}
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => goToPreviousScreen()} />
                        <Text style={styles.headerTitle}>Participantes</Text>
                    </View>
                }
            />

            <ScrollView style={styles.listContainer}>
                {participants.map((participant, index) => {
                    return {
                        "Salto em comprimento": < ParticipantResultCard
                            key={index}
                            position={index}
                            name={participant[1].nome}
                            club={participant[1].clube.sigla}
                            ageGroup={participant[1].escalao.substring(0, 3)}
                            result={getHighestValueOfJump(participant[1].resultado)}
                            sportModalityMeasurementUnit={sportModality.unidade} />,
                        "Salto em altura": < ParticipantResultCard
                            key={index}
                            position={index}
                            name={participant[1].nome}
                            club={participant[1].clube.sigla}
                            ageGroup={participant[1].escalao.substring(0, 3)}
                            result={getHighestValueOfJump(participant[1].resultado)}
                            sportModalityMeasurementUnit={sportModality.unidade} />,
                        "Corrida 100 metros": < ParticipantResultCard
                            key={index}
                            position={index}
                            name={participant[1].nome}
                            club={participant[1].clube.sigla}
                            ageGroup={participant[1].escalao.substring(0, 3)}
                            result={participant[1].resultado}
                            sportModalityMeasurementUnit={sportModality.unidade} />
                    }[sportModality.nome]
                })}
            </ScrollView>
        </View>
    )
}

export default AthleticsTestScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
        backgroundColor: 'white'
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