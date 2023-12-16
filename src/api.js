const solanaEx = require('./explorers/solana')
const builderAddress = require('./builders/address/solana')
const builderTx = require('./builders/tx/solana')
const {success, fail} = require('./response');

module.exports = {
    getTransactionsByBlocks: async(req, res) => {
        let {from, to} = req.body;

        try {
            let transactions = await solanaEx.getBlocks(from, to);

            success(res, transactions)
        } catch (e) {
            fail(res, e);
            console.log(e);
        }
    },

    make: async (req, res) => {
        try {
            let addressInfo = await builderAddress.render();

            success(res, addressInfo);
        } catch (e) {
            fail(res, e.message)
        }
    },

    send: async (req, res) => {
        let {amount, sendTo, fromKey} = req.body;

        try {
            let tx = await builderTx.build(amount, sendTo, fromKey)

            success(res, tx);
        } catch (e) {
            fail(res, e.message)
        }
    },

    ping: (req, res) => {
        success(res, 'pong');
    }
}