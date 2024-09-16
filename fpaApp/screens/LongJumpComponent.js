import { StyleSheet, Text, TextInput, Pressable, View, ScrollView, Switch, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements';
import MaskInput from 'react-native-mask-input';

import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const LongJumpComponent = (props) => {
    const { enrolled, enrolledKey, enrolledIndex, setEnrolled, setShowInsertResultsComponent, numberOfJumps, inputChanged, setInputChanged } = props

    const [validJump, setValidJump] = useState(false)
    const [jumpsArray, setJumpsArray] = useState(enrolled[enrolledIndex][1].resultado || [])

    useEffect(() => {
        jumpArrayElements()
    }, [])

    const jumpArrayElements = () => {
        const newJumpsArray = []
        const jump = { marca: 0, vento: "", valido: false }

        for (let i = 0; i < numberOfJumps; i++) {
            newJumpsArray.push(jump)
        }

        if (jumpsArray.length === 0 || jumpsArray === '') {
            setJumpsArray(newJumpsArray)
        } else {
            setJumpsArray(enrolled[enrolledIndex][1].resultado)
        }
    }

    const handleResultInputValue = (resultInputValue, inputIndex) => {

        if (!inputChanged) {
            setInputChanged(true)
        }

        let clonedEnrolled = [...enrolled]

        let clonedJumpsArray = [...jumpsArray]

        let newJumpsArray = clonedJumpsArray.map((jumpElement, index) => {
            if (index === inputIndex) return { ...jumpElement, marca: resultInputValue }
            return jumpElement
        })

        setJumpsArray(newJumpsArray)

        clonedEnrolled[enrolledIndex][1].resultado = newJumpsArray

        setEnrolled(clonedEnrolled)
    }

    const handleWindInputValue = (windInputValue, inputIndex) => {

        if (!inputChanged) {
            setInputChanged(true)
        }

        let clonedEnrolled = [...enrolled]

        let clonedJumpsArray = [...jumpsArray]

        let newJumpsArray = clonedJumpsArray.map((jumpElement, index) => {
            if (index === inputIndex) return { ...jumpElement, vento: windInputValue }
            return jumpElement
        })

        setJumpsArray(newJumpsArray)

        clonedEnrolled[enrolledIndex][1].resultado = newJumpsArray

        setEnrolled(clonedEnrolled)
    }

    const toggleValidJumpSwitch = (validInputValue, inputIndex) => {

        if (!inputChanged) {
            setInputChanged(true)
        }

        let clonedEnrolled = [...enrolled]

        let clonedJumpsArray = [...jumpsArray]

        let newJumpsArray = clonedJumpsArray.map((jumpElement, index) => {
            if (index === inputIndex) return { ...jumpElement, valido: validInputValue }
            return jumpElement
        })

        setJumpsArray(newJumpsArray)

        clonedEnrolled[enrolledIndex][1].resultado = newJumpsArray

        setEnrolled(clonedEnrolled)
    }

    const closeLongJumpComponent = () => {
        if (inputChanged) {
            Alert.alert(
                "Tens a certeza?",
                "Vais perder as alterações que fizeste nos resultados deste(a) atleta.",
                [
                    {
                        text: 'Sim',
                        onPress: () => {
                            let clonedEnrolled = [...enrolled]
                            clonedEnrolled[enrolledIndex][1].resultado = ''
                            setEnrolled(clonedEnrolled)
                            setShowInsertResultsComponent(false)
                        },
                    },
                    {
                        text: 'Não',
                    },
                ]
            )
        } else {
            setShowInsertResultsComponent(false)
        }
    }

    const createInputsByNumberOfJumps = (numberOfJumps) => {
        let jumpsArray = [];
        for (let i = 0; i < numberOfJumps; i++) {
            jumpsArray.push(
                <View style={styles.jumpInfoContainer} key={i} >

                    <View key={i} style={{ marginRight: 32, }}>
                        <Text style={{ fontSize: 16, }}> {i + 1}º salto </Text>
                        <MaskInput
                            style={styles.textInput}
                            value={enrolled[enrolledIndex][1].resultado.length === 0 ? '' : enrolled[enrolledIndex][1].resultado[i].marca}
                            // editable={user.autorizado ? true : false}
                            // selectTextOnFocus={user.autorizado ? true : false}
                            onChangeText={text => handleResultInputValue(text, i)}
                            mask={[/\d/, /\d/, '.', /\d/, /\d/]}
                            placeholder='00.00m' />
                    </View>

                    <View style={{ marginRight: 32,}}>
                        <Text style={{ fontSize: 16, }}>Vento</Text>
                        <TextInput style={styles.textInput}
                            value={enrolled[enrolledIndex][1].resultado.length === 0 ? '' : enrolled[enrolledIndex][1].resultado[i].vento}
                            onChangeText={text => handleWindInputValue(text, i)} />
                    </View>

                    <View style={{ marginRight: 0,}}>
                        <Text style={{ fontSize: 16, }}>Válido</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={validJump ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={validInputValue => toggleValidJumpSwitch(validInputValue, i)}
                            value={enrolled[enrolledIndex][1].resultado.length === 0 ? false : enrolled[enrolledIndex][1].resultado[i].valido}
                        />
                    </View>

                </View>
            )
        }
        return jumpsArray;
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.enrolledNameTitle}>{enrolled[enrolledIndex][1].nome}</Text>
                <AntDesignIcon name='close' color='#000' size={24} style={styles.closeWindowIcon} onPress={() => closeLongJumpComponent()} />
            </View>

            <ScrollView style={styles.firstSection}>
                {createInputsByNumberOfJumps(numberOfJumps)}
            </ScrollView>

            <Divider width={1} style={styles.divider} />

            <View style={styles.secondSection}>
                <Pressable style={styles.confirmButton} onPress={() => setShowInsertResultsComponent(false)}>
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default LongJumpComponent

const styles = StyleSheet.create({
    container: {
        margin: 0,
        padding: 0,
        width: '90%',
        height: '70%',
        zIndex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        borderRadius: 16,
        position: 'absolute',
        top: 132,
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
    divider: {
        width: '90%',
        alignSelf: 'center',
    },
    firstSection: {
        width: '100%',
        display: 'flex',
        alignContent: 'flex-start',
        paddingTop: 16,
    },
    jumpInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'center',
        marginBottom: 8,
    },
    secondSection: {
        width: '100%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
        width: '50%',
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1375BC',
    },
    confirmButtonText: {
        fontSize: 16,
        color: 'white',
    }
})