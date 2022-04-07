import { Pressable, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Accordion = (props) => {

    const navigation = useNavigation();

    const [listExpanded, setListExpanded] = useState(false);
    const [indexList, setIndexList] = useState(-1);
    const heightAnim = useRef(new Animated.Value(0)).current;
    const paddingTopAnim = useRef(new Animated.Value(0)).current;
    const topPositionAnim = useRef(new Animated.Value(0)).current;

    const showList = (index) => {
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
                            useNativeDriver: false
                        }),

                ]).start()
            )
            :
            (
                Animated.parallel([
                    Animated.timing(
                        heightAnim,
                        {
                            toValue: 180,
                            duration: 250,
                            useNativeDriver: false,
                        }),
                    Animated.timing(
                        paddingTopAnim,
                        {
                            toValue: 30,
                            duration: 250,
                            useNativeDriver: false
                        }),

                ]).start()
            )
    }

    const genders = {
        "Masculino": <Icon name='male-sharp' size={20} color='#03A3FF' />,
        "Feminino": <Icon name='female-sharp' size={20} color='#EC49A7' />,
    }

    const escolherProva = (val) => {
        console.log(val)
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

export default Accordion

const styles = StyleSheet.create({
    listRowsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        height: 64,
        paddingLeft: 8,
        backgroundColor: '#4A6575',
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