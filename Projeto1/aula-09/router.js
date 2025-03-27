const express =require('express');
const router= express.Router()
const homeInicial =require('./src/controllers/homeControllers')
const loginControles =require('./src/controllers/loginControles')
const contatoControles =require('./src/controllers/contatoControles')
const {loginRequired}=require('./src/middlewares/middlewares')
//iniciandop mnha rota home
router.get('/',homeInicial.index);
router.get('/login/index',loginControles.index)
router.post('/login/register',loginControles.Register)
router.post('/login/login',loginControles.login)
router.get('/login/logout',loginControles.logout)

//rota contato
router.get('/contato/index',loginRequired,contatoControles.index)
router.post('/contato/register',loginRequired,contatoControles.register)
router.get('/contato/index/:id',loginRequired,contatoControles.editIndex)
router.post('/contato/edit/:id',loginRequired,contatoControles.edit)
router.get('/contato/delete/:id',loginRequired,contatoControles.delete)

module.exports= router