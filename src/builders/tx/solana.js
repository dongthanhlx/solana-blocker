const web3 = require('@solana/web3.js')
const bs58 = require('bs58')
const config = require('./../../config')
const connection = new web3.Connection(config.get('SOLANA_RPC'), 'confirmed')

module.exports = {
    async build(amount, to, private_key) {
        const sender = web3.Keypair.fromSecretKey(bs58.decode(private_key))
        const receiver = new web3.PublicKey(to)
        
        const transaction = new web3.Transaction()
            .add(
                web3.SystemProgram.transfer({
                    fromPubkey: sender.publicKey,
                    toPubkey: receiver,
                    lamports: web3.LAMPORTS_PER_SOL * amount
                })
            )
    
        return await web3.sendAndConfirmTransaction(connection, transaction, [sender])
    }
}
