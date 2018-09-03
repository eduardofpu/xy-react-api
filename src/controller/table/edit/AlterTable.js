import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../../TratadorErros';
import Pagination from "react-js-pagination";
import "bootstrap/less/bootstrap.less";


class FormularioAlterTable extends Component {
    constructor() {
        super();
        this.state = { nameCurrent: '', nameModified: ''};
        this.enviaForm = this.enviaForm.bind(this);
        
    }
    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/alter/table",   
            contentType: 'application/json',
            dataType: 'json',
            type: 'put',           

            data: JSON.stringify({ nameCurrent: this.state.nameCurrent, nameModified: this.state.nameModified }),
            success: function (novaListagem) {
                //disparar um aviso geral de novalistagem disponivel
                PubSub.publish('atualiza-listagem-tables', novaListagem);
                this.setState({ nameCurrent: '', nameModified: '' })//limpa o formulario              
            }.bind(this),
            error: function (resposta) {

                if (resposta.status === 400) {

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

                    <InputCustomizado id="nameCurrent" type="text"  name="nameCurrent"  value={this.state.nameCurrent} required placeholder="Current" 
                    onChange={this.salvaAlteracao.bind(this,'nameCurrent')} label="Current Name" />

                    <InputCustomizado id="nameModified" type="text"  name="nameModified"  value={this.state.nameModified} required placeholder="Modified" 
                    onChange={this.salvaAlteracao.bind(this,'nameModified')} label="Modified Name" />

                    
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Change</button>
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


export default class AlterTableBox extends Component {
    constructor() {
        super();
        this.state = { lista: [],  totalPages: 0  };
        this.getTables = this.getTables.bind(this)
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
    }.bind(this))

    PubSub.subscribe('mudou-pagina', function (topico, pagina) {
        this.getTables(pagina);  
    }.bind(this))
}


    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Alter Table</h1>
                   
                </div>
               
                <div className="content" id="content">

                    <FormularioAlterTable />
                    <Table lista={this.state.lista } totalPages={this.state.totalPages} />
                   
                </div>
            </div>
        );
    }
}


