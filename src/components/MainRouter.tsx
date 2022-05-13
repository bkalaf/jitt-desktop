/* eslint-disable react/no-children-prop */
/* eslint-disable react/boolean-prop-naming */
import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Grid } from './grid';
import { LoginPage } from './MainWindow';
import { Spinner } from './Spinner';
import { Modal } from './Modal';
import { InsertForm } from './InsertForm';
import { GridContainer } from './GridContainer';
import { LoginForm } from './forms/LoginForm';
import { ModalContainer } from './ModalContainer';

export type RealmTypes =
    | 'objectId'
    | 'uuid'
    | 'string'
    | 'bool'
    | 'int'
    | 'double'
    | 'float'
    | 'decimal128'
    | 'object'
    | 'list'
    | 'dictionary'
    | 'set'
    | 'date'
    | 'data'
    | 'linkingObjects';

export function MainRouter() {
    return (
        <Routes>
            <Route path='/'>
                <Route
                    path='login'
                    element={
                        <Modal>
                            <LoginForm />
                        </Modal>
                    }
                />
                <Route path='data'>
                    <Route path='v1'>
                        <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <InsertForm  />
                                        </ModalContainer>
                                        }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route index element={<GridContainer />} />
                        </Route>

                        {/* <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <React.Suspense fallback={<Spinner />}>
                                            <Modal>
                                                <InsertForm collectionName='' />
                                            </Modal>
                                        </React.Suspense>
                                    }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route
                                index
                                element={
                                    <React.Suspense fallback={<Spinner />}>
                                        <Grid />
                                    </React.Suspense>
                                }
                            />
                        </Route> */}
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
            </Route>
        </Routes>
    );
}
