import React from 'react';

import NoteList from '../components/notelist';


export default class IndexPage extends React.Component {

    
    render() {
        //console.log(this.props);
        return (
            <div>
                <h1>Notes</h1>
                <NoteList notes={this.props.notes} />
            </div>
        )

    }

}