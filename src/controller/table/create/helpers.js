import { METOD_POST } from '../../../core/metohd-post'
import { METOD_ACCEPT } from '../../../core/metohd-post'
import { METOD_CONTENT_TYPE } from '../../../core/metohd-post'
import PubSub from 'pubsub-js';

export default class Call {
     
   butonSave(nomeInput,evento){
        evento.preventDefault();
        var campo={};
        campo[nomeInput]=evento.target.value;
        this.setState(campo);    
    }

    urlCallbackPost (url, stringiFy, setState, name){
        fetch(url, {
            method: METOD_POST,
            headers: {
              'Accept': METOD_ACCEPT,
              'Content-Type': METOD_CONTENT_TYPE
            },
            body: stringiFy,   

            })  
            .then(res=>res.json())
            .then(res => console.log(res))  
            .then(function () { 

                PubSub.publish('atualiza-listagem-tables');                
                setState({ nameTable: '' })//limpa o formulario  
                alert("Salvo com sucesso! " +name);                                          
            },     
            
            ).catch (function (error) {
                console.log('Request failed', error);
                alert(error);
            })          
    }
}