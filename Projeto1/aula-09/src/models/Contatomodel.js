const mongoose=require('mongoose')
const validator=require('validator');
const { ConcatenationScope } = require('webpack');
const ContatoSchema = new mongoose.Schema({
    nome: {  type: String ,required: true, default:''},
    sobrenome:{type: String ,required: false, default:''},
   email: {  type: String ,required: false, default:''},
    telefone: {  type: String ,required: false, default:''},
    criadoEm: {  type: Date ,default: Date.now},

})

const ContatoModel=mongoose.model('Contato',ContatoSchema)
 

function Contato(body){
    this.body=body;
    this.erro=[];
    this.contato=null;
}


Contato.prototype.register= async function(){
 this.valida();
if(this.erro.length>0) return;

this.contato= await ContatoModel.create(this.body);

}

Contato.prototype.valida=function(){
        this.cleanUp()
         //validando o email para ver se esta correto
    if (this.body.email && !validator.isEmail(this.body.email)){
        this.erro.push('erro email invalido ');
    } 
        if(!this.body.nome){
            this.erro.push('nome é obrigatorio')
        } 
        if(!this.body.email && !this.body.telefone){
            this.erro.push('tem que enviar o campo nome é email')
        }
            
          

    }
      //validando se todos os campos são strings
      Contato.prototype.cleanUp=function() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        // retornando so as chavesz com o valor de email e senha 
        this.body = {
           nome: this.body.nome,
           sobrenome: this.body.sobrenome,
           email: this.body.email,
           telefone: this.body.telefone,
        };
    }

Contato.prototype.edit =async function(id){
    if(typeof id !=="string") return
this.valida()
if(this.erro.length>0)return;
this.contato= await ContatoModel.findByIdAndUpdate(id,this.body,{new: true})
}
// metodo staticos 
Contato.buscaPorId = async function(id){
    if(typeof id !=="string") return
const contato = await ContatoModel.findById(id)
return contato
}

Contato.buscaContatos = async function(){ 
const contatos = await ContatoModel.find()
.sort({criadoEm: -1})
return contatos
}

Contato.delete = async function(id){ 
    if(typeof id !=='string') return
    const contato = await ContatoModel.findOneAndDelete({_id: id})
    return contato
    }



module.exports=Contato