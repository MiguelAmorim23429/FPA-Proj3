import { Pressable, StyleSheet, Text, View, TextInput, Switch, Alert, ScrollView } from 'react-native'
import { Divider } from 'react-native-elements';
import React, { useState, useEffect } from 'react'

import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const HighJumpComponent = (props) => {

  // const { setShowHighJumpComponent } = props
  const { enrolled, setEnrolled, enrolledIndex, inputChanged, setInputChanged, setShowInsertResultsComponent } = props

  const [jumps, setJumps] = useState(enrolled[enrolledIndex][1].resultado || [])
  const [jumpHeight, setJumpHeight] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [disabledButtons, setDisabledButtons] = useState([])

  useEffect(() => {
    initializeButtonsStatus()
  }, [])

  const initializeButtonsStatus = () => {
    let clonedJumps = [...jumps]

    let clonedDisabledButtons = [...disabledButtons]

    clonedJumps.forEach((jumpElement, jumpIndex) => {
      let attempts = jumpElement.tentativas

      if (attempts.length === 3) {
        let isAllFailedAttempts = attempts.every(attempt => attempt === false)
        if (isAllFailedAttempts || jumpElement.ultrapassada) {
          clonedDisabledButtons.push(jumpIndex)
          setDisabledButtons(clonedDisabledButtons)
          setButtonDisabled(true)
        }
      }

      if (attempts.length < 3) {
        if (jumpElement.ultrapassada) {
          clonedDisabledButtons.push(jumpIndex)
          setDisabledButtons(clonedDisabledButtons)
          setButtonDisabled(true)
        }
      }

    })
  }



  const closeHighJumpComponent = () => {
    // if (inputChanged) {
    //   Alert.alert(
    //     "Tens a certeza?",
    //     "Vais perder as alterações que fizeste nos resultados deste(a) atleta.",
    //     [
    //       {
    //         text: 'Sim',
    //         onPress: () => {
    //           let clonedEnrolled = [...enrolled]
    //           clonedEnrolled[enrolledIndex][1].resultado = ''
    //           setEnrolled(clonedEnrolled)
    //           setShowHighJumpComponent(false)
    //         },
    //       },
    //       {
    //         text: 'Não',
    //       },
    //     ]
    //   )
    // } else {
    //   setShowHighJumpComponent(false)
    // }
    setShowInsertResultsComponent(false)
  }

  const addJump = () => {
    let clonedJumps = [...jumps]

    const newJump = {
      "altura": jumpHeight,
      "ultrapassada": false,
      "tentativas": []
    }

    if (jumpHeight === '') {
      Alert.alert("Tem de inserir uma altura.")
    }

    if (clonedJumps.length === 0) {
      clonedJumps.push(newJump)
      setJumps(clonedJumps)
    } else {
      let exists = false
      let heightIsLower = false

      for (let i = 0; i < clonedJumps.length; i++) {
        if (clonedJumps[i].altura === jumpHeight) exists = true
      }

      if (exists) {
        Alert.alert("Este/a atleta já escolheu esta altura anteriormente. Insira uma altura nova.")
      } else {

        for (let i = 0; i < clonedJumps.length; i++) {
          if (jumpHeight < clonedJumps[i].altura) heightIsLower = true
        }

        if (heightIsLower) {
          Alert.alert("Tem de inserir uma altura superior às anteriormente inseridas.")
        } else {
          clonedJumps.push(newJump)
          setJumps(clonedJumps)
        }
      }
    }
  }

  const createJumpInputSwitchesForEachJumpHeight = () => {
    let clonedJumps = [...jumps]

    let jumpInputSwitches = []

    for (let i = 0; i < clonedJumps.length; i++) {

      let clonedJumpsAttemptsArray = clonedJumps[i].tentativas

      let attempts = []
      if (clonedJumpsAttemptsArray.length !== 0) {
        for (let j = 0; j < clonedJumpsAttemptsArray.length; j++) {
          if (clonedJumpsAttemptsArray[j]) {
            attempts.push(<AntDesignIcon key={j} name='check' color='#00d827' size={24} />)
          } else {
            attempts.push(<AntDesignIcon key={j} name='close' color='#ed0000' size={24} />)
          }
        }
      }

      jumpInputSwitches.push(
        <View key={i} style={styles.jumpAttempt}>
          <Text style={{ width: 32 }}>{clonedJumps[i].altura}</Text>
          <View style={styles.attemptsContainer}>
            {attempts}
          </View>
          <View style={styles.buttonsContainer}>
            <AntDesignIcon style={disabledButtons.includes(i) ? styles.disabledAttemptStatusButton : styles.attemptStatusButton} name='closesquare' color='red' size={24} onPress={() => !(disabledButtons.includes(i) && buttonDisabled) && handleFailedAttempt(i)} />
            <AntDesignIcon style={disabledButtons.includes(i) ? styles.disabledAttemptStatusButton : styles.attemptStatusButton} name='checksquare' color='green' size={24} onPress={() => !(disabledButtons.includes(i) && buttonDisabled) && handleSuccessfulAttempt(i)} />
            <AntDesignIcon name='delete' color='orange' size={24} onPress={() => handleRemoveAttempt(i)} />
          </View>
        </View>
      )
    }

    return jumpInputSwitches
  }

  const handleFailedAttempt = (jumpIndex) => {

    if (!inputChanged) {
      setInputChanged(true)
    }

    let clonedEnrolled = [...enrolled]

    let clonedJumps = [...jumps]

    let clonedDisabledButtons = [...disabledButtons]

    let newJumpsArray = clonedJumps.map((jumpElement, mapJumpIndex) => {

      if (mapJumpIndex === jumpIndex) {
        let attempts = jumpElement.tentativas

        if (attempts.length < 3) {
          attempts.push(false)
        }

        if (attempts.length === 3) {
          let isAllFailedAttempts = attempts.every(attempt => attempt === false)

          if (isAllFailedAttempts) {
            clonedDisabledButtons.push(jumpIndex)
            setDisabledButtons(clonedDisabledButtons)
            setButtonDisabled(true)
          }
        }
      }

      return jumpElement
    })

    setJumps(newJumpsArray)

    clonedEnrolled[enrolledIndex][1].resultado = newJumpsArray
    setEnrolled(clonedEnrolled)
  }

  const handleSuccessfulAttempt = (jumpIndex) => {

    if (!inputChanged) {
      setInputChanged(true)
    }

    let clonedEnrolled = [...enrolled]

    let clonedJumps = [...jumps]

    let newJumpsArray = clonedJumps.map((jumpElement, mapJumpIndex) => {

      if (mapJumpIndex === jumpIndex) {
        let attempts = jumpElement.tentativas

        if (attempts.length === 0) {
          attempts.push(true)
          jumpElement.ultrapassada = true
        } else if (attempts.length < 3) {
          const successfulAttempt = attempts.find(attempt => attempt === true)

          if (!successfulAttempt) {
            attempts.push(true)
            jumpElement.ultrapassada = true
          }
        }
      }

      return jumpElement
    })

    let clonedDisabledButtons = [...disabledButtons]
    clonedDisabledButtons.push(jumpIndex)
    setDisabledButtons(clonedDisabledButtons)
    setButtonDisabled(true)

    setJumps(newJumpsArray)

    clonedEnrolled[enrolledIndex][1].resultado = newJumpsArray
    setEnrolled(clonedEnrolled)
  }

  const handleRemoveAttempt = (jumpIndex) => {

    if (!inputChanged) {
      setInputChanged(true)
    }

    let clonedEnrolled = [...enrolled]

    let clonedJumps = [...jumps]
    let jump = clonedJumps[jumpIndex]
    let attempts = jump.tentativas

    let clonedDisabledButtons = [...disabledButtons]

    if (attempts.length === 0) {
      clonedJumps.splice(jumpIndex, 1)
    } else {
      const indexBtn = clonedDisabledButtons.indexOf(jumpIndex)

      if (indexBtn !== undefined) {
        attempts.pop()

        if (jump.ultrapassada === true) {
          jump.ultrapassada = false
        }

        clonedDisabledButtons.splice(indexBtn, 1)
      } else {
        attempts.pop()
      }
    }

    setDisabledButtons(clonedDisabledButtons)
    setButtonDisabled(false)

    setJumps(clonedJumps)

    clonedEnrolled[enrolledIndex][1].resultado = clonedJumps
    setEnrolled(clonedEnrolled)
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.enrolledNameTitle}>{enrolled[enrolledIndex][1].nome}</Text>
        <AntDesignIcon name='close' color='#000' size={24} style={styles.closeWindowIcon} onPress={() => closeHighJumpComponent()} />
      </View>


      <View style={styles.addJumpContainer}>
        <TextInput style={styles.addJumpInput} keyboardType='number-pad' placeholder='0.00' onChangeText={text => setJumpHeight(text)}></TextInput>
        <Pressable style={styles.addJumpButton} onPress={() => addJump()}>
          <Text style={styles.addJumpButtonText}>Adicionar altura</Text>
        </Pressable>
      </View>

      <View style={styles.attemptHeadersContainer}>
        <Text style={{ width: 40 }}>Altura</Text>
      </View>

      <ScrollView style={styles.firstSection}>
        {createJumpInputSwitchesForEachJumpHeight()}
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


export default HighJumpComponent

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
  addJumpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  addJumpInput: {
    backgroundColor: 'rgba(32, 33, 36, 0.25)',
    color: 'black',
    opacity: 0.5,
    width: '20%',
    marginRight: 32,
    borderRadius: 8,
    paddingLeft: 8,
  },
  addJumpButton: {
    width: '50%',
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1375bc',
  },
  addJumpButtonText: {
    fontSize: 16,
    color: 'white',
  },
  attemptHeadersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  firstSection: {
    width: '100%',
    display: 'flex',
    alignContent: 'flex-start',
  },
  divider: {
    width: '90%',
    alignSelf: 'center',
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
    color: 'white',
  },
  jumpAttempt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  attemptsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 90,
    paddingHorizontal: 4,
    marginLeft: 16,
  },
  buttonsContainer: {
    width: 180,
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 8,
    // justifyContent: 'center',
    justifyContent: 'space-evenly',
    // marginHorizontal: 16
  },
  attemptStatusButton: {
    // width: 72,
    // height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 8,
  },
  disabledAttemptStatusButton: {
    // width: 72,
    // height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#bfbfbf',
    // marginLeft: 8,
  },
  attemptStatusButtonText: {
    color: 'white',
  }
})
