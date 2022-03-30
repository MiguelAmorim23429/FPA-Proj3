import React, { useState, useEffect, useContext } from 'react'
import '../styles/managerpermissions.css'
import { getDatabase, ref, onValue, update, off } from "firebase/database"
import { UserAuthContext } from '../context/AuthContextProvider';

import * as BsIcons from 'react-icons/bs'

function ManagerPermissions() {

    const [users, setUsers] = useState([])

    const db = getDatabase()

    const usersRef = ref(db, '/users/')

    const { user } = useContext(UserAuthContext);

    console.log(user)

    useEffect(() => {
        
        const handler = (snapshot) => {
            let usersArray = []
            let userObj = {}
            // let loggedUser = user
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                userObj = JSON.parse(localStorage.getItem("logged-user"))
                if(userObj.uid != childKey) {
                    usersArray.push([childKey, childData])
                }
            });
            setUsers(usersArray)
        }

        const fetchUsers = onValue(usersRef, handler)

        return (() => {
            off(handler)
            fetchUsers()
        })
    }, [])

    const givePermissions = (key) => {
        const idUser = key;

        const updates = {}
        updates[`/users/${idUser}/autorizado`] = true

        update(ref(db), updates)
    }

    const removePermissions = (key) => {
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
                        const authorization = {
                            false: <label className='status-label'>Não Autorizado <BsIcons.BsXCircle id='not-authorized-icon'/> </label>,
                            true: <label className='status-label'>Autorizado <BsIcons.BsCheckCircle id='authorized-icon'/></label>
                        }
                        return (
                            <div key={key} className='users-container'>
                                <ul className='users-info-list'>
                                    <li className='users-list-item'>{user.username}</li>
                                    <li className='users-list-item'>{user.email}</li>
                                    <li className='users-list-item' id={user.autorizado == false ? 'label-not-authorized' : 'label-authorized'}>{authorization[user.autorizado]}</li>
                                    <button className={user.autorizado == false ? 'update-btn-autorizar' : 'update-btn-naoautorizar'} onClick={user.autorizado == false ? () => window.confirm("Deseja mesmo dar permissões a este utilizador?") && givePermissions(key) : () => window.confirm("Deseja mesmo retirar permissões a este utilizador?") && removePermissions(key)}>{user.autorizado == false ? "Dar Permissões" : "Tirar Permissões"}</button>
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