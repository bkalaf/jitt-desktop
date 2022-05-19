import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainMenu } from './MainMenu';

export function ModuleMenu() {
    return (
        <Routes>
            <Route path='/*' element={<MainMenu />}></Route>
        </Routes>
    );
}



