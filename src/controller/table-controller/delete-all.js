import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../../componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../../TratadorErros';


class FormularioTable extends Component {
    constructor(props) {
        super(props);
        this.state = { nameTable: ''};        
        this.enviaForm = this.enviaForm.bind(this);        
    }

    enviaForm(evento) {
       evento.preventDefault();   
       
       const name = this.state.nameTable;
       
       const getUrl = `http://localhost:8080/delete/${name}`;   

        $.ajax({
            url: getUrl,
            contentType: 'application/json',
            dataType: 'json',
            type: 'Delete',           
            data: JSON.stringify({nameTable: this.state.nameTable }),
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

                  
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Delete</button>  
                    </div>
                </form>
               
            </div>

        );
    }
}


export default class DeleteTableBox extends Component {
    

    render() {
        /*console.log(this.state.lista)*/
        return (

            <div>
                <div className="header">
                    <h1>Delete all </h1>                   
                </div> 

                <div className="content" id="content">

                    <FormularioTable />
                    
                </div>
            </div>
        );
    }
}


