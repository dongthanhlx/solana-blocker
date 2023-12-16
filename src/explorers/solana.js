const axios = require('axios')
const WebSocket = require('ws')
const config = require('../config')

let addresses = [];

function subscribe() {
    const ws = new WebSocket('wss://api.mainnet-beta.solana.com/')
    console.log('socket open');
    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'programSubscribe',
                params: [
                    "11111111111111111111111111111111",
                    {
                        "encoding": "jsonParsed",
                        "commitment": "confirmed"
                    }
                ],
            })
        )
    }

    ws.on('message', (evt) => {
        try {
            const buffer = evt.toString('utf8')

            const data = JSON.parse(buffer)

            if (!data || !data.params) {
                return;
            }

            let pubkey = data.params.result.value.pubkey.toLowerCase()

            if (pubkey && addresses.includes(pubkey)) {
                let slot = data.params.result.context.slot

                broadcast(slot, 30);
            }
        } catch (e) {
            console.log(e)
        }
    })
    
    ws.on('error', function() {
        console.log('socket error')
    })

    ws.on('close', function () {
        console.log('socket close');
        setTimeout(subscribe, 1000);
    })
}

async function getAddresses() {
    let res = await axios.post(config.get('BLOCKER_URL') + '/addresses/solana', { 'secret': config.get('BLOCKER_SECRET') });

    addresses = res.data;
}

function scheduleGetAddresses(seconds = 10) {
    getAddresses()
        .then(() => console.log(`Succeed get ${addresses.length} addresses solana.`))
        .catch((error) => {
            console.log('Failed to get addresses' + error.message)
        })

    setTimeout(() => scheduleGetAddresses(seconds), seconds * 1000)
}

function broadcast(block, afterSeconds = 10) {
    setTimeout(() => {
        try {
            axios.post(config.get('BLOCKER_URL') + '/transactions/solana', { block })
    
            console.log('Succeed broadcast block ' + block)
        } catch (e) {
            console.error(e);
        }
    }, afterSeconds * 1000)
    
}

module.exports = { subscribe, scheduleGetAddresses, broadcast }