import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TableBox from './controller/table/create/Table';
import AlterTableBox from './controller/table/edit/AlterTable';
import BayTableBox from './controller/table/all/BayTable';
import DropTableBox from './controller/table/drop/drop-table';
import AddColumnBox from './controller/column/add/AddColumn';
import DataTypeBox from './controller/column/add/Alter-data-type';
import AddNotNullBox from './controller/column/add/add-not-null';
import DropNotNullBox from './controller/column/add/drop-not-null';
import DropColumnBox from './controller/column/add/drop-column';
import InsertIntoBox from './controller/table-controller/insert-into';
import SelectTableBox from './controller/table-controller/select';
import SelectTableIdBox from './controller/table-controller/select-id';
import UpdateTableIdBox from './controller/table-controller/update-attribute';
import UpdateTableBox from './controller/table-controller/updade-all';
import DeleteTableIdBox from './controller/table-controller/delete-id';
import DeleteTableBox from './controller/table-controller/delete-all';

import Home from './Home';
import './index.css';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.render(
 ( <Router history={browserHistory}>

    <Route path="/" component={App}>

    <IndexRoute component={Home}/>
    
    <Route path="/table" component={TableBox}/>
    <Route path="/alter" component={AlterTableBox}/>
    <Route path="/bay" component={BayTableBox}/>
    <Route path="/drop/table" component={DropTableBox}/>
    <Route path="/column" component={AddColumnBox}/>  
    <Route path="/alter/data" component={DataTypeBox}/>
    <Route path="/not/null" component={AddNotNullBox}/>
    <Route path="/drop/not/null" component={DropNotNullBox}/>
    <Route path="/drop/column" component={DropColumnBox}/>
    <Route path="/insert" component={InsertIntoBox}/>
    <Route path="/select" component={SelectTableBox}/>
    <Route path="/select/id" component={SelectTableIdBox}/>
    <Route path="/update/id" component={UpdateTableIdBox}/>
    <Route path="/update" component={UpdateTableBox}/>
    <Route path="/delete/id" component={DeleteTableIdBox}/>
    <Route path="/delete" component={DeleteTableBox}/>
    
    
    </Route>

  </Router>),
  document.getElementById('root')
);
