//criando minha pagina e exportando el
const Contato=require('../models/Contatomodel')

exports.index =async (req, res) => {
  const contato =await Contato.buscaContatos()
  
  
  res.render('index', {contato});
  };
  

  

