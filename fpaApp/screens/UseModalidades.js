import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off, get, update } from "firebase/database";

const UseModalidades = ( { modalidade }) => {

    const [modalidades, setModalidades] = useState({})
    const db = getDatabase()
    const sportModalitiesRef = ref(db, `modalidades`)

    const refresh = () => {
        
        get(sportModalitiesRef).then((modalidadesSnapshot) => {
            let modalidadesObj = {}

            modalidadesSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childKey === modalidade) {
                    modalidadesObj[childKey] = childData.unidade
                }
            })

            setModalidades(modalidadesObj)
        })
    }

    useEffect(() => {
      refresh()
    }, [modalidade])
    
  return [modalidades, refresh]
}

export default UseModalidades