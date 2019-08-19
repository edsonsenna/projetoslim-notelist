import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';


import Navbar from './components/navbar';

import IndexPage from './pages/index';
import ShowPage from './pages/show';
import NewPage from './pages/new';
import EditPage from './pages/edit';

import DB from './db';


class App extends Component{
  state = {
    db: new DB('react-notes'),
    notes: {},
    loading: true
  }

  async componentDidMount() {

    /*
    const remoteDB = await new DB('http://admin:adm123@127.0.0.1:5984/react-notes');

    console.log(remoteDB);

    this.db.sync(remoteDB, {
            
      }).on('change', function (info) {
      // handle change
          console.log('Mudou!');
      }).on('paused', function (err) {
      // replication paused (e.g. replication up to date, user went offline)
      }).on('active', function () {
      // replicate resumed (e.g. new changes replicating, user went back online)
      }).on('denied', function (err) {
      // a document failed to replicate (e.g. due to permissions)
      }).on('complete', function (info) {
      // handle complete
          console.log('Complete!');
      }).on('error', function (err) {
      // handle error
    });

    remoteDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
        retry: true, 
        style: 'all_docs'
    }).on('change', function(changes){
        console.log('Mudou1! => ', changes);
    });*/
    const notes = await this.state.db.getAllNotes();

    this.setState({
      notes,
      loading: false
    });
  }

  handleSave = async (note) => {
    let { id } = await this.state.db.createNote(note);

    const { notes } = this.state;

    await this.setState({
      notes: {
        ...notes, 
        [id]: note,
      }
    });


    const _notes = await this.state.db.getAllNotes();

    await this.setState({
      notes: _notes
    });

    return id;
  }

  handleUpdate = async (n) => {

    let note = await this.state.db.updateNote(n);

    const { notes } = this.state;

    notes[note.id] = {
      ...notes[note.id],
      "_id": note.id,
      "_rev": note.rev
    }


    const _notes = await this.state.db.getAllNotes();

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
