import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const MatchCard = (props) => {

    const navigation = useNavigation();

    const escolherProva = (val) => {
        navigation.navigate('AthleticsTest', { idProva: val })
    }

    return (
        <Pressable onPress={() => { escolherProva(props.chaveId) }}>
            <View style={styles.listRowsContainer}>

                <Text style={styles.listInfoHourText}>{props.hora}H</Text>

                <Text style={styles.listInfoCategoryText}>{props.categoria}</Text>

                <Text style={styles.listInfoAgeGroupText}>{props.escalao}</Text>

                <View style={styles.listGenderIconContainer}>
                    {props.genero}
                </View>
            </View>

        </Pressable>

    )
}

export default MatchCard

const styles = StyleSheet.create({
    listRowsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        height: 64,
        paddingLeft: 8,
        // backgroundColor: '#ff7700',
        backgroundColor: '#464646',
        marginTop: 16,
        width: '90%',
        borderRadius: 16,
        position: 'relative',
        top: 0,
        // elevation: 8,
        // shadowColor: '#353535',
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
        left: 230,
    },
    listGenderIconContainer: {
        position: 'absolute',
        top: 20,
        left: 320,
    },
})