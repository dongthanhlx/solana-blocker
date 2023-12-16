const express = require('express')
const bodyParser = require('body-parser');
const explorer = require('./explorers/solana');
const config = require('./config')
const api = require('./api');


const app = express();
app.use(bodyParser.json());

explorer.scheduleGetAddresses();
explorer.subscribe();

app.get('/ping', api.ping);
app.post('/addresses', api.make)
app.post('/transactions', api.send)

app.listen(config.get('APP_PORT'), () => console.log(`App listening on appPort ${config.get('APP_PORT')}!`));
