import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';


import Navbar from './components/navbar';

import IndexPage from './pages/index';
import ShowPage from './pages/show';
import NewPage from './pages/new';
import EditPage from './pages/edit';

import DB from './db';
import PouchDB from 'pouchdb';

class App extends Component{


  state = {
    localdb: null,
    remotedb: null,
    notes: {},
    loading: true
  }

  async componentDidMount() {

    var localDB = new DB('react-notes');
    //var localDB = new PouchDB('react-notes');

    var remoteDB = new PouchDB('http://admin:adm123@127.0.0.1:5984/react-notes');

    //console.log(localDB);

    localDB.db.sync(remoteDB, {})
      .on('change',function(info){
      console.log('Change!');
    }).on('complete',function(info){
      console.log('Sync!');
    });
    
    remoteDB.changes({
      since: 'now',
      live: true,
      include_docs: true,
      retry: true, 
      style: 'all_docs'
    }).on('change', function(changes){
      console.log(changes);
    });

    //this.state.db = new DB('react-notes');

    const notes = await localDB.getAllNotes();

   // const db_sync = await this.state.db.getRemoteDb();

    const notas = notes;

    this.state.localdb = localDB;
    this.state.remotedb = remoteDB.db;

    /*db_sync.changes({
        since: 'now',
        live: true,
        include_docs: true,
        retry: true, 
        style: 'all_docs'
    }).on('change', function(changes){
        console.log(changes);
        notas[changes.doc._id] = changes.doc;
        console.log(notas);

    });*/

    console.log(notas);

    this.setState({
      notes: notas,
      loading: false
    });
  }

  handleSave = async (note) => {
    let { id } = await this.state.localdb.createNote(note);

    const { notes } = this.state;

    await this.setState({
      notes: {
        ...notes, 
        [id]: note,
      }
    });


    const _notes = await this.state.localdb.getAllNotes();

    await this.setState({
      notes: _notes
    });

    return id;
  }

  handleUpdate = async (n) => {

    let note = await this.state.localdb.updateNote(n);

    const { notes } = this.state;

    notes[note.id] = {
      ...notes[note.id],
      "_id": note.id,
      "_rev": note.rev
    }


    const _notes = await this.state.localdb.getAllNotes();

    await this.setState({
      notes: _notes
    });

    return note.id;

  }

  renderContent() {

    if(this.state.loading) {
      return <h2>Loading...</h2>
    }
    return (
      <div className="app-content">
        <Route exact path="/" component={(props) => <IndexPage {...props} notes = {this.state.notes} />} />
        <Route exact path="/notes/:id" component={(props) => <ShowPage {...props} note={this.state.notes[props.match.params.id]}/>}/>
        <Route exact path="/notes/edit/:id" component={(props) => <EditPage {...props} onUpdate={this.handleUpdate} note={this.state.notes[props.match.params.id]}/>}/>
        <Route exact path="/new" component={(props) => <NewPage {...props} onSave={this.handleSave} />} />
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          { this.renderContent() }
        </div>
      </BrowserRouter>
      
    );
  }
  
}

export default App;
