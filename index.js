const express = require('express');
const app = express();
const path = require('path');
__dirname() = path.resolve();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));

app.engine('html', require('ejs').renderFile);

app.get('/', (res, req) => {
    res.render(__dirname + '/src/view/index.html');
});

app.listen(process.env.port || 3000);
console.log('Executando na porta 3000!');
