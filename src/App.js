import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import {Link} from 'react-router';

class App extends Component {

  render() {    
    return (
      <div id="layout">

          <a href="#menu" id="menuLink" className="menu-link">

              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">Company</a>

                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>                      
                      <li className="pure-menu-item"><Link to="/table" className="pure-menu-link">Create Table</Link></li>
                      <li className="pure-menu-item"><Link to="/column" className="pure-menu-link">Add Column</Link></li>
                      <li className="pure-menu-item"><Link to="/alter" className="pure-menu-link">Alter Table</Link></li>
                      <li className="pure-menu-item"><Link to="/bay" className="pure-menu-link">Get Table</Link></li>
                      
                      
                  </ul>
              </div>
          </div>

              <div id="main">
                {this.props.children}
              </div>            


      </div>     
    );
  }
}

export default App;