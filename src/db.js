import PouchDB from 'pouchdb';

export default class DB {
    constructor(name) {
        this.db = new PouchDB(name);
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


}