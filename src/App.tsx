import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import NotFoundPage from "./Pages/error";
import AboutPage from "./Pages/about";
import Companies from "./Pages/company/moduls/Companies";
import Users from "./Pages/user/moduls/Users";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/users/*" element={<Users/>}/>
                <Route path="/companies/*" element={<Companies/>}/>
                <Route path='*' element={<Navigate to='/not-found' replace/>}/>
                <Route path='/not-found' element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
