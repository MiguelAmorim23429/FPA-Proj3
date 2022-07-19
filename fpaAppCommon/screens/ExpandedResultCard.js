import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const ExpandedResultCard = (props) => {

    const { setShowExpandedResult, matchId, sportModality, expandedEnrolled } = props

    let jumps = expandedEnrolled[1].resultado

    const getMaxResult = () => {

        const failedAttempt = jumps.find(jump => {
            const attempts = jump.tentativas
            const failedAttemptsHeight = attempts.every(attempt => !attempt)
            if (failedAttemptsHeight) return jump
        })

        let validJumps = jumps.filter(jump => jump !== failedAttempt)
        let validJumpsHeights = validJumps.map(jump => jump.altura)
        const highestJump = Math.max(...validJumpsHeights)
        return highestJump
    }


    return {
        "Salto em comprimento": () =>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.enrolledNameTitle}>{expandedEnrolled[1].nome}</Text>
                    <AntDesignIcon name='close' color='#000' size={24} style={styles.closeWindowIcon} onPress={() => setShowExpandedResult(false)} />
                </View>

                <View style={styles.jumpsContainer}>
                    <View style={styles.jumpLineHeaders}>
                        <Text style={{ ...styles.jumpInfo, fontWeight: 'bold' }}> </Text>
                        <Text style={{ ...styles.jumpInfo, fontWeight: 'bold' }}>Marca</Text>
                        <Text style={{ ...styles.jumpInfo, fontWeight: 'bold' }}>Vento</Text>
                    </View>
                    {jumps.map((jump, index) => {
                        return (
                            <View key={index} style={styles.jumpLine}>
                                <Text style={styles.jumpInfo}>{index + 1}º salto</Text>
                                <Text style={styles.jumpInfo}>{jump.valido ? jump.marca + 'm' : 'X'}</Text>
                                <Text style={styles.jumpInfo}>{jump.vento} m/s</Text>
                            </View>
                        )
                    })}
                </View>
            </View>,
        "Salto em altura": () => <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.enrolledNameTitle}>{expandedEnrolled[1].nome}</Text>
                <AntDesignIcon name='close' color='#000' size={24} style={styles.closeWindowIcon} onPress={() => setShowExpandedResult(false)} />
            </View>
            <View style={styles.highJumpsContainer}>
                <View style={styles.highJumpsHeaders}>
                    <View style={styles.highestJumpInfo}>
                        <Text style={{ fontWeight: 'bold' }}>Marca</Text>
                        <Text>{getMaxResult() !== -Infinity ? getMaxResult() + 'm': 'SM'}</Text>
                    </View>
                    {jumps.map((jump, index) => {
                        let attempts = jump.tentativas
                        return (
                            <View style={styles.highJumpHeightInfo}>
                                <Text>{jump.altura}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {attempts.map((attempt, index) => {
                                        return (attempt ? <AntDesignIcon key={index} name='check' color='#00d827' size={24} /> : <AntDesignIcon key={index} name='close' color='#ed0000' size={24} />)

                                    })}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    }[sportModality.nome]()


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
    },
    jumpLine: {
        flexDirection: 'row',
    },
    jumpInfo: {
        width: '20%',
        fontSize: 16,
    },
    highJumpsContainer: {
        display: 'flex',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    highJumpsHeaders: {
        display: 'flex',
        flexDirection: 'row',
    },
    highestJumpInfo: {
        marginRight: 16,
    },
    highJumpHeightInfo: {
        width: 80,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        paddingHorizontal: 4,
    },
})