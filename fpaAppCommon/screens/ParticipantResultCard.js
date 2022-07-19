import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ParticipantResultCard = (props) => {

    const { position, name, club, ageGroup, result, sportModalityMeasurementUnit } = props

    return (
        <View style={styles.cardsContainer}>
            <View style={styles.listRowsContainer}>
                <Text style={styles.listInfoParticipantTablePositionText}>{position + 1}º</Text>

                <Text style={styles.listInfoNameText}>{name}</Text>

                <Text style={styles.listInfoClubText}>{club}</Text>

                <Text style={styles.listInfoAgeGroupText}>{ageGroup}</Text>

                {{
                    "metros": <Text style={styles.listInfoResultText}>{result}</Text>,
                    "segundos": <Text style={styles.listInfoResultText}>{result}s</Text>,
                    "horas": <Text style={styles.listInfoResultText}>{result}h</Text>,
                }[sportModalityMeasurementUnit]}
            </View>
        </View>

    )
}

export default ParticipantResultCard

const styles = StyleSheet.create({
    cardsContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
        height: 64,
        padding: 0,
        marginVertical: 8,
        borderRadius: 16,
    },
    listRowsContainer: {
        height: 64,
        paddingLeft: 8,
        // backgroundColor: '#ff7700',
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
    listInfoParticipantTablePositionText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 16,
    },
    listInfoNameText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 48,
    },
    listInfoClubText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 172,
    },
    listInfoAgeGroupText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 250,
    },
    listInfoResultText: {
        fontSize: 16,
        color: 'white',
        position: 'absolute',
        top: 22,
        left: 320,
    },
    listGenderIconContainer: {
        position: 'absolute',
        top: 20,
        left: 270,
    }
})