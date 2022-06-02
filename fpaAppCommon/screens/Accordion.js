import { Pressable, StyleSheet, Text, View, TouchableOpacity, Animated, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import IoniIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import { getDatabase, ref, onValue, query, equalTo, orderByChild } from "firebase/database"

import useParticipants from './useParticipants';
import ExpandedResultCard from './ExpandedResultCard';

const Accordion = (props) => {

    const navigation = useNavigation();

    const [listExpanded, setListExpanded] = useState(false);
    const [indexList, setIndexList] = useState(-1);
    const [showExpandedResult, setShowExpandedResult] = useState(false);
    const [expandedEnrolled, setExpandedEnrolled] = useState([])
    const [matchesById, setMatches] = useState([])

    const [accordionOpen, setAccordionOpen] = useState(false)

    const heightAnim = useRef(new Animated.Value(0)).current;
    const paddingTopAnim = useRef(new Animated.Value(0)).current;

    const { matchId, sportModalityId, competitionId } = props

    const [enrolled, sportModality] = useParticipants({ matchId: matchId, modalidadeId: sportModalityId })
    const db = getDatabase();
    const matchesRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(competitionId))

    useEffect(() => {

        console.log(sportModality)
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

    const showList = (index, matchKey, sportModalityKey) => {

        for (let match of matchesById) {
            // console.log(matchKey)
            if (match[0] === matchKey) {
                if (match[1].estado === "finalizada") {
                    setIndexList(index);
                    setListExpanded(!listExpanded);
                    listExpanded ?
                        (
                            Animated.parallel([
                                Animated.timing(
                                    heightAnim,
                                    {
                                        toValue: 0,
                                        duration: 250,
                                        useNativeDriver: false,
                                    }),
                                Animated.timing(
                                    paddingTopAnim,
                                    {
                                        toValue: 0,
                                        duration: 250,
                                        useNativeDriver: false,
                                    }),
                                setAccordionOpen(false)
                            ]).start()
                        )
                        :
                        (
                            Animated.parallel([
                                Animated.timing(
                                    heightAnim,
                                    {
                                        toValue: 200,
                                        // toValue: 280,
                                        duration: 250,
                                        useNativeDriver: false,
                                    }),
                                Animated.timing(
                                    paddingTopAnim,
                                    {
                                        toValue: 10,
                                        duration: 250,
                                        useNativeDriver: false
                                    }),
                                setAccordionOpen(true)
                            ]).start()
                        )
                } else if (match[1].estado === "ativa") {
                    Alert.alert('Esta prova ainda se encontra a decorrer.');
                } else if (match[1].estado === "emInscricoes") {
                    Alert.alert('Esta prova ainda está em fase de inscrições.');
                }
            }
        }
    }

    const escolherProva = (matchKey, sportModalityKey) => {
        for (let match of matchesById) {
            if (match[0] === matchKey) {
                if (match[1].estado === "finalizada") {
                    navigation.navigate('AthleticsTest', { idMatch: matchKey, idSportModality: sportModalityKey })
                } else if (match[1].estado === "ativa") {
                    Alert.alert('Esta prova ainda se encontra a decorrer.')
                } else if (match[1].estado === "emInscricoes") {
                    Alert.alert('Esta prova ainda está em fase de inscrições.')
                }
            }
        }
        // navigation.navigate('AthleticsTest', { idMatch: matchKey, idSportModality: sportModalityKey })
    }

    return (
        <View>
            {/* <Pressable style={{ justifyContent: 'center', alignSelf: 'center', width: '95%', height: 64, padding: 0, marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 8, borderRadius: 16 }} onPress={() => { escolherProva(props.matchId, props.sportModalityId) }}> */}
            <Pressable style={{ justifyContent: 'center', alignSelf: 'center', width: '95%', height: 64, padding: 0, margin: 0, borderRadius: 16 }} onPress={() => { escolherProva(props.matchId, props.sportModalityId) }}>
                <View style={styles.listRowsContainer}>

                    <Text style={styles.listInfoHourText}>{props.hora}H</Text>

                    <Text style={styles.listInfoCategoryText}>{props.categoria}</Text>

                    <Text style={styles.listInfoAgeGroupText}>{props.escalao}</Text>

                    <View style={styles.listGenderIconContainer}>
                        {props.genero}
                    </View>

                    <TouchableOpacity style={styles.listChevronIconContainer} onPress={() => { console.log(`CHEVRON and ${props.cardIndex}`); showList(props.cardIndex, props.matchId, props.sportModalityId) }}>
                        <IoniIcon name='chevron-down' style={listExpanded ? styles.chevronIconActive : styles.chevronIcon} size={24} />
                    </TouchableOpacity>
                </View>

            </Pressable>
            <Animated.View style={{ ...styles.accordionContentActive, height: heightAnim, paddingTop: paddingTopAnim }}>
                {Object.entries(enrolled).map(([key, value], index) => {
                    return {
                        "Salto em comprimento": <View key={key} style={styles.participantsTopThreeCard}>
                            <Text style={styles.participantsTablePosition}>{index + 1}º</Text>
                            <Text style={styles.nameText}>{value[1].nome}</Text>
                            <Text style={styles.clubText}>{value[1].clube.sigla}</Text>
                            <Text style={styles.resultText}>{value[1].resultado.length === 0 ? '' : value[1].resultado[index].marca}</Text>
                            {(index === 0 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#FFD700' size={24} />}
                            {(index === 1 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#C0C0C0' size={24} />}
                            {(index === 2 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#CD7F32' size={24} />}
                            <IoniIcon name='expand' style={styles.expandIcon} color='white' size={24} onPress={() => { setShowExpandedResult(true); setExpandedEnrolled(value) }} />
                        </View>,
                        "Corrida 100 metros": <View key={key} style={styles.participantsTopThreeCard}>
                            <Text style={styles.participantsTablePosition}>{index + 1}º</Text>
                            <Text style={styles.nameText}>{value[1].nome}</Text>
                            <Text style={styles.clubText}>{value[1].clube.sigla}</Text>
                            <Text style={styles.resultText}>{value[1].resultado || ''}</Text>
                            {(index === 0 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#FFD700' size={24} />}
                            {(index === 1 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#C0C0C0' size={24} />}
                            {(index === 2 && accordionOpen) && <EntypoIcon name='medal' style={styles.resultIcon} color='#CD7F32' size={24} />}
                        </View>
                    }[sportModality.nome]

                }).slice(0, 3)}
            </Animated.View>
            <View style={{ paddingVertical: 8 }}></View>
            {showExpandedResult && <ExpandedResultCard setShowExpandedResult={setShowExpandedResult} matchId={matchId} sportModalityId={sportModalityId} expandedEnrolled={expandedEnrolled} />}
        </View>

    )
}

export default Accordion

const styles = StyleSheet.create({
    listRowsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 64,
        paddingLeft: 8,
        backgroundColor: '#464646',
        width: '100%',
        borderRadius: 16,
        position: 'relative',
        elevation: 4,
        shadowColor: "#000",
    },
    infoTextContainer: {
        flex: 1,
    },
    listInfoHourText: {
        fontSize: 20,
        color: 'white',
        position: 'absolute',
        top: 8,
        left: 16,
        fontWeight: 'bold',
    },
    listInfoCategoryText: {
        fontSize: 18,
        color: 'white',
        position: 'absolute',
        top: 32,
        left: 16,
    },
    listInfoAgeGroupText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 180,
    },
    listGenderIconContainer: {
        position: 'absolute',
        top: 20,
        left: 270,
    },
    listChevronIconContainer: {
        width: 64,
        height: 64,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        right: 0,
    },
    chevronIcon: {
        color: 'white',
    },
    chevronIconActive: {
        color: 'white',
        transform: [{ rotate: '180deg' }],
    },
    accordionContentActive: {
        backgroundColor: '#5a5a5a',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 16,
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
        position: 'relative',
        top: -20,
        zIndex: -1,
    },
    participantsTopThreeCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingStart: 16,
        height: 64,
        borderRadius: 16,
        width: '100%',
    },
    participantsTablePosition: {
        fontSize: 16,
        color: 'white',
        marginEnd: 8,
    },
    nameText: {
        fontSize: 16,
        color: 'white',
        // position: 'absolute'
        // width: '33%',
    },
    clubText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        left: 180,
        // marginLeft: 16,
        // width: '33%',
    },
    resultText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        left: 240,
        // marginLeft: 16,
        // width: '33%',
    },
    resultIcon: {
        position: 'absolute',
        left: 310,
    },
    expandIcon: {
        position: 'absolute',
        left: 350,
    },
})