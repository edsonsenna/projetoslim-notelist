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


import { connect } from 'react-redux';

import updateNotes from './actions/updateNotes';

class App extends Component{


  state = {
    db:  new DB('react-notes'),
    notes: [],
    loading: true
  }

  async componentDidMount() {

    var remoteDB = new PouchDB('http://admin:adm123@127.0.0.1:5984/react-notes');

    const self = this;

    this.state.db.db.sync(remoteDB, {
      live:true
    })
      .on('change',function(info){
      console.log('Change!', info);

    }).on('active',function(info){
      console.log('Voltou a net!');


    })
    .on('complete',function(info){
      console.log('Sync!', info);
    }).on('error', function(err){
      console.log(err);
    });

    
    const notas = await this.state.db.getAllNotes();
    //this.state.notes = notas;

    remoteDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
        retry: true, 
        style: 'all_docs'
    }).on('change', async function(changes){
        console.log('Changes => ', changes);
        // console.log('State => ', self);
        // var _notas = self.props.notes;
        // _notas[changes.doc._id] = changes.doc;

        
        // self.props.updateNotes(_notas);

        const notas = await remoteDB.allDocs({include_docs: true});

        let notes = {};

        notas.rows.forEach( n => notes[n.id] = n.doc);
        
        self.props.updateNotes(notes);
    });

    ///console.log(notas);


    this.props.updateNotes(notas);

    //const _notas = await this.state.db.getAllNotes();

    //this.props.updateNotes(_notas);
    
    this.setState({
    //   ...this.state,
      loading: false
    });


    
  }

  handleSave = async (note) => {
    let { id } = await this.state.db.createNote(note);

    const notas = await this.state.db.getAllNotes();

    this.props.updateNotes(notas);

    return id;
  }

  handleUpdate = async (n) => {

    let note = await this.state.db.updateNote(n);

    const notas = await this.state.db.getAllNotes();

    this.props.updateNotes(notas);

    return note.id;

  }

  renderContent() {

    if(this.state.loading) {
      return <h2>Loading...</h2>
    }
    return (
      <div className="app-content">
        <Route exact path="/" component={(props) => <IndexPage {...props} notes={this.props.notes} />} />
        <Route exact path="/notes/:id" component={(props) => <ShowPage {...props} note={this.props.notes[props.match.params.id]}/>}/>
        <Route exact path="/notes/edit/:id" component={(props) => <EditPage {...props} onUpdate={this.handleUpdate} note={this.props.notes[props.match.params.id]}/>}/>
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



const mapStateToProps = state => ({
  notes: state.notes
});

const mapDispatchToProps = dispatch => ({
  updateNotes: (notes) => dispatch(updateNotes (notes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
