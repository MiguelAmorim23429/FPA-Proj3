import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { getDatabase, ref, onValue, query, equalTo, orderByChild} from "firebase/database"
import { ListItem, Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

const CompetitionScreen = ({route}) => {

    // Variável com o valor do idCompeticao da competição em que se clicou no ecrã anterior
    const idCompeticao = route.params.idComp
    const navigation = useNavigation()

    // Referência ao sítio a que se vai buscar os dados na base de dados.
    const db = getDatabase();
    const provasRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idCompeticao))

    const [prova, setProva] = useState([])

    useEffect(() => {
        // Busca das provas existentes na competicao que selecionamos no ecrã anterior
        onValue(provasRef, (snapshot) => {
            let provas = [] 

            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              provas.push([childKey, childData])
            });
            setProva(provas)
        }, {
            onlyOnce: true
        });
    }, [])

    // Clicar no Card e redirecionar para outro ecrã com a lista de provas dessa competição selecionada.
    const escolherProva = (val) => {
        console.log(val)
        navigation.navigate('AthleticsTest', {idProva: val})
    }

    const voltarBotao = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Header 
                leftComponent={
                    <View style={styles.headerContainer}>
                        <Icon name='arrow-back' style={styles.headerIcon} size={24} onPress={() => voltarBotao()}/>
                        <Text style={styles.headerTitle}>Provas</Text>
                    </View>
                }
            />

            <View style={styles.labelContainer}>
                <Text style={styles.labelHora}>Hora</Text>
                <Text style={styles.labelProva}>Prova</Text>
                <Text style={styles.labelGenero}>Género</Text>
            </View>

            <ScrollView style={styles.listContainer}>
                {prova.map(([key, value]) => {

                    const generos = {
                        "Masculino": <Icon name='male-sharp' size={22} color='#002aff'/>, 
                        "Feminino": <Icon name='female-sharp' size={22} color='#ff2ef8'/>,
                    }

                    return(
                        <View key={key}>
                            <TouchableOpacity onPress={() => escolherProva(key)}>
                            <ListItem style={styles.listCard}>
                                <ListItem.Content style={styles.listRowsContainer}>
                                    <ListItem.Title style={[styles.listRow, styles.listHora]}>{value.hora}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listNome]}>{value.nome}</ListItem.Title>
                                    <ListItem.Title style={[styles.listRow, styles.listGenero]}>{generos[value.genero]}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                            </TouchableOpacity>
                        </View>
                    )
                })
                }
            </ScrollView>
        </View>
    )
}

export default CompetitionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        
    },
    listRow: {
        fontSize: 18,
    },
    listHora: {
        flex: 1,
        marginStart: 5,
    },
    listNome: {
        flex: 2,
    },
    listGenero: {
        flex: 3,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        marginTop: 20,
        backgroundColor: '#5A79BA',
        
    },
    labelHora: {
        flex: 0.7,
        marginStart: 28,
        color: 'white',
    },
    labelProva: {
        flex: 0.9,
        color: 'white',
    },
    labelGenero:{
        flex: 2,
        color: 'white',
    },
})
