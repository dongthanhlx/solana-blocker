const splToken = require('@solana/spl-token');
const web3 = require('@solana/web3.js')
const bs58 = require('bs58');
const splTokenBuilder = require('../address/spl-token');
const config = require('../../config')
const connection = new web3.Connection(config.get('SOLANA_RPC'), 'confirmed')

module.exports = {
    async build({currency, amount, sendTo, fromKey}) {
        const sender = web3.Keypair.fromSecretKey(bs58.decode(fromKey))
        
        const fromAddress = await splTokenBuilder.render({
            ownerAddress: sender.publicKey,
            currency,
            secret: fromKey
        })
        
        const toAddress = await splTokenBuilder.render({
            ownerAddress: sendTo,
            currency,
            secret: fromKey
        })
        
        return await splToken.transfer(
            connection,
            sender,
            fromAddress.address,
            toAddress.address,
            sender.publicKey,
            amount * web3.LAMPORTS_PER_SOL / 1000
        )
    }
}

