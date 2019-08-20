import { createStore } from "redux";
import updateReducer from "./reducers/updateReducer";
//import PouchMiddleware from 'pouch-redux-middleware';
//import PouchDB from 'pouchdb';


function configureStore(
      state = { notes: [] }
    ) {

    /*const localdb = new PouchDB('react-notes');
    const remotedb = new PouchDB('http://admin:adm123@127.0.0.1:5984/react-notes');

    const pouchMiddleware = PouchMiddleware({
      path: '/react-notes',
      localdb,
      actions: {
        remove: doc => { return { type: 'DELETE_TODO', id: doc._id } },
        insert: doc => { return { type: 'INSERT_TODO', note: doc } },
        batchInsert: docs => { return { type: 'BATCH_INSERT_TODOS', note: docs } },
        update: doc => { return { type: 'UPDATE_TODO', note: doc } },
      }
    });*/

    
    //applyMiddleware(pouchMiddleware)

    const store = createStore(
      updateReducer,
      state
    );

  return store;
}
export default configureStore;