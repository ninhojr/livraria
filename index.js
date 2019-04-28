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
    connection.query('SELECT * FROM adm', (err, rows) => {
        if (err) {
            console.log('Erro', err.message, err.stack);
        } else {
            const login = req.body.login;
            const senha = req.body.senha;
            rows.forEach(adm => {
                if (adm.login == login && adm.senha == senha) {
                    res.render(__dirname + '/src/view/cadastrar-livro.html');
                } else {
                    console.log('Usuário inexistente');
                }
            });
        }
    });

    let login = req.body.login;
    let senha = req.body.senha;
    if (login == 12345 && senha == 12345) {
        res.render(__dirname + '/src/view/cadastrar-livro.html');
    } else {
        console.log('Senha inválida!');
    }
});


app.listen(process.env.port || 3000);
console.log('Executando na porta 3000!');
