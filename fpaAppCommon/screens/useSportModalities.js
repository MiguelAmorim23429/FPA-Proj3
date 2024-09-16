import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";

const useSportModalities = ({ sportModalityId }) => {

    const [sportModality, setSportModality] = useState('')
    const db = getDatabase()
    // const sportModalitiesRef = ref(db, `modalidades`)
    const sportModalitiesRef = ref(db, `modalidades/${sportModalityId}`)

    useEffect(() => {
        get(sportModalitiesRef).then((sportModalitySnapshot) => {
            const childData = sportModalitySnapshot.val()
            setSportModality(childData);
        })
    }, [sportModalitiesRef])
    
  return [sportModality]
}

export default useSportModalities