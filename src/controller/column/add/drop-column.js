import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../../componentes/InputCustomizado';
import TratadorErros from '../../../TratadorErros';
import PubSub from 'pubsub-js';
import Pagination from "react-js-pagination";
import "bootstrap/less/bootstrap.less";


class FormularioColumn extends Component {
    constructor() {
        super();
        this.state = { nameTable: '', nameColumn: ''};
        this.enviaForm = this.enviaForm.bind(this);       
        
    }
    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/drop/column",   
            contentType: 'application/json',
            dataType: 'json',
            type: 'Delete',          

            data: JSON.stringify({ nameTable: this.state.nameTable, nameColumn: this.state.nameColumn }),
            complete: function(novaListagem){
                PubSub.publish('atualiza-listagem-tables', novaListagem);
                this.setState({ nameTable: '', nameColumn: '' })//limpa o formulario    
            }.bind(this),
            
            error: function (resposta) {

                if (resposta.status === 400) {

                    console.log(resposta.responseJSON);
                    new TratadorErros().publicaErros(resposta.responseJSON);
                   
                }
            },
           
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            }
        });
    }

    salvaAlteracao(nomeInput,evento){
        var campo={};
        campo[nomeInput]=evento.target.value;
        this.setState(campo);

    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                    <InputCustomizado id="nameTable" type="text"  name="nameTable"  value={this.state.nameTable} required placeholder="Name" 
                    onChange={this.salvaAlteracao.bind(this,'nameTable')} label="Table Name" />

                    <InputCustomizado id="nameColumn" type="text"  name="nameColumn"  value={this.state.nameColumn} required placeholder="Column" 
                    onChange={this.salvaAlteracao.bind(this,'nameColumn')} label="Column Name" />
   
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
                            <th>Coolumn Name</th>  
                            <th>Data Type Name</th> 
                            <th>Id Table</th>   
                            <th>Name Table</th>                         

                        </tr>
                    </thead>
                    <tbody>
                        {
                            
                         this.props.lista.map(function (lista) {
                                return (
                                    <tr key={lista.id}>    
                                    <td>{lista.id}</td> 
                                    <td>{lista.nameColumn}</td>   
                                    <td>{lista.dataType}</td> 
                                    <td>{lista.idTable.id}</td>   
                                    <td>{lista.idTable.nameTable}</td>                                       
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

export default class DropColumnBox extends Component {
    constructor() {
        super();
        this.state = { lista: [], totalPages: 0 };
        this.getTables = this.getTables.bind(this)
    }  

getTables(pagina) {
    const page = (pagina - 1) || 0;

    fetch(`http://localhost:8080/columns?page=${page}`)
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
    this.getTables(this);

    PubSub.subscribe('atualiza-listagem-tables', function (topico, novaLista) {
        this.setState({ topico: novaLista });
        this.getTables(this);
    }.bind(this))

    PubSub.subscribe('mudou-pagina', function (topico, pagina) {
        this.setState({ topico: pagina });
        this.getTables(pagina);  
    }.bind(this))
}


    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Drop Column</h1>
                   
                </div>
               
                <div className="content" id="content">

                    <FormularioColumn />
                    <Table lista={this.state.lista} totalPages={this.state.totalPages}/>
                   
                </div>
            </div>
        );
    }
}


