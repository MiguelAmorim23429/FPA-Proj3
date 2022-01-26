import { equalTo, getDatabase, onValue, orderByChild, query, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './provascomp.css'

const ProvasCompetition = () => {

    const navigate = useNavigate()
    const { state } = useLocation()

    const { idComp } = state;

    const db = getDatabase();
    const provasRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idComp))

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

    return (
        <div className='main-provascomp-container'>
            <div className='main-prova-container'>
                {prova.map(([key, value]) => {

                    // const generos = {
                    //     "Masculino": <Icon name='male-sharp' size={22} color='#002aff' />,
                    //     "Feminino": <Icon name='female-sharp' size={22} color='#ff2ef8' />,
                    // }

                    return (
                        <div key={key}>
                            <div className='prova-container'>
                                <ul className='prova-list'>
                                    <li>{value.hora}</li>
                                    <li>{value.nome}</li>
                                    <li>{value.genero}</li>
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='update-prova-container'>
                <input></input>
                <input></input>
                <input></input>
            </div>
        </div>
    )
};

export default ProvasCompetition;
