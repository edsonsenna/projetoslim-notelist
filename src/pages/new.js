import React from 'react';
import { Link } from 'react-router-dom';

import DB from '../db';

import './form.css';

export default class NewPage extends React.Component {
    state = {
        db: new DB('react-notes'),
        note: {
            title: '',
            body: '',
            createdAt: undefined,
            updatedAt: undefined
        }
    }


    updateValue = (e) => {
        const { note } = this.state;

        this.setState({
            note: {...note, [e.target.name]: e.target.value }
        });
    }

    handleSave = async (e) => {
        e.preventDefault();

        const id = await this.props.onSave(this.state.note);

        this.props.history.replace(`/notes/${ id }`);
    }


    render() {
        const { note } = this.state;

        console.log(this.props);

        return (
            
            <div className="note-form">
                <h1>New Note</h1>
                <form onSubmit={this.handleSave}>
                    <div className="note-form-field">
                        <label>Title</label>
                        <input type="text" name="title" value={note.title} onChange={this.updateValue}/>
                    </div>
                    <div className="note-form-field note-form-field-text">
                        <textarea name="body" value={note.body} onChange={this.updateValue} />
                    </div>
                    <div className="note-form-buttons">
                        <button className="btn">Save</button>
                        <Link to="/">Cancel</Link>
                    </div>
                </form>
               
            </div>
        )
    }
}