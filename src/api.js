const solEx = require('./explorers/sol')
const solAddress = require('./builders/address/sol')
const nearAddress = require('./builders/address/near')
const splToken = require('./builders/address/spl-token')
const solTx = require('./builders/tx/sol')
const tonTx = require('./builders/tx/ton')
const usdtonBuilder = require('./builders/tx/usdton')
const splTokenTx = require('./builders/tx/spl-token')
const nearTx = require('./builders/tx/near')
const utils = require('./utils/index')
const {success, fail} = require('./response');

module.exports = {
    make: async (req, res) => {
        try {
            let currency = req.body.currency.toUpperCase();
            let address = '';

            if (currency === 'SOL') {
                address = solAddress.render();
            } else if (currency === 'NEAR') {
                address = nearAddress.render();
            } else {
                address = await splToken.render(req.body)
            }

            success(res, address);
        } catch (e) {
            fail(res, e.message)
        }
    },

    send: async (req, res) => {
        try {
            let currency = req.body.currency.toUpperCase();
            let tx = '';

            if (currency === 'SOL') {
                tx = await solTx.build(req.body)
            } else if (currency === 'TON') {
                tx = await tonTx.build(req.body)
            } else if (currency === 'USDTON') {
                tx = await usdtonBuilder.build(req.body)
            } else if (currency === 'NEAR') {
                tx = await nearTx.build(req.body)
            } else {
                tx = await splTokenTx.build(req.body)
            }

            success(res, tx);
        } catch (e) {
            fail(res, e.message)
        }
    },

    mustSol: (req, res) => {
        let address = req.params.address;

        success(res, {result: solAddress.mustSol(address)})
    },

    multichain: async (req, res) => {
        let {blockchain, from, to} = req.body

        if (!['near', 'arbitrum'].includes(blockchain.toLowerCase())) {
            return fail(res, 'not_supported')
        }

        success(res, {
            result: await utils[blockchain.toLowerCase()].multichain(from, to)
        })
    },

    ping: (req, res) => {
        success(res, 'pong');
    }
}