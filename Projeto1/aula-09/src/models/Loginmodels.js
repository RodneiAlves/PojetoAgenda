const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.erro = []
        this.use = null
    }


    async login(body) {  
        this.valida()
        if (this.erro.length > 0) return
        this.use = await LoginModel.findOne({ email: this.body.email })
         if(!this.use){
           this.erro.push('usuario Não existe')
         }
        if(!bcryptjs.compareSync(this.body.password , this.use.password)){
            this.erro.push('senha invalida')
            this.use=null
            return
        }
    }  
      async register() {
        this.valida()
        if (this.erro.length > 0) return
        await this.userExit();
        if (this.erro.length > 0) return
        //criptografando a senha 
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        //criando o usuario no BD
            this.use = await LoginModel.create(this.body)
      
    }
  //fazendo verificação se o email existe
    async userExit() {
         this.use = await LoginModel.findOne({ email: this.body.email })
        if (this.use) this.erro.push('erro usuario já existe')
    }
    //validando email e senha 
    valida() {
        this.cleanUp()
         //validando o email para ver se esta correto
        if (!validator.isEmail(this.body.email)) this.erro.push('erro email invalido ')
            // validando a senha
        if (this.body.password.length < 3 || this.body.password.length >= 50) {
            this.erro.push('senha tem que ter entre 3 e 50 caracteres  ')
        }
    }
      //validando se todos os campos são strings
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        // retornando so as chavesz com o valor de email e senha 
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}
module.exports = Login;