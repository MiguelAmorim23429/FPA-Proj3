import React, { useState, useEffect } from 'react';
import { get, getDatabase, off, onValue, push, ref, set } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import './participantsprova.css'

import * as IoIcons from 'react-icons/io'

const ParticipantsProva = () => {

    const { state } = useLocation()

    const { idProva } = state; // recebemos o valor do idProva que enviamos do ecrã das provas quando clicamos na prova

    const db = getDatabase()
    const participantesRef = ref(db, `/provas/${idProva}/participantes/`) // referência à base de dados para ir buscar os participantes da prova que clicamos
    const provaRef = ref(db, `/provas/${idProva}`) // referência à base de dados para ir buscar a prova que clicamos
    const atletasRef = ref(db, '/atletas') // referência à base de dados para ir buscar os atletas

    // const [participante, setParticipante] = useState([])
    // const [atleta, setAtleta] = useState([])
    const [prova, setProva] = useState(null)
    // const [atletaIgual, setAtletaIgual] = useState([])
    const [{ inscritos, naoInscritos }, setAtletas] = useState({ inscritos: {}, naoInscritos: {} })

    const [indexBtn, setIndexBtn] = useState(-1);

    const showButton = (index) => {
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    const adicionarParticipante = async (atletaKey) => {

        const provasAtletaRef = ref(db, `/atletas/${atletaKey}/provas/${idProva}`)

        await set(provasAtletaRef, true) // adicionar uma prova à lista de provas do atleta que escolhemos na lista

        await push(participantesRef, { // adicionar este atleta como participante da prova que clicamos anteriomente
            atleta: atletaKey
        })
        // window.location.reload(false);
    }

    useEffect(() => {
        get(provaRef).then((snapshot) => {
            setProva(snapshot.val())
        })

        console.log(prova)
    }, [])

    useEffect(() => {

        const handler = async (snapshot) => {

            let atletasSnapshot = await get(atletasRef)

            let atletas = {}

            atletasSnapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.genero == prova.genero) {
                    atletas[childKey] = childData
                }
            });

            console.log(atletas)

            let participantes = []

            let inscritos = {}
            let naoInscritos = {}

            snapshot.forEach((childSnapshot) => {
                const atletaId = childSnapshot.val().atleta;
                inscritos[atletaId] = atletas[atletaId]
            });

            for (let atletaId of Object.keys(atletas)) {
                if (!inscritos[atletaId]) {
                    naoInscritos[atletaId] = atletas[atletaId]
                }
            }

            console.log(inscritos)
            // console.log(naoInscritos)

            setAtletas({ inscritos, naoInscritos })

        }

        if(prova) {
            onValue(participantesRef, handler)
        }

        return (() => {
            if(prova) {
                off(handler)
            }
        })
    }, [prova])

    // useEffect(() => {
    //     // Busca dos participantes existentes na prova que selecionamos no ecrã anterior

    //     const handler = (snapshot) => {
    //         let participantes = []
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             participantes.push([childKey, childData])
    //         });
    //         console.log(participantes)
    //         setParticipante(participantes)
    //     }

    //     onValue(participantesRef, handler)

    //     return (() => {
    //         off(handler)
    //     })
    // }, [])

    // useEffect(() => {

    //     const handler = (snapshot) => {
    //         let atletas = []
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             atletas.push([childKey, childData])
    //         });
    //         setAtleta(atletas)
    //     }

    //     onValue(atletasRef, handler)

    //     return (() => {
    //         off(handler)
    //     })
    // }, [])

    // useEffect(() => {
    //     let atletasIguais = []
    //     atleta.map(([key, value]) => {
    //         participante.map(([keyParticipante, valueParticipante]) => {
    //             if (key === valueParticipante.atleta) {
    //                 atletasIguais.push([keyParticipante, [value, valueParticipante]])
    //             }
    //         })
    //     })
    //     setAtletaIgual(atletasIguais)
    // }, [atleta, participante])

    return (
        <div className='main-participantsprova-container'>
            <div className='main-participant-container'>
                {Object.entries(naoInscritos).map(([key, value], index) => {

                    const generos = {
                        "Masculino": <IoIcons.IoMdMale size={20} color='#03A3FF' />,
                        "Feminino": <IoIcons.IoMdFemale size={20} color='#EC49A7' />,
                    }

                    return (
                        <div key={key} className='participant-container'
                            onMouseEnter={() => showButton(index)} // quando metemos o rato por cima atribui este index à variável "indexBtn"
                            onMouseLeave={hideButton}>
                            <ul className='participant-list'>
                                <li className='participant-list-item'>{value.nome}</li>
                                <li className='participant-list-item'>{generos[value.genero]}</li>
                                <li className='participant-list-item'>{value.escalao}</li>
                                <li className='participant-list-item'>{value.clube}</li>
                            </ul>
                            <div className='participant-list-btn-container'>
                                <button className={indexBtn === index ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => adicionarParticipante(key)}>Adicionar</button>
                            </div>
                        </div> /* na linha 125 verificamos se o valor e tipo da variável indexBtn é igual ao valor do index da listagem
                                        se for igual, o estilo do botão fica o 'prova-btn-show' e o botao aparece
                                        se não for igual, o estilo do botão fica o 'prova-btn-hide' e o botao desaparece */
                    )
                })}
            </div>
            <div className='main-participant-container'>
                {Object.entries(inscritos).map(([key, atleta]) => {
                    return (
                        <div key={key} className='participant-container'>
                            <ul className='participant-list'>
                                <li className='participant-list-item'>{atleta.nome}</li>
                                <li className='participant-list-item'>{atleta.genero}</li>
                                <li className='participant-list-item'>{atleta.escalao}</li>
                                <li className='participant-list-item'>{atleta.clube}</li>
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default ParticipantsProva;
