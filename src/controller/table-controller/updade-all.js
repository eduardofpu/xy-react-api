import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../TratadorErros';


class FormularioTable extends Component {
    constructor(props) {
        super(props);
        this.state = {id:'', nameTable: '',parameters:''};        
        this.enviaForm = this.enviaForm.bind(this);        
    }

    enviaForm(evento) {
       evento.preventDefault();   
       
       const id = this.state.id;
       const getUrl = `http://localhost:8080/update/${id}`;   
       console.log("ID = ",getUrl);

        $.ajax({
            url: getUrl,
            contentType: 'application/json',
            dataType: 'json',
            type: 'put',           
            data: JSON.stringify({nameTable: this.state.nameTable, parameters: this.state.parameters.split(',') }),
            success: function (novaListagem) {
                //disparar um aviso geral de novalistagem disponivel
                PubSub.publish('atualiza-listagem-tables', novaListagem);                
                this.setState({ nameTable: '', id:'' })//limpa o formulario              
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

    salvaLista(nomeInput,evento){
        
        var campo={};
        campo[nomeInput]= evento.target.value; 
        this.setState(campo);   
    }
  
    render() {
        return (
            <div className="pure-form pure-form-aligned">

                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                       

                        <InputCustomizado id="nameTable" type="text"  name="nameTable"  
                        value={this.state.nameTable} required placeholder="Name" 
                        onChange={this.salvaAlteracao.bind(this,'nameTable')}                     
                        label="Table Name" />   

                        <InputCustomizado id="id" type="text"  name="id"  
                        value={this.state.id} required placeholder="Id" 
                        onChange={this.salvaAlteracao.bind(this,'id')}                     
                        label="ID" /> 

                         <InputCustomizado  id="parameters" type="parameters"  name="parameters"                      
                         value={this.state.parameters}  placeholder="ex: name,idade,..." 
                         onChange={this.salvaLista.bind(this,'parameters')}  
                         label="Parameters"/>   

                        <div className="pure-control-group">                                              
                        <label></label>
                                                                                 
                      
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Update</button>    
                    </div>
                </form>               

            </div>

        );
    }
}


export default class UpdateTableBox extends Component {
   

    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Update </h1>                   
                </div> 

                <div className="content" id="content">

                    <FormularioTable />
                    
                   
                </div>
            </div>
        );
    }
}


