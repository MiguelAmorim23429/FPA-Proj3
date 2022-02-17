import React, { useState, useEffect, useContext } from 'react'
import './managerpermissions.css'
import { getDatabase, ref, onValue, update, off } from "firebase/database"
import { UserAuthContext } from '../context/AuthContextProvider';

function ManagerPermissions() {

    const [users, setUsers] = useState([])

    const db = getDatabase()

    const usersRef = ref(db, '/users/')

    const { user } = useContext(UserAuthContext);

    console.log(user)

    useEffect(() => {
        
        const handler = (snapshot) => {
            let users = []
            let utilizador = {}
            // let loggedUser = user
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                utilizador = JSON.parse(localStorage.getItem("logged-user"))
                if(utilizador.uid != childKey) {
                    users.push([childKey, childData])
                }
            });
            setUsers(users)
        }

        const fetchUsers = onValue(usersRef, handler)

        return (() => {
            off(handler)
            fetchUsers()
        })
    }, [])

    const darAutorizacoes = (key) => {
        const idUser = key;

        const updates = {}
        updates[`/users/${idUser}/autorizado`] = true

        update(ref(db), updates)
    }

    const tirarAutorizacoes = (key) => {
        const idUser = key;

        const updates = {}
        updates[`/users/${idUser}/autorizado`] = false

        update(ref(db), updates)
    }


    return (
        users.length == 0 ? (
            <div className='main-managerpermissions-container'>
                <div className='users-list-container'>
                    <div className='users-container' style={{ justifyContent: 'center', alignItems: 'center', height: '180px' }}>
                        <p>Não existem utilizadores inscritos. <br/>
                        Adicione utilizadores</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className='main-managerpermissions-container'>
                <div className='users-list-container'>
                    {users.map(([key, user], index) => {
                        const autorizacao = {
                            false: <label>Não Autorizado</label>,
                            true: <label>Autorizado</label>
                        }
                        return (
                            <div key={key} className='users-container'>
                                <ul className='users-info-list'>
                                    <li className='users-list-item'>{user.username}</li>
                                    <li className='users-list-item'>{user.email}</li>
                                    <li className='users-list-item' id={user.autorizado == false ? 'label-naoautorizado' : 'label-autorizado'}>{autorizacao[user.autorizado]}</li>
                                    <button className={user.autorizado == false ? 'update-btn-autorizar' : 'update-btn-naoautorizar'} onClick={user.autorizado == false ? () => window.confirm("Deseja mesmo dar permissões a este utilizador?") && darAutorizacoes(key) : () => window.confirm("Deseja mesmo retirar permissões a este utilizador?") && tirarAutorizacoes(key)}>{user.autorizado == false ? "Dar Permissões" : "Tirar Permissões"}</button>
                                </ul>
                            </div>
                        )
                    })}
                </div >
            </div >
        )
    )
}

export default ManagerPermissions