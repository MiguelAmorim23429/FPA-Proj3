import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import useParticipants from './useParticipants';

import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { createNavigatorFactory } from '@react-navigation/native';

const ExpandedResultCard = (props) => {

    const { setShowExpandedResult, matchId, sportModalityId, expandedEnrolled } = props

    const [enrolled, sportModality] = useParticipants({ matchId: matchId, modalidadeId: sportModalityId })

    // const [count, setCount] = useState(0)

    let jumps = expandedEnrolled[1].resultado

    useEffect(() => {
        console.log(jumps)
        getMaxResult()
    }, [])

    const getMaxResult = () => {
        const max = Math.max(...jumps)

        console.log(max)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.enrolledNameTitle}>{expandedEnrolled[1].nome}</Text>
                <AntDesignIcon name='close' color='#000' size={24} style={styles.closeWindowIcon} onPress={() => setShowExpandedResult(false)} />
            </View>

            <View style={styles.jumpsContainer}>
                <View style={styles.jumpLineHeaders}>
                    <Text style={{...styles.jumpInfo, fontWeight: 'bold'}}> </Text>
                    <Text style={{...styles.jumpInfo, fontWeight: 'bold'}}>Marca</Text>
                    <Text style={{...styles.jumpInfo, fontWeight: 'bold'}}>Vento</Text>
                </View>
                {jumps.map((jump, index) => {
                    return (
                        <View key={index} style={styles.jumpLine}>
                            <Text style={styles.jumpInfo}>{index + 1}º salto</Text>
                            <Text style={styles.jumpInfo}>{jump.valido ? jump.marca : 'X'}</Text>
                            <Text style={styles.jumpInfo}>{jump.vento} m/s</Text>
                        </View>

                    )
                })}
            </View>
        </View>
    )
}

export default ExpandedResultCard

const styles = StyleSheet.create({
    container: {
        margin: 0,
        padding: 0,
        width: '95%',
        zIndex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        borderRadius: 16,
        position: 'absolute',
        elevation: 4,
        shadowColor: "#000",
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#D8D8D8',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 8,
    },
    enrolledNameTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeWindowIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    jumpsContainer: {
        paddingVertical: 8,
    },
    jumpLineHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    jumpLine: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    jumpInfo: {
        width: '20%',
        fontSize: 16,
    },
})