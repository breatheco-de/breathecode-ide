//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';

//include your index.scss file into the bundle
import '../styles/index.scss';

//import your own components
import Home from './home.js';
import Sidebar from '../js/components/sidebar/sidebar';

//render your react application
ReactDOM.render(
    <Sidebar />,
    document.querySelector('#app')
);