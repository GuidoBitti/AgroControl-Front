import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './Account/Login.tsx'
import { Register } from './Account/Register.tsx'
import { ForgotPsw } from './Account/ForgotPsw.tsx'

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route path='/forgot-password' element={<ForgotPsw />}/>

                <Route path='*' element={<Login />}/>
            </Routes>
        </BrowserRouter>
    )
}