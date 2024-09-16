import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, get } from "firebase/database";
import { max } from 'moment';

const useParticipants = ({ matchId, modalidadeId }) => {

  const db = getDatabase()

  const [sportModality, setSportModality] = useState('')
  const [match, setMatch] = useState(null)
  const [participants, setEnrolled] = useState([])

  const sortResultsEachAthlete = (a, b) => {
    if (sportModality.nome === "Salto em altura") {
      if (a.altura < b.altura) return -1
      if (a.altura > b.altura) return 1
    }
  }

  const sortHighestResultsTablePosition = ([, a], [, b]) => {

    if (sportModality.unidade === 'segundos' || sportModality.unidade === 'horas') {
      if (a.resultado === "" || a.resultado === null) return 1;
      if (b.resultado === "" || b.resultado === null) return -1;
      if (a.resultado === b.resultado) return 0;
      return a.resultado > b.resultado ? 1 : -1;
    }

    if (sportModality.nome === 'Salto em comprimento') {
      const resultsA = a.resultado
      const resultsB = b.resultado

      const validResultsA = resultsA.filter(result => { if (result.valido) return result })
      const validResultsB = resultsB.filter(result => { if (result.valido) return result })

      const jumpValuesResultsA = validResultsA.map(result => result.marca)
      const jumpValuesResultsB = validResultsB.map(result => result.marca)

      const maxJumpValueA = Math.max(...jumpValuesResultsA)
      const maxJumpValueB = Math.max(...jumpValuesResultsB)


      if (maxJumpValueA > maxJumpValueB) return -1
      if (maxJumpValueA < maxJumpValueB) return 1

    }

    if (sportModality.nome === 'Salto em altura') {

      const resultsA = a.resultado
      const resultsB = b.resultado

      const failedAttemptA = resultsA.find(result => {
        const attempts = result.tentativas
        const failedAttemptsHeight = attempts.every(attempt => !attempt)
        if (failedAttemptsHeight) return result
      })

      const failedAttemptB = resultsB.find(result => {
        const attempts = result.tentativas
        const failedAttemptsHeight = attempts.every(attempt => !attempt)
        if (failedAttemptsHeight) return result
      })

      if (!failedAttemptA && !failedAttemptB) {
        if (resultsA[resultsA.length - 1].altura > resultsB[resultsB.length - 1].altura) return -1
        if (resultsA[resultsA.length - 1].altura < resultsB[resultsB.length - 1].altura) return 1
      } else {
        if (resultsA.length === 1 || resultsB.length === 1) {
          if (resultsA[0] !== failedAttemptA && resultsA[0].altura > resultsB[0].altura) return -1
          if (resultsB[0] !== failedAttemptB && resultsA[0].altura < resultsB[0].altura) return 1
          if (resultsA[0] !== failedAttemptA || resultsB[0] === failedAttemptB) return -1
          if (resultsA[0] === failedAttemptA || resultsB[0] !== failedAttemptB) return 1
        } else if (resultsA.length > 1 || resultsB.length > 1) {
          if (resultsA[resultsA.length - 1] === failedAttemptA && resultsB[resultsB.length - 1] === failedAttemptB) {
            if (resultsA[resultsA.length - 2].altura > resultsB[resultsB.length - 2].altura) return -1
            if (resultsA[resultsA.length - 2].altura < resultsB[resultsB.length - 2].altura) return 1
          }
          if (resultsA[resultsA.length - 1] === failedAttemptA) {
            if (resultsA[resultsA.length - 2].altura > resultsB[resultsB.length - 1].altura) return -1
            if (resultsA[resultsA.length - 2].altura < resultsB[resultsB.length - 1].altura) return 1

          }
          if (resultsB[resultsB.length - 1] === failedAttemptB) {
            if (resultsA[resultsA.length - 1].altura > resultsB[resultsB.length - 2].altura) return -1
            if (resultsA[resultsA.length - 1].altura < resultsB[resultsB.length - 2].altura) return 1
          }
        }
      }
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
    const clubsRef = ref(db, '/clubes/')
    const participantsRef = ref(db, '/provas/' + matchId + '/participantes/')

    const handler = async (snapshot) => {

      let athletesSnapshot = await get(athletesRef);
      let clubsSnapshot = await get(clubsRef);

      let athletes = {}
      let clubs = {}

      clubsSnapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        clubs[childKey] = childData;
      })

      athletesSnapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        if (childData.genero === match.genero) {
          athletes[childKey] = childData;
          athletes[childKey].clube = clubs[childData.clube];
        }
      });

      let enrolledResults = {}
      let enrolledResultsArray = []

      snapshot.forEach((childSnapshot) => {
        const idParticipant = childSnapshot.key
        const idAthlete = childSnapshot.val().atleta;
        const result = childSnapshot.val().resultado

        athletes[idAthlete].resultado = result || ''
        enrolledResults[idParticipant] = athletes[idAthlete]

        enrolledResultsArray = Object.entries(enrolledResults)

        enrolledResultsArray.map(enrolledResult => {
          const result = enrolledResult[1].resultado
          if (sportModality.unidade === 'metros') result.sort(sortResultsEachAthlete)
          return enrolledResult
        })

        for (let i = 0; i < enrolledResultsArray.length; i++) {
          enrolledResultsArray.sort(sortHighestResultsTablePosition)
        }
      });

      setEnrolled(enrolledResultsArray)

    }

    const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

    return (() => {
      match && closeParticipantsOnvalue()
    })

  }, [match, sportModality])

  return [participants, sportModality]
}

export default useParticipants