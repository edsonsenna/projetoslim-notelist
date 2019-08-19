import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import EditPage from './edit';

import DB from '../db';

export default class ShowPage extends React.Component {
    state = {
        db: new DB('react-notes'),
        note: {}
    }

    renderContent() {

        const { note } = this.props;

        if(!note._id) {
            return <div><h2>Loading...</h2></div>
        }

        return (
            <div> <Route exact path="/edit" component={(props) => <EditPage {...props} note={note} />} /></div>
        )
    
        
    }

    render() {
        const { note } = this.props;

        if (!note) {
            return null;
        }

        return (
            <BrowserRouter>
                { this.renderContent() }
               
                <div>
                    <h1>{ note.title }</h1>
                    <div>{ note.body }</div>
                    <div><Link to="/edit" >Editar</Link></div>
                </div>  
            </BrowserRouter>
            
        )
    }
}