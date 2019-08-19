import React from 'react';
import { Link } from 'react-router-dom';

import './navbar.css';

export default class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <h1><Link to="/">ReactNotes</Link></h1>
                <div className="navbar-buttons">
                    <Link to="/new" className="btn">New Note</Link>
                </div>
            </nav>
            
        );
    }
}