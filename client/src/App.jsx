import './App.css'
import './styles/theme.css'
import LandingPage from './Components/LandingPage/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import 'leaflet/dist/leaflet.css';
import Explore from './Components/Explore/Explore'
import AdminPanel from './Components/AdminPanel/AdminPanel'

function App(){

    return(
        <>
            <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/admin' element={<AdminPanel />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </>
    )

}

export default App