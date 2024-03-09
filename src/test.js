
const { PublicKey, Connection } = require('@solana/web3.js')
const address = require('./builders/address/sol')
const token = require('./builders/address/spl-token')
const sendToken = require('./builders/tx/spl-token');
const builder = require('./builders/tx/sol')
const ex = require('./explorers/spl-token')
const exToken = require('./explorers/spl-token')
const WebSocket = require('ws')
const config = require('./config')
const {OneID} = require('@oneid-xyz/inspect')
// import {OneID} from '@oneid-xyz/inspect'
const oneId = new OneID();

async function run() {
    // await oneId.systemConfig.initConfig()
    // let res = await oneId.getWalletsByID('oneidtest.c98')

    // console.log(res)

    // ex.broadcast(185625854)

}

run()


