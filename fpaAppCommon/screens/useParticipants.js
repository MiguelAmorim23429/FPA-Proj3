import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";
import useSportModalities from './useSportModalities';

const useParticipants = ({ matchId, modalidadeId }) => {

  const db = getDatabase()
  // const participantsRef = ref(db, '/provas/' + matchId + '/participantes/')
  // const athletesRef = ref(db, '/atletas')
  // const matchRef = ref(db, `/provas/${matchId}`)
  // const sportModalitiesRef = ref(db, `modalidades/${modalidadeId}`)


  // const sportModality = match && useSportModalities({ sportModalityId: match.modalidade })



  const [results, setResults] = useState({})
  const [sportModality, setSportModality] = useState('')
  const [match, setMatch] = useState(null)
  const [enrolled, setAthletes] = useState({})

  const sortFunction = ([, a], [, b]) => {
    if (sportModality?.unidade === "segundos") {
      if (a.resultado === "" || a.resultado === null) return 1;
      if (b.resultado === "" || b.resultado === null) return -1;
      if (a.resultado === b.resultado) return 0;
      return a.resultado < b.resultado ? -1 : 1;
    } else if (sportModality?.unidade === "metros") {
      if (a.resultado === "" || a.resultado === null) return 1;
      if (b.resultado === "" || b.resultado === null) return -1;
      if (a.resultado === b.resultado) return 0;
      return a.resultado > b.resultado ? -1 : 1;
    }
  }

  useEffect(() => {
    const matchRef = ref(db, `/provas/${matchId}`)
    const handlerMatch = (snapshot) => {
      const matchObj = snapshot.val()
      setMatch(matchObj)
    }

    const closeFetchMatch = onValue(matchRef, handlerMatch)

    return (() => {
      closeFetchMatch()
    })

  }, [])

  useEffect(() => {
    const sportModalitiesRef = ref(db, `modalidades/${modalidadeId}`)
    get(sportModalitiesRef).then((childSnapshot) => {
      setSportModality(childSnapshot.val())
    })
  }, [])

  useEffect(() => {
    const athletesRef = ref(db, '/atletas')
    const participantsRef = ref(db, '/provas/' + matchId + '/participantes/')

    let atletas = {}
    let enrolledResults = {}
    let enrolledResultsArray = []

    const handler = async (snapshot) => {

      let atletasSnapshot = await get(athletesRef)

      atletasSnapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        if (childData.genero === match.genero) {
          atletas[childKey] = childData
        }
      });

      snapshot.forEach((childSnapshot) => {
        const idParticipant = childSnapshot.key
        const idAthlete = childSnapshot.val().atleta;
        const result = childSnapshot.val().resultado

        atletas[idAthlete].resultado = result || ''
        enrolledResults[idParticipant] = atletas[idAthlete]

        enrolledResultsArray = Object.entries(enrolledResults)

        for (let i = 0; i < enrolledResultsArray.length; i++) {
          // enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
          enrolledResultsArray.sort(sortFunction)
        }
      });

      setAthletes(enrolledResultsArray)

    }

    const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

    return (() => {
      match && closeParticipantsOnvalue()
    })

  }, [match, sportModality])

  // useEffect(() => {
  //   const athletesRef = ref(db, '/atletas')
  //   const participantsRef = ref(db, '/provas/' + matchId + '/participantes/')

  //   let atletas = {}
  //   let newResults = {}
  //   let enrolledResultsArray = []
  //   let enrolledResults = {}

  //   const handler = async (snapshot) => {
  //     let atletasSnapshot = await get(athletesRef)

  //     atletasSnapshot.forEach((childSnapshot) => {
  //       const childKey = childSnapshot.key;
  //       const childData = childSnapshot.val();

  //       if (childData.genero === match.genero) {
  //         atletas[childKey] = childData
  //       }

  //     })

  //     snapshot.forEach((childSnapshot) => {
  //       const idParticipant = childSnapshot.key
  //       const idAthlete = childSnapshot.val().atleta;
  //       const result = childSnapshot.val().resultado;
  //       // const { atleta: idAthlete, resultado: result } = childSnapshot.val();

  //       newResults[idParticipant] = result || ''
  //       // inscritos[idParticipant] = atletas[idAthlete]

  //       // athletes = atletas[idAthlete]

  //       console.log(`aaa`, atletas, atletas[idAthlete], idAthlete, result)

  //       atletas[idAthlete].resultado = result || '';
  //       enrolledResults[idParticipant] = atletas[idAthlete]
  //       enrolledResultsArray = Object.entries(enrolledResults)

  //       for (let i = 0; i < enrolledResultsArray.length; i++) {
  //         // enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
  //         enrolledResultsArray.sort(sortFunction)
  //       }
  //     });

  //     setAthletes(enrolledResultsArray)

  //   }

  //   const fetchParticipants = match && onValue(participantsRef, handler)

  //   return (() => {
  //     match && fetchParticipants()
  //   })
  // }, [sportModality, match])

  return [enrolled]
}

export default useParticipants

const styles = StyleSheet.create({})