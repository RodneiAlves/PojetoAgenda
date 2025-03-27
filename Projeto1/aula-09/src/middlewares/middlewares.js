exports.middlewareGlobal = (req, res, next) => {
    res.locals.erro = req.flash('erro');
    res.locals.success = req.flash('success');
    res.locals.use=req.session.use;
    next();
  };
 

  exports.checkcsrfError=(err,req,res,next)=>{
    if(err){
      return res.render('404')
    }
    next()
   
  }
  exports.csrfMiddleware=(req,res,next)=>{
    res.locals.csrfToken=req.csrfToken();
  next()
  }
exports.loginRequired=(req,res,next)=>{
  if(!req.session.use){
    req.flash('erro','você precisa fazer login')
    req.session.save(()=>res.redirect('/'))
     return  
  }
  next()
}
  