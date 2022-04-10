import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";

const useSportModalities = ({ sportModalityId }) => {

    // const [modalidades, setModalidades] = useState({})
    const [sportModality, setSportModality] = useState('')
    const db = getDatabase()
    // const sportModalitiesRef = ref(db, `modalidades`)
    const sportModalitiesRef = ref(db, `modalidades/${sportModalityId}`)

    const refresh = () => {

        get(sportModalitiesRef).then((sportModalitySnapshot) => {
            const childData = sportModalitySnapshot.val()
            setSportModality(childData);
        })
    }

    useEffect(() => {
        refresh()
    }, [sportModalityId])

    return [sportModality, refresh]
}

export default useSportModalities