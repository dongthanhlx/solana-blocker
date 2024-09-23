const axios = require('axios')

async function getTransactionsByBlock(block) {
    try {
        const body = {
            'jsonrpc': '2.0',
            'method': 'eth_getBlockByNumber',
            'params': [
                '0x' + block.toString(16),
                true
            ],
            'id': Date.now()
        }

        let {data} = await axios.post(
            'https://rpc.ankr.com/arbitrum/fe71c27356a2479c811fa64052c5a817caf1739ea872a42d82d6b8ad7d6e0289',
            JSON.stringify(body),
            {'Content-Type': 'application/json'}
        );

        return data.result.transactions
    } catch (e) {
        console.error(e)
    }

    return [];
}

async function multichain(from, to) {
    let callbacks = [];
    let block = from;

    while (block <= to) {
        callbacks.push(
            new Promise((resolve, reject) => {
                resolve(getTransactionsByBlock(block))
            })
        )

        block++;
    }

    let res = await Promise.all(callbacks).then(transactions => {
        return transactions;
    }).catch(e => {
        console.error(e)
    })

    return res.flat();
}

module.exports = {multichain}