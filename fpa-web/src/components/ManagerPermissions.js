import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update, off } from "firebase/database"
import { UserAuthContext } from '../context/AuthContextProvider';

import '../styles/managerpermissions.css'


import * as BsIcons from 'react-icons/bs'
import * as IoIcons from 'react-icons/io'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'

import AddManagers from './AddManagers'

function ManagerPermissions() {

    const [showAddManagerComponent, setShowAddManagerComponent] = useState(false)
    const [users, setUsers] = useState([])
    const [sidebar, setSidebar] = useState(false);

    const showSideBar = () => { setSidebar(!sidebar) }
    const navigate = useNavigate()

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
                if (userObj.uid !== childKey) {
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
        users.length === 0 ? (
            <div className={showAddManagerComponent ? 'shadowed-container' : 'container'}>
                <div className='no-users-found-container'>
                    <h1>Sem Resultados</h1>
                    <p>Adicione um gestor novo.</p>
                </div>
            </div>
        ) : (
            <div className={showAddManagerComponent ? 'shadowed-container' : 'container'}>

                <div className={showAddManagerComponent ? 'main-add-manager-container' : 'hidden-main-add-manager-container'}>
                    <AddManagers showAddManagerComponent={showAddManagerComponent} setShowAddManagerComponent={setShowAddManagerComponent} />
                </div>

                <div>
                    <FaIcons.FaBars className='side-bar-openbtn' onClick={showSideBar} />
                    <nav className={sidebar ? 'side-bar-show' : 'side-bar-hide'}>
                        <ul className='side-bar-menu-times'>
                            <li>
                                <AiIcons.AiOutlineClose className='side-bar-closebtn' onClick={showSideBar} />
                            </li>
                            <li>
                                <button className='side-bar-btn' onClick={() => navigate('/atletas')}>Atletas</button>
                            </li>
                            <li>
                                <button className='side-bar-btn' onClick={() => navigate('/gestores')}>Gestores</button>
                            </li>
                            <li>
                                <button className='side-bar-btn' onClick={() => navigate('/clubes')}>Clubes</button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <button className={showAddManagerComponent ? 'shadowed-show-add-manager-btn' : 'show-add-manager-btn'} onClick={() => setShowAddManagerComponent(true)}>Adicionar gestor</button>

                <div className='user-headers'>
                    <h4 className='user-line-header'>Nome</h4>
                    <h4 className='user-line-header'>Email</h4>
                    <h4 className='user-line-header'>Status</h4>
                    <h4 className='user-line-header'></h4>
                </div>

                <div className='users-list'>
                    {users.map(([userKey, user], index) => {
                        const authorization = {
                            false: <label className='status-label'>Não Autorizado <BsIcons.BsXCircle id='not-authorized-icon' /> </label>,
                            true: <label className='status-label'>Autorizado <BsIcons.BsCheckCircle id='authorized-icon' /></label>
                        }
                        return (
                            <ul key={userKey} className='user-line'>
                                <li className='users-line-item'>{user.username}</li>
                                <li className='users-line-item'>{user.email}</li>
                                <li className='users-line-item' id={user.autorizado === false ? 'label-not-authorized' : 'label-authorized'}>{authorization[user.autorizado]}</li>
                                <li className='users-line-item'>
                                    <button className={showAddManagerComponent ? 'shadowed-update-btn' : 'update-btn'}
                                    // <button className={user.autorizado === false ? 'update-btn-autorizar' : 'update-btn-naoautorizar'}
                                        onClick={user.autorizado === false ? () => window.confirm("Deseja mesmo dar permissões a este utilizador?") && givePermissions(userKey) :
                                            () => window.confirm("Deseja mesmo retirar permissões a este utilizador?") && removePermissions(userKey)}>
                                        {user.autorizado === false ? "Dar Permissões" : "Tirar Permissões"}</button>
                                </li>
                            </ul>
                        )
                    })}
                </div >
            </div >
        )
    )
}

export default ManagerPermissions