import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';


import Navbar from './components/navbar';

import IndexPage from './pages/index';
import ShowPage from './pages/show';
import NewPage from './pages/new';

import DB from './db';


class App extends Component{
  state = {
    db: new DB('react-notes'),
    notes: {},
    loading: true
  }

  async componentDidMount() {
    const notes = await this.state.db.getAllNotes();

    this.setState({
      notes,
      loading: false
    });
  }

  handleSave = async (note) => {
    let { id, name } = await this.state.db.createNote(note);

    const { notes } = this.state;

    this.setState({
      notes: {
        ...notes, 
        [id]: note,
      }
    });

    return id;
  }

  renderContent() {

    if(this.state.loading) {
      return <h2>Loading...</h2>
    }
    return (
      <div className="app-content">
        <Route exact path="/" component={(props) => <IndexPage {...props} notes = {this.state.notes} />} />
        <Route exact path="/notes/:id" component={(props) => <ShowPage {...props} note={this.state.notes[props.match.params.id]}/>}/>
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
