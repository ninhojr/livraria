const express = require('express');
const app = express();
const path = require('path');
__dirname = path.resolve();
var bodyParser = require('body-parser');


const mysql = require('mysql');
var sha1 = require('sha1');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'livraria',
    port: '3306'
});

app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(__dirname + '/'));

app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render(__dirname + '/src/view/index.html');
});

app.get('/login', (req, res) => {
    res.render(__dirname + '/src/view/login-adm.html');
});

app.get('/cadastrar', (req, res) => {
    res.render(__dirname + '/src/view/cadastrar-livro.html');
})

app.post('/cadastrar', (req, res) => {
    let login = req.body.login;
    let senha = req.body.senha;
    if (login == 12345 && senha == 12345) {
        res.render(__dirname + '/src/view/cadastrar-livro.html');
        console.log('senha certa');
    } else {
        console.log('Senha inválida!');
    }
});


app.listen(process.env.port || 3000);
console.log('Executando na porta 3000!');
