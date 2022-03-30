import React, { useState, useEffect, useContext } from 'react'
import { UserAuthContext } from '../context/AuthContextProvider';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

import * as AiIcons from 'react-icons/ai'

function AddMatch(props) {

    const db = getDatabase();
    const matchesRef = ref(db, '/provas/')
    const sportModalitiesRef = ref(db, '/modalidades/') // referência à base de dados para ir buscar as modalidades

    const navigate = useNavigate()

    const { idComp } = useContext(UserAuthContext);

    const [hour, setHour] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [gender, setGender] = useState('0');
    const [sportModality, setSportModality] = useState('0');
    const [ageGroup, setAgeGroup] = useState('0');

    const [modalities, setModalities] = useState([])

    const [timer, setTimer] = useState(null)

    const [errors, setErrors] = useState({
        name: {
            valid: false,
            message: '',
        },
        hour: {
            valid: false,
            message: '',
        },
        category: {
            valid: false,
            message: '',
        },
    })

    const statusValueOfForm = props.addForm
    const showAddNewMatchForm = props.showForm

    const addMatch = () => {
        // e.preventDefault();

        const newProvaRef = push(matchesRef, {
            categoria: category,
            competicao: idComp,
            escalao: ageGroup,
            genero: gender,
            hora: hour,
            modalidade: sportModality,
            nome: name,
            estado: "emInscricoes"
        })

        const provaId = newProvaRef.key

        setHour('')
        setName('')
        setCategory('')
        setGender('0')
        setSportModality('0')
        setAgeGroup('0')
    }

    useEffect(() => {

        // console.log(!errors.name.valid)

        const handler = (snapshot) => {
            let sportModalitiesArray = []

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                sportModalitiesArray.push([childKey, childData])
            });
            setModalities(sportModalitiesArray)
        }

        const fetchSportModalities = onValue(sportModalitiesRef, handler)

        return (() => {
            // off(handler)
            fetchSportModalities()
        })
    }, []);

    useEffect(() => {

        const emptyString = ''

        console.log(name)
        console.log(hour)
        console.log(category)

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
                if (hour === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        hour: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        hour: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                    console.log(errors.hour.valid)
                }
                if (category === '') {
                    setErrors(prevState => ({
                        ...prevState,
                        category: {
                            valid: false,
                            message: emptyString,
                        }
                    }))
                } else if (category.length < 6) {
                    console.log(`${category} tem de ter mais de 6 caracteres`)

                    setErrors(prevState => ({
                        ...prevState,
                        category: {
                            valid: false,
                            message: 'A categoria tem de ter pelo menos 6 caracteres.',
                        }
                    }))
                    console.log(errors)
                } else {
                    setErrors(prevState => ({
                        ...prevState,
                        category: {
                            valid: true,
                            message: emptyString,
                        }
                    }))
                    console.log(errors)
                }

            }, 500)
        )
    }, [name, hour, category]);

    const handleSubmit = (e) => {
        if (errors.name.valid && errors.hour.valid && errors.category.valid) {
            e.preventDefault();
            addMatch();
            console.log("submeteu");
        } else {
            e.preventDefault();
            console.log("ADSAD")
            return false
        }
    }

    const handleChangeWithValidation = (event) => {

        let targetName = event.target.name
        let targetValue = event.target.value

        if (targetName === 'name') {
            setName(targetValue)
        }

        if (targetName === 'hour') {
            setHour(targetValue)
        }

        if (targetName === 'category') {
            setCategory(targetValue)
        }

    }

    return (
        <div className='main-add-new-match-container'>
            <AiIcons.AiOutlineClose className='add-new-match-form-closebtn' onClick={showAddNewMatchForm} />

            <form className='add-new-match-form' onSubmit={handleSubmit}>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Nome</label>
                        <input className='add-new-match-input'
                            name='name'
                            value={name}
                            onChange={event => handleChangeWithValidation(event)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>aaa</label> */}
                        <label className='validation-label'>{!errors.name.valid && errors.name.message}</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Hora</label>
                        <input className='add-new-match-input' placeholder='ex: 09:32, 13:09'
                            name='hour'
                            type='time'
                            value={hour}
                            // onChange={event => setHour(event.target.value)}></input>
                            onChange={event => handleChangeWithValidation(event)}></input>
                    </div>

                    <div className='input-validation-box'>
                        <label className='validation-label'>bbb</label>
                    </div>

                </div>

                <div className='input-container'>
                    <div className='input-value-box'>
                        <label>Categoria</label>
                        <input className='add-new-match-input'
                            name='category'
                            value={category}
                            onChange={event => handleChangeWithValidation(event)}></input>
                    </div>

                    <div className='input-validation-box'>
                        {/* <label className='validation-label'>ccc</label> */}
                        <label className='validation-label'>{!errors.category.valid && errors.category.message}</label>
                    </div>

                </div>

                <div className='select-box-container'>
                    <select className='info-match-select-box'
                        value={gender}
                        onChange={event => setGender(event.target.value)}>

                        <option className='select-default' value="0">Género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>

                    </select>

                    <select className='info-match-select-box'
                        value={sportModality}
                        onChange={event => setSportModality(event.target.value)}>

                        <option className='select-default' value="0">Modalidade</option>
                        {modalities.map(([key, value]) => {
                            return (
                                <option key={key} value={key}>{value.nome}</option>
                            )
                        })}

                    </select>

                    <select className='info-match-select-box'
                        value={ageGroup}
                        onChange={event => setAgeGroup(event.target.value)}>

                        <option className='select-default' value="0">Escalão</option>
                        <option value="INICIADOS">INICIADOS</option>
                        <option value="JUNIORES">JUNIORES</option>

                    </select>
                </div>
                <button className='add-new-match-btn' type='submit'>Adicionar</button>
            </form>
        </div>

    )
}

export default AddMatch