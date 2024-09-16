import { update, getDatabase, ref } from 'firebase/database';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../context/AuthContextProvider';
import '../styles/updatecompetition.css'

const UpdateCompetition = () => {

    const navigate = useNavigate()
    // const { state } = useLocation()
    // const { idComp, nomeComp, dataComp, localComp, fotoComp } = state

    const { idComp, nameComp, dateComp, locationComp, photoComp } = useContext(UserAuthContext);

    const [name, setName] = useState(nameComp);
    const [date, setData] = useState(dateComp);
    const [location, setLocal] = useState(locationComp);

    const [timer, setTimer] = useState(null)

    const [errors, setErrors] = useState({
        name: {
            valid: false,
            message: '',
        },
        date: {
            valid: false,
            message: '',
        },
        location: {
            valid: false,
            message: '',
        },
    })

    const db = getDatabase()

    const updateCompetition = () => {
        const id = idComp;

        const compData = {
            ativa: true,
            data: date,
            local: location,
            nome: name,
            foto: photoComp,
        }

        const updates = {}
        updates['/competicoes/' + id] = compData

        update(ref(db), updates)
        navigate('/')
    }

    useEffect(() => {

        const emptyString = ''

        console.log(name)
        console.log(date)
        console.log(location)

        clearTimeout(timer)

        setTimer(
            setTimeout(() => {
                if (name === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else {
                    if (name.length < 6) {
                        setErrors(prevState => ({
                            ...prevState,
                            name: {
                                valid: false,
                                message: 'O nome tem de ter pelo menos 6 caracteres.',
                            }
                        }))
                    } else {
                        setErrors(prevState => ({
                            ...prevState,
                            name: {
                                valid: true,
                                message: '',
                            }
                        }))
                    }
                }

                if (date === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else {

                    let competitionChoosenStartDate = new Date(date)

                    console.log(competitionChoosenStartDate)

                    if (competitionChoosenStartDate < Date.now()) {
                        setErrors(prevState => ({
                            ...prevState,
                            date: {
                                valid: false,
                                message: 'A data tem de ser posterior à data de hoje.',
                            }
                        }))
                    } else {
                        setErrors(prevState => ({
                            ...prevState,
                            date: {
                                valid: true,
                                message: '',
                            }
                        }))
                    }
                }

                if (location === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: '',
                        }
                    }))
                } else if (location.length < 6) {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: false,
                            message: 'O local tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        location: {
                            valid: true,
                            message: '',
                        }
                    }))
                }

            }, 500)
        )
    }, [name, date, location]);

    return (
        <div className='main-update-comp'>
            <form className='update-comp-form' onSubmit={updateCompetition}>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Nome</label>
                        <input className='update-comp-input' type='text' value={name}
                            onChange={event => setName(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.name.valid && errors.name.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Data</label>
                        <input className='update-comp-input' type='date' value={date}
                            onChange={event => setData(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.date.valid && errors.date.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Local</label>
                        <input className='update-comp-input' required type='text' value={location}
                            onChange={event => setLocal(event.target.value)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>{!errors.location.valid && errors.location.message}</label>
                    </div>

                </div>

                <button className='update-comp-btn' type='submit'>Atualizar</button>
            </form>
        </div>
    )
};

export default UpdateCompetition;
