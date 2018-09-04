import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../../TratadorErros';


class FormularioTable extends Component {
    constructor() {
        super();
        this.state = { nameTable: ''};        
        this.enviaForm = this.enviaForm.bind(this);        
    }

    enviaForm(evento) {
       evento.preventDefault();   
      
       const name = this.state.nameTable;
       const getUrl = `http://localhost:8080/${name}`;   

        $.ajax({
            url: getUrl,
            contentType: 'application/json',
            dataType: 'json',
            type: 'get',           
           
            success: function (novaListagem) {
                //disparar um aviso geral de novalistagem disponivel
                PubSub.publish('atualiza-listagem-tables', novaListagem);                
                this.setState({ nameTable: '' })//limpa o formulario              
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
                  
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Search</button>
                    </div>
                </form>
               
            </div>

        );
    }
}

class Table extends Component {      
    
    render() {
        console.log(this.props.lista); 
        
        return (
          
            <div>
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th>ID</th> 
                            <th>Name Column</th>  
                            <th>Data Type</th>     
                            <th>Table name</th>                           

                        </tr>
                    </thead>
                    <tbody>
                        {
                            
                            this.props.lista &&  this.props.lista.map(function (u) {
                           
                                return (
                                   
                                    <tr key={u.id}>    
                                    <td>{u.id}</td>                      
                                    <td>{u.nameColumn}</td>   
                                    <td>{u.dataType}</td>  
                                    <td>{u.idTable.nameTable}</td>                                        
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

export default class BayTableBox extends Component {
    constructor() {
        super();
        this.state = { lista: [] };
       
    }  

componentDidMount() {      
    PubSub.subscribe('atualiza-listagem-tables', function (topico, novaLista) {
        this.setState({ lista: novaLista });        
    }.bind(this))
}

    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Table attributes </h1>                   
                </div> 

                <div className="content" id="content">

                    <FormularioTable />
                    <Table lista={this.state.lista} />
                   
                </div>
            </div>
        );
    }
}


