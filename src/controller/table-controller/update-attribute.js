import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../TratadorErros';


class FormularioTable extends Component {
    constructor(props) {
        super(props);
        this.state = { nameTable: '', parameter:'', attribute:'', id:''};        
        this.enviaForm = this.enviaForm.bind(this);        
    }

    enviaForm(evento) {
       evento.preventDefault();   
       
       
       const getUrl = `http://localhost:8080/update`;   

        $.ajax({
            url: getUrl,
            contentType: 'application/json',
            dataType: 'json',
            type: 'put',           
            data: JSON.stringify({ nameTable: this.state.nameTable, parameter:this.state.parameter, attribute:this.state.attribute , id: this.state.id}),
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


    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                   
                    <InputCustomizado id="nameTable" type="text"  name="nameTable"  value={this.state.nameTable} required placeholder="Name" 
                    onChange={this.salvaAlteracao.bind(this,'nameTable')} label="Table Name" />

                    <InputCustomizado id="parameter" type="text"  name="parameter"  value={this.state.parameter} required placeholder="Parameter" 
                    onChange={this.salvaAlteracao.bind(this,'parameter')} label="Parameter" />

                    <InputCustomizado id="attribute" type="text"  name="attribute"  value={this.state.attribute} required placeholder="Attribute" 
                    onChange={this.salvaAlteracao.bind(this,'attribute')} label="Attribute" />

                     <InputCustomizado id="id" type="text"  name="id"  value={this.state.id} required placeholder="Id" 
                    onChange={this.salvaAlteracao.bind(this,'id')} label="ID" />
                  
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Update</button>   
                    </div>
                </form>
               
            </div>

        );
    }
}


export default class UpdateTableIdBox extends Component {
    


    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Update Id </h1>                   
                </div> 

                <div className="content" id="content">

                    <FormularioTable />  
                   
                </div>
            </div>
        );
    }
}


