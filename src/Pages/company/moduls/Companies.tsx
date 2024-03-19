import {Route, Routes} from "react-router-dom";
import CompaniesPage from "../list";
import ProfilePage from "../profile";
import React from "react";

export default function Companies() {
    return (
        <Routes>
            <Route path="/" element={<CompaniesPage/>}/>
            <Route path="profile/:id" element={<ProfilePage/>}/>
        </Routes>
    );
}