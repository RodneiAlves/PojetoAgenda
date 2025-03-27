const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONEXAO, {
  useNewUrlParser: true,
  useUnifiedTopology: true ,

})
  .then(() => {
    app.emit('pronto');
  })
  .catch((e) => {
    console.error('Erro ao se conectar ao MongoDB:', e);
  });

// Importando middlewares
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const router = require('./router');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {middlewareGlobal, checkcsrfError, csrfMiddleware} = require('./src/middlewares/middlewares');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
      ],
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "'unsafe-inline'",
      ],
      imgSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "data:",  // Permite imagens inline
      ],
    },
  })
);



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Configuração da sessão com MongoDB
const sessionOptions = session({
  secret: 'aula-9',
  store: new MongoStore({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Middleware do CSRF
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkcsrfError);
app.use(csrfMiddleware);

app.use(router);

// Esperando a conexão com o MongoDB para iniciar o servidor
app.on('pronto', () => {
  console.log('Conectei na BD');
  app.listen(3333, () => {
    console.log('Servidor executando na porta 3333');
    console.log('http://localhost:3333');
  });
});
