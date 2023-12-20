const axios = require('axios')
const WebSocket = require('ws')
const config = require('../config')

let addresses = [];

function subscribe() {
    const ws = new WebSocket('wss://api.mainnet-beta.solana.com/')
    console.log('spl token socket open');
    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'programSubscribe',
                params: [
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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

                broadcast(slot, 60);
            }
        } catch (e) {
            console.log(e)
        }
    })
    
    ws.on('error', function() {
        console.log('spl token socket error')
    })

    ws.on('close', function () {
        console.log('spl token socket close');
        setTimeout(subscribe, 1000);
    })
}

async function getAddresses() {
    let res1 = await axios.post(config.get('BLOCKER_URL') + '/addresses/usdts', { 'secret': config.get('BLOCKER_SECRET') });
    let res2 = await axios.post(config.get('BLOCKER_URL') + '/addresses/usdcs', { 'secret': config.get('BLOCKER_SECRET') });

    let usdts = res1.data;
    let usdcs = res2.data;

    addresses = usdts.concat(usdcs);
}

function scheduleGetAddresses(seconds = 10) {
    getAddresses()
        .then(() => console.log(`Succeed get ${addresses.length} addresses spl tokens.`))
        .catch((error) => {
            console.log('Failed to get addresses spl tokens: ' + error.message)
        })

    setTimeout(() => scheduleGetAddresses(seconds), seconds * 1000)
}

function broadcast(block, afterSeconds = 10) {
    setTimeout(() => {
        try {
            axios.post(config.get('BLOCKER_URL') + '/transactions/solana', { block, type: 'token_transfer' })
    
            console.log('Succeed broadcast spl token block ' + block)
        } catch (e) {
            console.error(e);
        }
    }, afterSeconds * 1000)
    
}

module.exports = { subscribe, scheduleGetAddresses, broadcast }