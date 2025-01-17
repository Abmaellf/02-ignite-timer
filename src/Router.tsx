import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout'

export function Router() {
    return(
        <Routes>

            <Route path='/' element={<DefaultLayout />} >
                <Route path="/" element={<Home />}/>
                <Route path="/history" element={<History />}/>
            </Route>

            {/* Exemplo feito pelo Diego
            <Route path='/admin' element={<AdminLayout />} >
                <Route path="/products" element={<Products />}/>
            </Route> */}


        </Routes>
    )
}