
import React from 'react';

import { connect } from 'react-redux';


const Banco = ({ notes }) => (
    <h1>Hello</h1>
);



export default connect(state => ({ notes: state.notes }))(Banco);