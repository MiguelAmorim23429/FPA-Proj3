import { equalTo, getDatabase, off, onValue, orderByChild, push, query, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/provascomp.css'

import AddMatch from './AddMatch';

import * as IoIcons from 'react-icons/io'
import * as BsIcons from 'react-icons/bs'

const ProvasCompetition = () => {

    const navigate = useNavigate()
    const { state } = useLocation()

    const { idComp } = state; // recebemos o valor do idComp que enviamos do ecrã das competições quando clicamos na competição

    const [indexBtn, setIndexBtn] = useState(-1);

    const db = getDatabase();
    const matchesRef = ref(db, '/provas/') // referência à base de dados para depois adicionar provas novas
    const competitionMatchesRef = query(ref(db, '/provas/'), orderByChild('competicao'), equalTo(idComp))
    const sportModalitiesRef = ref(db, '/modalidades/') // referência à base de dados para ir buscar as modalidades

    const [match, setMatch] = useState([])
    const [modalities, setModalities] = useState([])

    const [addNewMatchForm, setAddNewMatchForm] = useState(false);

    const showButton = (index) => {
        console.log(index)
        setIndexBtn(index)
    }

    const hideButton = () => {
        setIndexBtn(-1)
    }

    const showAddNewMatchForm = () => { setAddNewMatchForm(!addNewMatchForm) }

    useEffect(() => {

        const handler = (snapshot) => {
            let matchesArray = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                matchesArray.push([childKey, childData])
            });
            setMatch(matchesArray)
        }

        // Busca das provas existentes na competicao que selecionamos no ecrã anterior
        // const fetchProvasExistentes = onValue(competitionMatchesRef, handler)
        const fetchExistingMatches = onValue(competitionMatchesRef, handler)

        return (() => {
            // off(handler)
            // fetchProvasExistentes()
            fetchExistingMatches()
        })
    }, [])

    const deleteMatch = (key) => {
        const idMatch = key;

        const updates = {}
        updates[`/provas/${idMatch}/ativa`] = false

        update(ref(db), updates)
    }

    const goToParticipantsProva = (key) => {  // função redireciona para o ecrã dos participantes desta prova, e envia o id da prova para esse ecrã
        const idMatch = key;
        navigate('/participantes', { state: { idMatch } })
    }

    return (
        match.length == 0 ? ( // if there are no matches
            <div className={addNewMatchForm ? 'main-provascomp-container-dark' : 'main-provascomp-container'}>

                <div className={addNewMatchForm ? 'add-btn-container-dark' : 'add-btn-container'}>
                    <button className='show-add-new-match-btn' onClick={showAddNewMatchForm}>Adicionar Prova</button>
                </div>

                <div className={addNewMatchForm ? 'add-new-match-form-show' : 'add-new-match-form-hide'}>
                    <AddMatch addForm={addNewMatchForm} showForm={showAddNewMatchForm} />
                </div>
                
                <div className='main-prova-container'>
                    <div className='prova-container' style={{ justifyContent: 'center', alignItems: 'center', height: '180px' }}>
                        <p>
                            Competição sem provas programadas.
                            <br />
                            Adicione Provas
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className={addNewMatchForm ? 'main-provascomp-container-dark' : 'main-provascomp-container'}>
                <div className={addNewMatchForm ? 'add-btn-container-dark' : 'add-btn-container'}>
                    <button className='show-add-new-match-btn' onClick={showAddNewMatchForm}>Adicionar Prova</button>
                </div>

                <div className={addNewMatchForm ? 'add-new-match-form-show' : 'add-new-match-form-hide'}>
                    <AddMatch addForm={addNewMatchForm} showForm={showAddNewMatchForm} />
                </div>

                <div>
                    {/* <div className='match-list-headers-container'>
                        <div className='match-list-header'>Hora</div>
                        <div className='match-list-header'>Nome</div>
                        <div className='match-list-header'>Escalão</div>
                        <div className='match-list-header'>Género</div>
                    </div> */}

                    <table className={addNewMatchForm ? 'match-table-dark' : 'match-table'}>
                        <thead>
                            <tr className='match-table-header-row'>
                                <th className='match-table-header-row-cell'>Hora</th>
                                <th className='match-table-header-row-cell'>Nome</th>
                                <th className='match-table-header-row-cell'>Escalão</th>
                                <th className='match-table-header-row-cell'>Género</th>
                                <th className='match-table-header-row-cell'></th>
                                <th className='match-table-header-row-cell'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {match.map(([key, value], index) => { // fazemos map do array prova para um array com a chave da prova, os seus dados e index

                                const genders = {
                                    "Masculino": <IoIcons.IoMdMale className='icon-match-male-gender' color={addNewMatchForm ? 'rgba(3, 163, 255, 0.65)' : 'rgba(3, 163, 255, 1)'} />,
                                    "Feminino": <IoIcons.IoMdFemale className='icon-match-female-gender' color={addNewMatchForm ? 'rgba(236, 73, 167, 0.35)' : 'rgba(236, 73, 167, 1)'} />,
                                }
                                return (
                                    // <div>
                                    <tr onMouseEnter={() => showButton(index)}
                                        onMouseLeave={hideButton}>
                                        <td className='match-table-info-row-cell'>{value.hora}</td>
                                        <td className='match-table-info-row-cell'>
                                            <div>
                                                <div>
                                                    {value.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='match-table-info-row-cell'>
                                            <div>
                                                {value.escalao}
                                            </div>
                                        </td>
                                        <td className='match-table-info-row-cell'>{genders[value.genero]}</td>
                                        <td className='match-table-info-row-cell'>
                                            <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'}
                                                id='goto-participants-btn'
                                                onClick={() => goToParticipantsProva(key)}>
                                                Participantes
                                            </button>
                                        </td>
                                        <td className='match-table-info-row-cell'>
                                            <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'}
                                                id='apagar-prova-btn'
                                                onClick={() => window.confirm("Deseja mesmo remover?") && deleteMatch(key)}>
                                                <BsIcons.BsTrash className='remove-btn-icon' />
                                                Remover
                                            </button>
                                        </td>
                                    </tr>


                                    // <div key={key} className='prova-container'
                                    //     onMouseEnter={() => showButton(index)}
                                    //     onMouseLeave={hideButton}>
                                    //     <ul className='prova-list'>
                                    //         <li className='prova-list-item'>{value.hora}</li>
                                    //         <li className='prova-list-item'>{value.nome}</li>
                                    //         <li className='prova-list-item'>{value.escalao}</li>
                                    //         <li className='prova-list-item'>{genders[value.genero]}</li>
                                    //     </ul>
                                    //     <div className='prova-list-btn-container'>
                                    //         <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'} id='goto-participants-btn' onClick={() => goToParticipantsProva(key)}>Participantes</button>
                                    //         <button className={indexBtn == index ? 'prova-btn-show' : 'prova-btn-hide'} id='apagar-prova-btn' onClick={() => window.confirm("Deseja mesmo remover?") && deleteMatch(key)}>Remover</button>
                                    //     </div>
                                    // </div>
                                    // </div>
                                )

                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    )
};

export default ProvasCompetition;
