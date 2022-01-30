import React, { useState, useEffect } from 'react';
import { equalTo, getDatabase, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { useLocation, useNavigate } from 'react-router-dom';
import './participantsprova.css'

const ParticipantsProva = () => {

    const { state } = useLocation()

    const { idProva } = state;

    const db = getDatabase()
    const participantesRef = ref(db, '/provas/' + idProva + '/participantes/')
    const atletasRef = ref(db, '/atletas')

    const [participante, setParticipante] = useState([])
    const [atleta, setAtleta] = useState([])
    const [atletaIgual, setAtletaIgual] = useState([])

    const [indexBtn, setIndexBtn] = useState(-1);

    const showButton = (index) => {
        console.log(index)
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    const adicionarParticipante = (atletaKey) => {

        const provasAtletaRef = ref(db, '/atletas/' + atletaKey + '/provas/')

        const newProvaAtletaRef = set(provasAtletaRef, idProva)

        const newParticipanteRef = push(participantesRef, {
            atleta: atletaKey
        })

        const participanteId = newParticipanteRef.key
        console.log(participanteId)
    }

    useEffect(() => {
        // Busca dos participantes existentes na prova que selecionamos no ecrã anterior
        let participantes = []

        onValue(participantesRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                participantes.push([childKey, childData])
            });
            setParticipante(participantes)
        }, {
            onlyOnce: true
        });
    }, [])

    useEffect(() => {
        let atletas = []
        onValue(atletasRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                atletas.push([childKey, childData])
            });
            setAtleta(atletas)
        }, {
            onlyOnce: true
        });
    }, [])

    useEffect(() => {
        let atletasIguais = []
        atleta.map(([key, value]) => {
            participante.map(([keyParticipante, valueParticipante]) => {
                if (key == valueParticipante.atleta) {
                    atletasIguais.push([keyParticipante, [value, valueParticipante]])
                }
            })
        })
        setAtletaIgual(atletasIguais)
    }, [atleta, participante])

    return (
        <div className='main-participantsprova-container'>
            <div className='main-participant-container'>
                {atleta.map(([key, value], index) => {
                    let exists = false
                    if (value.provas) {
                        for (let prova of value.provas) {
                            if (prova === idProva) {
                                exists = true
                            }
                        }
                    }

                    if (!exists) {
                        return (
                            <div key={key} className='participant-container'
                                onMouseEnter={() => showButton(index)}
                                onMouseLeave={hideButton}>
                                <ul className='participant-list'>
                                    <li className='participant-list-item'>{value.nome}</li>
                                    <li className='participant-list-item'>{value.genero}</li>
                                    <li className='participant-list-item'>{value.escalao}</li>
                                    <li className='participant-list-item'>{value.clube}</li>
                                </ul>
                                <div className='participant-list-btn-container'>
                                    <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => adicionarParticipante(key)}>Adicionar</button>
                                </div>

                            </div>
                        )
                    }
                })}
            </div>
            <div className='main-participant-container'>
                {atletaIgual.map(([key, value], index) => {
                    return (
                        <div key={key} className='participant-container'>
                            <ul className='participant-list'>
                                <li className='participant-list-item'>{value[0].nome}</li>
                                <li className='participant-list-item'>{value[0].genero}</li>
                                <li className='participant-list-item'>{value[0].escalao}</li>
                                <li className='participant-list-item'>{value[0].clube}</li>
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default ParticipantsProva;
