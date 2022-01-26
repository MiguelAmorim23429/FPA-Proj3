import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import reportWebVitals from './reportWebVitals';
import { UserAuthContextProvider } from './context/UserAuthContext';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddCompetition from './components/AddCompetition';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />   */}
          <ProtectedRoute path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={<p>aAAAAAAAAAAAAAA</p>} />
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
