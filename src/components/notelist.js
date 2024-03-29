import React from 'react';
import { Link } from 'react-router-dom';

export default class NoteList extends React.Component {
    renderNotes() {
        const notes = Object.values(this.props.notes);

        return notes.map((n) => <div key={`note_${n._id}`} ><h2><Link to={`/notes/${n._id}`}>{n.title}</Link></h2></div>);
    }

    render(){
    
        return (
            <div>
                {this.renderNotes()}
            </div>
        )
    }
}