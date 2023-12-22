const solEx = require('./explorers/sol')
const solAddress = require('./builders/address/sol')
const splToken = require('./builders/address/spl-token')
const solTx = require('./builders/tx/sol')
const splTokenTx = require('./builders/tx/spl-token')
const {success, fail} = require('./response');

module.exports = {
    make: async (req, res) => {
        try {
            let currency = req.body.currency.toUpperCase();
            let address = '';

            if (currency === 'SOL') {
                address = solAddress.render();
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

    ping: (req, res) => {
        success(res, 'pong');
    }
}