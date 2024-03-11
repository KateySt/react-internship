import {Route, Routes} from "react-router-dom";
import UsersPage from "../list";
import ProfilePage from "../profile";
import AuthorizationPage from "../authorization";
import RegistrationPage from "../registration";
import React from "react";

export default function Users() {
    return (
        <Routes>
            <Route path="/" element={<UsersPage/>}/>
            <Route path="profile" element={<ProfilePage/>}/>
            <Route path="auth" element={<AuthorizationPage/>}/>
            <Route path="regist" element={<RegistrationPage/>}/>
        </Routes>
    );
}