import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';


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
 

             </div>   
        );
    }
}


export default class AlterTableBox extends Component {
    constructor() {
        super();
        this.state = { lista: [] };
        this.getTables = this.getTables.bind(this)
    }  

getTables() {
    fetch('http://localhost:8080/tables')
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
                    <h1>Alter Table</h1>
                   
                </div>
               
                <div className="content" id="content">

                    <FormularioAlterTable />
                    <Table lista={this.state.lista} />
                   
                </div>
            </div>
        );
    }
}


