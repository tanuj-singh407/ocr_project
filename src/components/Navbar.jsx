import React from 'react'
import logoimg from '../assets/logo_rapI854J.jpg'

const Navbar = () => {

    return (
        <>
            <nav className="navbar bg-white">
                <div className="container-fluid px-4">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <img src={logoimg} alt="Logo" className="d-inline-block align-text-top me-3" />
                        DashBoard
                    </a>
                </div>
            </nav>
        </>
    )
}

export default Navbar
