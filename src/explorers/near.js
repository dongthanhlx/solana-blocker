const axios = require('axios')

async function getTransactionsByBlock(block) {
    let transactions = [];
    let shard = 0;

    do {
        try {
            const body = {
                'jsonrpc': '2.0',
                'method': 'chunk',
                'params': {
                    'block_id': block,
                    'shard_id': shard
                },
                'id': Date.now()
            }

            let {data} = await axios.post(
                // 'https://rpc.ankr.com/near/0b0b99eee34ea3c2ab0132f62e87e8ed05d5ffec286f41d88ba87117fcea6e9d',
                'https://rpc.mainnet.near.org',
                JSON.stringify(body),
                {'Content-Type': 'application/json'}
            );

            if (data.error) {
                return transactions;
            }

            transactions = transactions.concat(data.result.transactions);
            shard++;
        } catch (e) {
            return transactions;
        }
    } while (true)

    return transactions;
}

async function multichain(from, to) {
    let callbacks = [];

    while (from <= to) {
        callbacks.push(
            new Promise((resolve, reject) => {
                resolve(getTransactionsByBlock(from))
            })
        )

        from++;
    }

    let res = await Promise.all(callbacks).then(transactions => {
        return transactions;
    }).catch(e => {
        console.error(e)
    })

    return res.flat();
}

module.exports = {multichain}