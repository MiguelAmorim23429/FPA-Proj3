import React, { useState, useEffect } from 'react';
import '../styles/addathlete.css'
import { getDatabase, ref, push, onValue, get } from "firebase/database"
import { useNavigate } from 'react-router-dom';

import * as AiIcons from 'react-icons/ai'

const AddAthlete = (props) => {

    const { showAddAthleteComponent, setShowAddAthleteComponent } = props

    const [club, setClub] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');
    const [federationNumber, setFederationNumber] = useState('');
    const [name, setName] = useState('');

    const [clubs, setClubs] = useState([]);

    const navigate = useNavigate();

    const db = getDatabase();

    const athletesRef = ref(db, '/atletas/');

    useEffect(() => {
        const clubsRef = ref(db, '/clubes/');

        const handler = async (snapshot) => {
            let clubsArray = []
            // let clubsObj = {}

            let clubsSnapshot = await get(clubsRef);

            // clubsSnapshot.forEach((childSnapshot) => {
            //     const childKey = childSnapshot.key;
            //     const childData = childSnapshot.val();
            //     clubsArray.push([childKey, childData]);
            // });

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                clubsArray.push([childKey, childData])
                // clubsObj[childKey] = childData;
            });
            setClubs(clubsArray)

            console.log("aa", clubsArray)
        }

        const closeFetchClubs = onValue(clubsRef, handler)

        // clubs.map(([key, value]) => {
        //     console.log(`aa: ${key}`, `bb: ${value.nome}`);
        // })
        // console.log(clubs)
        return () => {
            closeFetchClubs()
        }
    }, [])


    const adicionarAtleta = () => {

        const newAtletaRef = push(athletesRef, {
            clube: club,
            dtNascimento: birthDate,
            escalao: ageGroup,
            genero: gender,
            nFederacao: federationNumber,
            nome: name,
        })

        const atletaId = newAtletaRef.key
        console.log(atletaId)
        navigate('/')
    }

    return (
        <div className='add-athlete-form-container'>
            <AiIcons.AiOutlineClose className='form-closebtn' onClick={() => setShowAddAthleteComponent(false)} />
            <form className='add-athlete-form' onSubmit={adicionarAtleta}>

                <div className='add-athlete-input-container'>
                    <div className='input-value-box'>
                        <label className='add-athlete-label'>Nome</label>
                        <input className='add-athlete-input' placeholder='Nome' type='text' value={name}
                            onChange={event => setName(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                </div>

                <div className='add-athlete-input-container'>
                    <div className='input-value-box'>
                        <label className='add-athlete-label'>Número de federação</label>
                        <input className='add-athlete-input' placeholder='Número de federação' type='text' value={federationNumber}
                            onChange={event => setFederationNumber(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                </div>

                {/* <div className='add-athlete-input-container'>
                    <div className='input-value-box'>
                        <label className='add-athlete-label'>Clube</label>
                        <input className='add-athlete-input' placeholder='Clube' type='text' value={club}
                            onChange={event => setClub(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                {/* </div>  */}

                <div className='add-athlete-input-container'>
                    <div className='input-value-box'>
                        <label className='add-athlete-label'>Data de nascimento</label>
                        <input className='add-athlete-input' type='date' value={birthDate} onChange={event => setBirthDate(event.target.value)}></input>
                    </div>

                    {/* <div className='input-validation-box'>
                        <label className='validation-label'></label>
                    </div> */}
                </div>


                <select required onChange={event => setGender(event.target.value)}>
                    <option selected hidden disabled value="">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>

                <select required onChange={event => setClub(event.target.value)}>
                    <option selected hidden disabled value="">Clube</option>
                    {clubs.map(([key, value]) => {
                        return (<option value={key}>{value.nome} - {value.sigla}</option>)
                    })}
                </select>

                <select required onChange={event => setAgeGroup(event.target.value)}>
                    <option selected hidden disabled value="">Escalão</option>
                    <option value="INICIADOS">INICIADOS</option>
                    <option value="JUNIORES">JUNIORES</option>
                </select>

                <button className='add-athlete-btn' type='submit'>Adicionar</button>
            </form>
        </div>
    )
};

export default AddAthlete;
