import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, get } from "firebase/database";

const useFetch = ({ matchId, sportModalityId }) => {


    const [sportModality, setSportModality] = useState('')
    const [match, setMatch] = useState({})
    const [enrolled, setEnrolled] = useState([])
    const [athletes, setAthletes] = useState([])

    const db = getDatabase()

    useEffect(() => {
        const clubsRef = ref(db, '/clubes/')
        const athletesRef = ref(db, '/atletas')

        let clubs = {}
        let athletesObj = {}
        let athletesArray = []

        get(clubsRef).then((clubsSnapshot) => {
            clubsSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key
                const childData = childSnapshot.val()
                clubs[childKey] = childData
            })
        })

        get(athletesRef).then((athletesSnapshot) => {
            athletesSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key
                const childData = childSnapshot.val()
                athletesObj[childKey] = childData
                athletesObj[childKey].clube = clubs[childData.clube]

                athletesArray = Object.entries(athletesObj)
            })

            setAthletes(athletesArray)
        })
    }, [])

    useEffect(() => {
        if (matchId) {
            const matchRef = ref(db, `/provas/${matchId}`)

            const handlerMatch = (snapshot) => {
                const matchObj = snapshot.val()
                setMatch(matchObj)
            }

            const closeFetchMatch = onValue(matchRef, handlerMatch)

            return (() => {
                closeFetchMatch()
            })
        }
    }, [])

    useEffect(() => {
        if (sportModalityId) {
            const sportModalitiesRef = ref(db, `modalidades/${sportModalityId}`)

            get(sportModalitiesRef).then((childSnapshot) => {
                setSportModality(childSnapshot.val())
            })
        }
    }, [])

    useEffect(() => {

        if (matchId) {
            const participantsRef = ref(db, '/provas/' + matchId + '/participantes/')

            const handler = async (snapshot) => {

                const athletesClone = [...athletes]

                let enrolledResults = {}
                let enrolledResultsArray = []

                snapshot.forEach((childSnapshot) => {
                    const idParticipant = childSnapshot.key
                    const idAthlete = childSnapshot.val().atleta;
                    const result = childSnapshot.val().resultado

                    athletesClone[idAthlete].resultado = result || ''
                    enrolledResults[idParticipant] = athletesClone[idAthlete]

                    enrolledResultsArray = Object.entries(enrolledResults)

                    // for (let i = 0; i < enrolledResultsArray.length; i++) {
                    //   // enrolledResultsArray.sort(([,a], [,b]) => a.resultado>b.resultado)
                    //   enrolledResultsArray.sort(sortFunction)
                    // }
                });

                setEnrolled(enrolledResultsArray)

            }

            const closeParticipantsOnvalue = match && onValue(participantsRef, handler)

            return (() => {
                match && closeParticipantsOnvalue()
            })
        }

    }, [match, sportModality])

    return [athletes, sportModality, enrolled]
}

export default useFetch