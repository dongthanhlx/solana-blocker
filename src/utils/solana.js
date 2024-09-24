const axios = require('axios')

async function getTransactionsByBlock(block) {
    try {
        const body = {
            'jsonrpc': '2.0',
            'method': 'getBlock',
            'params': [
                block,
                {
                    "encoding": "jsonParsed",
                    "maxSupportedTransactionVersion":0,
                    "transactionDetails":"full",
                    "rewards":false
                }
            ],
            'id': Date.now()
        }

        let {data} = await axios.post(
            // 'https://api.mainnet-beta.solana.com',
            'https://rpc.ankr.com/solana/0b0b99eee34ea3c2ab0132f62e87e8ed05d5ffec286f41d88ba87117fcea6e9d',
            body,
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