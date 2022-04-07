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
                            message: emptyString,
                        }
                    }))
                    console.log(`arroz: ${errors.name.message}`)
                } else if (name.length < 6) {
                    console.log(`${name} tem de ter mais de 6 caracteres`)
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: false,
                            message: 'O nome tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                    console.log(`nome valido: ${errors.name.valid} / hora valida: ${errors.hour.valid} / categoria valida: ${errors.category.valid}`)
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        name: {
                            valid: true,
                            message: emptyString,
                        }
                    }))

                    console.log(`nome valido: ${errors.name.valid} / hora valida: ${errors.hour.valid} / categoria valida: ${errors.category.valid}`)
                }
                if (date === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        date: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                    console.log(errors.date.valid)
                }
                // if (location === '') {
                //     setErrors(prevState => ({
                //         ...prevState,
                //         location: {
                //             valid: false,
                //             message: emptyString,
                //         }
                //     }))
                // } else if (location.length < 6) {
                //     console.log(`${location} tem de ter mais de 6 caracteres`)

                //     setErrors(prevState => ({
                //         ...prevState,
                //         location: {
                //             valid: false,
                //             message: 'A categoria tem de ter pelo menos 6 caracteres.',
                //         }
                //     }))
                //     console.log(errors)
                // } else {
                //     setErrors(prevState => ({
                //         ...prevState,
                //         location: {
                //             valid: true,
                //             message: emptyString,
                //         }
                //     }))
                //     console.log(errors)
                // }

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
                        {/* <label className='validation-label'>aaa</label> */}
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
                        {/* <label className='validation-label'>bbb</label> */}
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
                        {/* <label className='validation-label'>ccc</label> */}
                        <label className='validation-label'>{!errors.location.valid && errors.location.message}</label>
                    </div>

                </div>

                <button className='update-comp-btn' type='submit'>Atualizar</button>
            </form>
        </div>
    )
};

export default UpdateCompetition;
