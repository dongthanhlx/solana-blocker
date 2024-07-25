const express = require('express')
const bodyParser = require('body-parser');
const solExplorer = require('./explorers/sol');
const splTokenExplorer = require('./explorers/spl-token');
const config = require('./config')
const api = require('./api');


const app = express();
app.use(bodyParser.json());

solExplorer.scheduleGetAddresses();
solExplorer.subscribe();

splTokenExplorer.scheduleGetAddresses();
splTokenExplorer.subscribe();

app.get('/ping', api.ping);
app.post('/addresses', api.make)
app.post('/transactions', api.send)
app.get('/addresses/:address/sol', api.mustSol)
app.post('/multichain', api.multichain)

app.listen(config.get('APP_PORT'), () => console.log(`App listening on appPort ${config.get('APP_PORT')}!`));
