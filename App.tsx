import Navbar_content from './template/Navbar_content'
import Footer from './template/Footer'
import { Outlet } from 'react-router-dom'
import React from 'react'
import './App.css'


const App = () => {
    return (
        <React.Fragment>
            <Navbar_content />
            <Outlet />
            <Footer />
        </React.Fragment>
    )
}

export default App
