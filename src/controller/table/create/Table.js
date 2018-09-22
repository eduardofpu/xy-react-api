import React, { Component } from 'react';
import InputCustomizado from '../../../componentes/InputCustomizado';
import Pagination from "react-js-pagination";
import PubSub from 'pubsub-js';
import "bootstrap/less/bootstrap.less";
import Call from './helpers';
import { BASE_URL } from '../../../core/constants'

class FormularioTable extends Component {
    constructor() {
        super();
        this.state = { nameTable: ''};
        this.enviaForm = this.enviaForm.bind(this);
       
    }
    
    enviaForm (evento){
       evento.preventDefault();
       
       const URL = `${BASE_URL}/create/table`;
       const stringiFy = JSON.stringify({nameTable: this.state.nameTable, headers: this.state.headers });
       const setState = this.setState.bind(this);
       const name = this.state.nameTable;
             
       new Call().urlCallbackPost(URL, stringiFy, setState, name); 
    }
    
    render() {
        return (
            <div className="autorForm">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nameTable" type="text"  name="nameTable"  value={this.state.nameTable} required placeholder="Name" 
                    onChange={new Call().butonSave.bind(this,'nameTable')} label="Table Name"/>
                    
                    <div className="pure-control-group">
                        <label></label>                       
                        <button type="submit" className="pure-button pure-button-primary">Record</button>                        
                    </div>
                </form>

            </div>

        );
    }
}

class Table extends Component {       
    constructor(props) {
        super(props);        
        this.state = {
        activePage: 1
        };
         
        this.handlePageChange = this.handlePageChange.bind(this)
      }
     
      handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        PubSub.publish('mudou-pagina', pageNumber);
      }
       
    render() {
        return (
          
            <div>
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th>ID</th> 
                            <th>Table Name</th>                           

                        </tr>
                    </thead>
                    <tbody>
                        {
                            
                         this.props.lista.map(function (lista) {
                                return (
                                    <tr key={lista.id}>    
                                    <td>{lista.id}</td>                      
                                    <td>{lista.nameTable}</td>  
                                                                    
                                    </tr>                                          
                                );                                
                            })
                         }
                    </tbody>
                   
                </table> 
                 
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={1}
                    totalItemsCount={this.props.totalPages}
                    pageRangeDisplayed={this.props.totalPages}
                    onChange={this.handlePageChange}
                />
                                    
                </div>   
        );
    }
   
}

export default class TableBox extends Component {
    constructor() {
        super();
     
        this.state = { lista: [], totalPages: 0 };
        this.getTables = this.getTables.bind(this);   
             
    }  

    getTables(pagina) {
        const page = (pagina - 1) || 0;
    
        fetch(`http://localhost:8080/tables?page=${page}`)
          .then((response) => response.json())
          .then((responseJson) => {
            
            this.setState({
              isLoading: false,
              lista: responseJson.content,
              totalPages: responseJson.totalPages   
                
            }, function(){           
               
            });
          })
          .catch((error) =>{
            console.error(error);
          });
    }
    
    componentDidMount() {
        this.getTables(0);
        PubSub.subscribe('atualiza-listagem-tables', function (topico, novaLista) {
            this.setState({ topico: novaLista });           
            this.getTables(0);  
           
        }.bind(this));
        
        PubSub.subscribe('mudou-pagina', function (topico, pagina) {
            this.getTables(pagina);  
        }.bind(this))
    }
    
       render() {
            /*console.log(this.state.lista)*/
            return (
    
                <div>
                    <div className="header">
                        <h1>Create table</h1>
                       
                    </div>
                   
                    <div className="content" id="content">
    
                        <FormularioTable />
                        <Table lista={this.state.lista} totalPages={this.state.totalPages} />                    
                         
                    </div>
                </div>
            );
        }
    }
    