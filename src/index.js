import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TableBox from './Table';
import AddColumnBox from './AddColumn';
import AlterTableBox from './AlterTable';
import BayTableBox from './BayTable';
import Home from './Home';
import './index.css';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.render(
 ( <Router history={browserHistory}>

    <Route path="/" component={App}>

    <IndexRoute component={Home}/>
    
    <Route path="/table" component={TableBox}/>
    <Route path="/column" component={AddColumnBox}/> 
    <Route path="/alter" component={AlterTableBox}/>
    <Route path="/bay" component={BayTableBox}/>
    
    </Route>

  </Router>),
  document.getElementById('root')
);
