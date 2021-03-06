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
    connection.query('SELECT * FROM livro', (err, rows, fields) => {
        if (err) {
            console.log(err.message, err.stack);
        } else {
            res.render(__dirname + '/src/view/index.html', {livros:rows});
        }
    });
});

app.get('/login', (req, res) => {
    res.render(__dirname + '/src/view/login-adm.html');
});

app.post('/login', (req, res) => {
    connection.query('SELECT * FROM adm', (err, rows) => {
        if (err) {
            console.log('Erro', err.message, err.stack);
        } else {
            const login = req.body.login;
            const senha = req.body.senha;
            rows.forEach(adm => {
                if (adm.login == login && adm.senha == senha) {
                    res.render(__dirname + '/src/view/gerenciar-livro.html');
                } else {
                    console.log('Usuário inexistente');
                }
            });
        }
    });
});

app.get('/gerenciar', (req, res) => {
    connection.query('SELECT * FROM livro', (err, rows, fields) => {
        if (err) {
            console.log(err.message, err.stack);
        } else {
            res.render(__dirname + '/src/view/gerenciar-livro.html', {livros:rows});
        }
    });
});

app.post('/gerenciar', (req, res) => {
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let edicao = req.body.edicao;
    let editora = req.body.editora;
    let descricao = req.body.descricao;

    const livro = {'titulo':titulo, 'autor':autor, 'edicao':edicao, 'editora':editora, 'descricao': descricao};
    
    connection.query('INSERT INTO livro SET ?', livro, (err, res) => {
        if (err) {
            console.log(err.message, err.stack);
        } else {
            msg = 'Livro cadastrado com sucesso!';
            console.log('Inserido', res.insertId);
        }
    });
    res.redirect('/gerenciar');
});

app.get('/editar/:id', (req, res) => {
    let id = req.params.id
    connection.query('SELECT * FROM livro WHERE id = ?', [id], (err, rows, fields) => {
        if (err) {
            console.log(err.message, err.stack);
        } else {
            console.log('rows[0]', rows[0]);
            res.render(__dirname + '/src/view/editar-livro.html', {livro:rows[0]});
        }
    });
});

app.post('/editar/:id', (req, res) => {
    let id = req.params.id;
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let edicao = req.body.edicao;
    let editora = req.body.editora;
    let descricao = req.body.descricao;


    connection.query('UPDATE livro SET titulo = ?, autor = ?, edicao = ?, editora = ?, descricao = ? WHERE id = ?', [titulo, autor, edicao, editora, descricao, id], (err, result) => {
        if (err) 
            throw err;
        
        console.log('Alterado');
        console.log(id);
    });

    res.redirect('/gerenciar');
});

app.get('/excluir/:id', (req, res) => {
    let id = req.params.id;

    connection.query('DELETE FROM livro WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err.message, err.stack);
        } else {
            console.log('Excluído');
        }
    });
    
    res.redirect('/gerenciar');
});

app.listen(process.env.port || 3000);
console.log('Executando na porta 3000!');
