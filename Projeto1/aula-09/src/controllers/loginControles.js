
const Login = require('../models/Loginmodels')

exports.index=(req,res)=>{
    if(req.session.use) return res.render('login-logado')
    res.render('login')
}
//exportação de register para router register
exports.Register = async function (req,res){
    try{
    const login=new Login(req.body)
   await login.register() ;  
  
   if(login.erro.length>0){
    req.flash('erro',login.erro)
    req.session.save(function(){
        return res.redirect('/login/index')
    })
    return
   }
   req.flash('success','usuario criado com sucesso')
    req.session.save(function(){
        return res.redirect('/login/index')
    })
}catch(e){
    console.log(e)
   return res.render('404')
}
}
// exportação do login para a router
exports.login=async (req,res,next)=>{
    try{
        const login=new Login(req.body)
       await login.login() ;  
      
       if(login.erro.length>0){
        req.flash('erro',login.erro)
        req.session.save(function(){
            return res.redirect('/login/index')
        })
        return
       }

       
       req.flash('success','Você esta logado')
       req.session.use=login.use
        req.session.save(function(){
            return res.redirect('/login/index')
        })
    }catch(e){
        console.log(e)
       return res.render('404')
    }
    };
    exports.logout=function(req,res,next){
        req.session.destroy()
        res.redirect('/')
    }
  