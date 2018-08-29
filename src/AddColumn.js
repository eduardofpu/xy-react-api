import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';


class FormularioColumn extends Component {
    constructor() {
        super();
        this.state = { nameTable: '', nameColumn: '', dataType: ''};
        this.enviaForm = this.enviaForm.bind(this);
        
    }
    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://localhost:8080/add/column",   
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',           

            data: JSON.stringify({ nameTable: this.state.nameTable, nameColumn: this.state.nameColumn, dataType: this.state.dataType }),
            success: function (novaListagem) {
                //disparar um aviso geral de novalistagem disponivel
                PubSub.publish('atualiza-listagem-tables', novaListagem);
                this.setState({ nameTable: '', nameColumn: '', dataType: '' })//limpa o formulario              
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

                    <InputCustomizado id="nameTable" type="text"  name="nameTable"  value={this.state.nameTable} required placeholder="Name" 
                    onChange={this.salvaAlteracao.bind(this,'nameTable')} label="Table Name" />

                    <InputCustomizado id="nameColumn" type="text"  name="nameColumn"  value={this.state.nameColumn} required placeholder="Column" 
                    onChange={this.salvaAlteracao.bind(this,'nameColumn')} label="Column Name" />

                    <InputCustomizado id="dataType" type="text"  name="dataType"  value={this.state.dataType} required placeholder="Type" 
                    onChange={this.salvaAlteracao.bind(this,'dataType')} label="Data Type Name" />
                    
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Record</button>
                    </div>
                </form>

            </div>

        );
    }
}



class AddColumnTable extends Component {      
      
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
                
             </div>  
             
        );
    }
}

export default class AddColumnBox extends Component {
    constructor() {
        super();
        this.state = { lista: [] };
        this.getTables = this.getTables.bind(this)
    }  

getTables() {
    fetch('http://localhost:8080/columns')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          lista: responseJson.content,
        }, function(){
           
        });
      })
      .catch((error) =>{
        console.error(error);
      });
}

componentDidMount() {
    this.getTables();

    PubSub.subscribe('atualiza-listagem-tables', function () {
        this.getTables();
    }.bind(this))
}


    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Add column</h1>
                   
                </div>
               
                <div className="content" id="content">

                    <FormularioColumn />
                    <AddColumnTable lista={this.state.lista} />
                   
                </div>
            </div>
        );
    }
}


