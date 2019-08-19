import PouchDB from 'pouchdb';

export default class DB {
    constructor(name) {
        this.db = new PouchDB(name);
        
        this.remoteDB = new PouchDB('http://admin:adm123@127.0.0.1:5984/react-notes');

        this.db.sync(this.remoteDB, {
            
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


        this.remoteDB.changes({
            since: 'now',
            live: true,
            include_docs: true,
            retry: true, 
            style: 'all_docs'
        }).on('change', function(changes){
            console.log('Mudou1! => ', changes);
        });
          
    }

    async getAllNotes() {

        let allNotes = await this.db.allDocs({
            include_docs: true
        });

        let notes = {};

        allNotes.rows.forEach( n => notes[n.id] = n.doc);



        return notes;

    }

    async createNote(note) {

        note.createdAt = new Date();
        note.updatedAt = new Date();

        const res = await this.db.post({ ...note });

        return res;
    }

    async getNote(_id) {
        const res = await this.db.get(_id);

        return res;
    }

    async updateNote(note) {

        note.createdAt = new Date();

        const res = await this.db.put({ ...note });

        return res;
    }


}