import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../TratadorErros';

class FormularioAlterTable extends Component {
    constructor(props) {
        super(props)   
        
        this.state = {nameTable: '', parameters:''};   
        this.enviaForm = this.enviaForm.bind(this);      
    }    

    enviaForm(evento) {         
        evento.preventDefault();
        console.log(this.state.parameters.split(',')); 
        $.ajax({
            url: "http://localhost:8080/insert/table",   
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',           
           
            data: JSON.stringify({nameTable: this.state.nameTable, parameters: this.state.parameters.split(',') }),
           
            success: function (novaListagem) {
                var listar = novaListagem.parameters;
                console.log("parameters: ",listar)               
                //disparar um aviso geral de novalistagem disponivel
                PubSub.publish('atualiza-listagem-tables', novaListagem);
                this.setState({ nameTable: '', parameters: '' })//limpa o formulario 

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
        campo[nomeInput]= evento.target.value;           
        this.setState(campo);    
    }

    salvaLista(nomeInput,evento){
        
        var campo={};
        campo[nomeInput]= evento.target.value; 
        this.setState(campo);   
    }
   
     adicionar() {        

        var p = document.getElementById("parameters").value;
        var lista  = document.getElementById("lista").innerHTML;
        lista = lista +"<li>"+p.concat("   Salvo com sucesso!!")+"</li>";  
        document.getElementById("lista").innerHTML = lista;
        event.preventDefault();
      }
           
    
    render() {
       
        return (

            <div className="pure-form pure-form-aligned">

                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">

                        <InputCustomizado id="nameTable" type="text"  name="nameTable"  
                        value={this.state.nameTable} required placeholder="Name" 
                        onChange={this.salvaAlteracao.bind(this,'nameTable')}                     
                        label="Table Name" />   

                         <InputCustomizado  id="parameters" type="parameters"  name="parameters"                      
                         value={this.state.parameters}  placeholder="ex: name,idade,..." 
                         onChange={this.salvaLista.bind(this,'parameters')}  
                         label="Parameters"/>   

                        <div className="pure-control-group">                                              
                        <label></label>
                                <button  onClick={this.adicionar} className="pure-button pure-button-primary">Record</button>
                                <ul id="lista"></ul>                                                    
                      
                        
                    </div>
                </form>               

            </div>

        );
    }      
}


export default class InsertIntoBox extends Component {     


    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Insert Into</h1>
                   
                </div>
               
                <div className="content" id="content">
                    <FormularioAlterTable />                   
                                    
                </div>
            </div>
        );
    }
}


